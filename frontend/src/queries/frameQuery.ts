import { gql } from '@apollo/client';

export const getFrameQuery = gql`
    query ($id: String!, $idx: Int) {
        frame(gameId: $id, frameIdx: $idx) {
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
