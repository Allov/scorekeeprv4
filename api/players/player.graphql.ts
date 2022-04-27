import { gql } from 'apollo-server';

export const playerTypeDefs = gql`
    type Player {
        id: ID!
        name: String
        score: Int
    }

    extend type Query {
        player(id: ID!): Player
        playerByName(name: String): Player
    }

    extend type Mutation {
      createPlayerAndAddToGame(name: String!, gameId: ID!): Player
      updatePlayer(id: ID!, newName: String, newScore: Int): Player
      removePlayerFromGame(id: ID!, gameId: ID!): Player
    }
`
