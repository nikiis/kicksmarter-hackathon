export const typeDefs = `#graphql
  type Player {
    playerId: ID!
    number: Int!
    xyz: [Float!]!
    speed: Float!
    optaId: String!
  }

  type Frame {
    period: Int!
    frameIdx: Int!
    gameClock: Float!
    wallClock: Float!
    homePlayers: [Player!]!
    awayPlayers: [Player!]!
  }

  type Query {
    frame(gameId: String!, frameIdx: Int, gameClock: Float): Frame
  }
`;
