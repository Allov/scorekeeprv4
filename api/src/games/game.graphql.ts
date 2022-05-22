import { gql } from 'apollo-server';

export const gameTypeDefs = gql`
  type Game {
    id: ID!
    name: String!
    shareId: String!
    creatorId: String!
    players: [Player]
  }

  type CreatedGame {
    id: ID!,
    shareId: String!
  }

  extend type Query {
    game(id: ID!): Game
    gameByShareId(name: String): Game
    games: [Game]
    myGames: [Game]
  }

  extend type Mutation {
    createGame(name: String, playerCount: Int): CreatedGame
    updateGame(id: String, newName: String): Game
    resetGameScore(id: ID!): Game
    reorderPlayers(gameId: ID!, playerIds: [ID!]): Game
  }
`
