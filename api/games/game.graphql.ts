import { gql } from 'apollo-server';

export const gameTypeDefs = gql`
  type Game {
    id: ID!
    name: String!
    shareId: String!
    creatorId: String!
  }

  extend type Query {
    game(id: ID!): Game
    gameByShareId(name: String): Game
    games: [Game]
  }

  extend type Mutation {
    createGame(name: String, playerCount: Int): Game
  }
`
