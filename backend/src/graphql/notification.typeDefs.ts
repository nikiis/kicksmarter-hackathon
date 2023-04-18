export const typeDefs = `#graphql
  type Notification {
    gameClock: Int!
    message: String!
    team: String!
    imgs: [String]
  }

  type Query {
    notifications(gameId: String!): [Notification]!
    notification(gameId: String!, gameClock: Int!): Notification
  }
`;
