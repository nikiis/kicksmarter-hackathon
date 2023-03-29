export const typeDefs = `#graphql
  type Player {
    playerId: ID!
    number: Int!
    xyz: [Float!]!
    speed: Float!
    optaId: String!
  }

  type Ball {
    xyz: [Float!]!
    speed: Float!
  }

  type Frame {
    period: Int!
    frameIdx: Int!
    gameClock: Float!
    wallClock: Float!
    live: Boolean!
    lastTouch: String!
    homePlayers: [Player!]!
    awayPlayers: [Player!]!
    ball: Ball!

  }

  type Query {
    frame(gameId: String!, frameIdx: Int, gameClock: Float): Frame
    frames(gameId: String!, startFrameIdx: Int, stopFrameIdx: Int, startGameClock: Float, stopGameClock: Float): [Frame]
  }
`;