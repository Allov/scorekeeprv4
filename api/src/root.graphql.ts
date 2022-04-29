import { gql } from 'apollo-server';
import { gameTypeDefs } from './games/game.graphql';
import { playerTypeDefs } from './players/player.graphql';

export const rootTypeDefs = gql`
    type Query
    type Mutation
    schema {
        query: Query
        mutation: Mutation
    }
`
export const typeDefs = [
  rootTypeDefs,
  playerTypeDefs,
  gameTypeDefs,
]
