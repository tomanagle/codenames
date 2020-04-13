// src/schema.ts
import { gql } from 'apollo-server'

const typeDefs = gql`
    input GameUpdatedInput {
        permalink: String
    }
    type Subscription {
        GameUpdated(input: GameUpdatedInput!): Game
    }

    enum Team {
        red
        green
        none
    }

    enum Role {
        spymaster
        player
    }

    enum Language {
        English
        Adult
    }

    type User {
        _id: ID!
        team: Team!
        role: Role!
        name: String
    }

    type Word {
        _id: ID!
        label: String!
        team: Team
        picked: Boolean
        death: Boolean
        language: Language
    }

    type Game {
        _id: ID!
        permalink: String!
        users: [User]
        finished: Boolean
        words: [Word]
        currentTurn: Team
    }
    input GetGameInput {
        permalink: String!
    }

    type Query {
        game(input: GetGameInput!): Game
    }

    input PickWordInput {
        word: ID!
        user: ID!
        permalink: String!
    }
    input ResetGameInput {
        gameId: ID!
    }

    input JoinGameInput {
        permalink: String!
        team: Team!
        role: Role!
        name: String
    }

    input EndTurnInput {
        permalink: String!
    }

    type Mutation {
        StartGame: Game
        JoinGame(input: JoinGameInput!): User!
        PickWord(input: PickWordInput!): Game
        ResetGame(input: ResetGameInput!): Game!
        EndTurn(input: EndTurnInput!): Game!
    }
`

export default typeDefs
