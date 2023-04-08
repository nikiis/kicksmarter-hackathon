import { gql } from '@apollo/client';

export const getFramesQuery = gql`
    query ($id: String!, $startFrameIdx: Int, $stopFrameIdx: Int) {
        frames(gameId: $id, startFrameIdx: $startFrameIdx, stopFrameIdx: $stopFrameIdx) {
            gameClock
            frameIdx
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
