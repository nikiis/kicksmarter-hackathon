export const typeDefs = `#graphql
  enum EventType {
    SHOTS
    GOALS
    KEY_PASSES
    PROGRESSIVE_PASSES
    PROGRESSIVE_CARRIES
  }

  type Event {
    gameClock: Int!
    player: Player
    team: Team!
    xG: Float
    length: Float
  }

  type Query {
    events(gameId: String!, type: EventType!): [Event]!
  }
`;
