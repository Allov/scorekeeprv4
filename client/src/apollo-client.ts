import {
  ApolloClient,
  InMemoryCache,
} from '@apollo/client'

export const client = new ApolloClient({
  uri: `https://${window.location.hostname}:4000/graphql`,
  cache: new InMemoryCache(),
  credentials: 'include'
})

