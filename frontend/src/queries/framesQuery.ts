import { gql } from '@apollo/client';

export const getFramesQuery = gql`
    query ($id: String!, $startClock: Float, $stopClock: Float) {
        frames(gameId: $id, startGameClock: $startClock, stopGameClock: $stopClock) {
            homePlayers {
                number
                xy
                optaId
            }
            awayPlayers {
                xy
                number
                optaId
            }
            ball {
                xyz
                speed
            }
        }
    }
`;
