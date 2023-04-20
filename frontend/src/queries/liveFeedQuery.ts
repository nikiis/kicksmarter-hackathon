import { gql } from '@apollo/client';

export const getAllLiveFeedsQuery = gql`
    query ($id: String!) {
        allLiveFeeds(gameId: $id) {
            gameClock
            imgs
            name
            message
            team
        }
    }
`;
