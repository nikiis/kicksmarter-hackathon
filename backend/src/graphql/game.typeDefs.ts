export const typeDefs = `#graphql
  type Period {
    number: Int!
    startFrameClock: Float!
    endFrameClock: Float!
    startFrameIdx: Int!
    endFrameIdx: Int!
    homeAttPositive: Boolean!
  }

  type PlayerStats {
    ownGoals: Int!
    goals: Int!
    assists: Int!
    penaltiesScored: Int!
    penaltiesMissed: Int!
    penaltiesSaved: Int!
  }

  type Player {
    number: Int!
    position: String!
    optaId: String!
    ssiId: String!
    statBombId: Int!
    name: String!
    birthDate: String!
    gender: String!
    height: Float
    weight: Float
    country: String!
    stats: PlayerStats!
  }

  type Team {
    color: String!
    players: [Player!]!
  }

  type Game {
    id: ID!
    gameId: String!
    description: String!
    startTime: Float!
    pitchLength: Float!
    pitchWidth: Float!
    fps: Float!
    periods: [Period!]!
    home: Team!
    away: Team!
  }

  type Query {
    game(gameId: String!): Game
    allGames: [Game]
  }
`;