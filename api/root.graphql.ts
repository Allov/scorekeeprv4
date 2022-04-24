import { gql } from 'apollo-server';
import { playerTypeDefs } from './players/player.graphql';

export const rootTypeDefs = gql`
    type Query
    schema {
        query: Query
    }
`
export const typeDefs = [
  rootTypeDefs,
  playerTypeDefs
]
