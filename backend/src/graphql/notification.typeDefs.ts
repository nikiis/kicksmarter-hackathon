export const typeDefs = `#graphql
  type Notification {
    gameClock: Int!
    name: String!
    message: String!
    team: String!
    imgs: [String]
  }

  type Query {
    allNotifications(gameId: String!): [Notification]!
    notification(gameId: String!, gameClock: Int!): Notification
  }
`;
