import { ApolloServer, Config } from 'apollo-server'
import { ExpressContext } from 'apollo-server-express'
import { resolvers } from './root.resolvers'
import { typeDefs } from './root.graphql';

async function startApolloServer(typeDefs: any, resolvers: any) {
  const server = new ApolloServer({ typeDefs, resolvers } as Config<ExpressContext>);
  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
}

startApolloServer(typeDefs, resolvers)
