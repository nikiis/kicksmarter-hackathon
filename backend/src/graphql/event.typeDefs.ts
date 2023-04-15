export const typeDefs = `#graphql
  type Event {
    gameClock: Int!
    player: Player
    team: Team!
    xG: Float
    length: Float
  }

  type Events {
    shots: [Event]
    goals: [Event]
    keyPasses: [Event]
    progressivePasses: [Event]
    progressiveCarries: [Event]
  }
  type Query {
    allEvents(gameId: String!): Events!
  }
`;
