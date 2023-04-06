import { gql } from '@apollo/client';

export const getFramesQuery = gql`
    query ($id: String!, $startClock: Float, $stopClock: Float) {
        frames(gameId: $id, startGameClock: $startClock, stopGameClock: $stopClock) {
            homePlayers {
                number
                xy
                optaId
                openness
            }
            awayPlayers {
                xy
                number
                optaId
                openness
            }
            ball {
                xyz
                speed
            }
        }
    }
`;
