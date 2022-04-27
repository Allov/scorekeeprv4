import 'source-map-support/register'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { resolvers } from './root.resolvers'
import { typeDefs } from './root.graphql'
import express, { Request, Response } from 'express'
import session from 'express-session'
import MongoDBStoreModule from 'connect-mongodb-session'
import http from 'http'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { ScorekeeprContext } from './scorekeepr-context';
import { User } from './users/user.types';
import { prisma } from './prisma-singleton'

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express()
  const httpServer = http.createServer(app)

  var MongoDBStore = MongoDBStoreModule(session)

  const cookieExpirationTimeInMs = 1000 * 60 * 60 * 24 * 30; // 30 days
  app.use(session({
    secret: process.env.SESSION_SECRET as string,
    store: new MongoDBStore({
      uri: process.env.DATABASE_URL as string,
      collection: 'session'
    }),
    cookie: {
      httpOnly: false,
      maxAge: cookieExpirationTimeInMs,
      sameSite: 'none',
      secure: true
    },
    resave: false,
    saveUninitialized: true,
  }))
  app.use(cookieParser(process.env.SESSION_SECRET as string))
  app.use(morgan('tiny'))
  app.set('trust proxy', 1)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    context: async ({ req, res }: { req: Request, res: Response }): Promise<ScorekeeprContext> => {
      const token = req.headers.authorization || ''
      const user = await getUser(token, req)

      return {
        user,
        req,
        res
      }
    }
  })

  await server.start()

  server.applyMiddleware({
    app,
    cors: {
      origin: ['https://studio.apollographql.com'],
      credentials: true
    }
  })

  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

async function getUser(token: string, req: Request): Promise<User> {
  if (token == '') {
    token = req.sessionID

    const user: User = {
      id: '',
      name: '',
      token
    };

    const databaseUser = await prisma.user.findFirst({
      where: { sessionId: req.sessionID }
    })

    if (databaseUser == null) {
      const createdUser = await prisma.user.create({
        data: {
          name: 'Anonymous',
          sessionId: req.sessionID
        }
      })

      user.id = createdUser.id
      user.name = createdUser.name
    } else {
      user.id = databaseUser.id
      user.name = databaseUser.name
    }

    return user
  }

  throw new Error('Authentication not supported yet.')
}

startApolloServer(typeDefs, resolvers)
