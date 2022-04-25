import 'source-map-support/register'
import { ApolloServer, Config, ExpressContext } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { resolvers } from './root.resolvers'
import { typeDefs } from './root.graphql'
import express, { Request } from 'express'
import session from 'express-session'
import MongoDBStoreModule from 'connect-mongodb-session'
import http from 'http'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

async function startApolloServer(typeDefs: any, resolvers: any) {
  const app = express()
  const httpServer = http.createServer(app)

  var MongoDBStore = MongoDBStoreModule(session)

  app.use(session({
    secret: process.env.SESSION_SECRET as string,
    store: new MongoDBStore({
      uri: process.env.DATABASE_URL as string,
      collection:  'session'
    }),
    cookie: {
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: 'none',
      secure: true
    },
    resave: false,
    saveUninitialized: true,
  }))
  app.use(cookieParser(process.env.SESSION_SECRET as string))
  app.use(morgan('tiny'))
  app.set('trust proxy', 1)
  // app.use(cors({
  //   origin: '*',
  //   methods: '*',
  //   credentials: true
  // }))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    context: async ({ req }: { req: Request }) => {
      const token = req.headers.authorization || ''
      const user = await getUser(token, req)

      console.log(user)

      return { user }
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

async function getUser(token: string, req: Request) {
  if (token == '') {
    token = req.sessionID
  }

  return {
    token
  }
}

startApolloServer(typeDefs, resolvers)
