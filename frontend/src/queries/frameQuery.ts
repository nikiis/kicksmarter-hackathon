import { gql } from '@apollo/client';

export const getFrameQuery = gql`
    query ($id: String!, $clock: Float) {
        frame(gameId: $id, gameClock: $clock) {
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
