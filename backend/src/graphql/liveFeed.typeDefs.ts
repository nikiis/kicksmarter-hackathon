export const typeDefs = `#graphql
  type LiveFeed {
    gameClock: Int!
    name: String!
    message: String!
    team: String!
    imgs: [String]
  }

  type Query {
    allLiveFeeds(gameId: String!): [LiveFeed]!
    liveFeed(gameId: String!, gameClock: Int!): LiveFeed
  }
`;
