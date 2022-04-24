import { gql } from 'apollo-server';


export const playerTypeDefs = gql`
    type Player {
        id: ID!
        name: String
    }

    extend type Query {
        player(id: ID!): Player
        playerByName(name: String): Player
    }
`;
