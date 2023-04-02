import { gql } from '@apollo/client';

export const getAllGamesQuery = gql`
    query {
        allGames {
            gameId
            home {
                name
            }
            away {
                name
            }
            description
        }
    }
`;

export const getGameQuery = gql`
    query ($id: String) {
        game(gameId: $id) {
            gameId
            description
            startTime
            pitchLength
            pitchWidth
            fps
            home {
                name
                score
                color
                players {
                    optaId
                    number
                }
                events {
                    type
                    period
                    outcome
                }
            }
            away {
                name
                score
                color
                players {
                    optaId
                    number
                }
                events {
                    type
                    period
                    outcome
                }
            }
        }
    }
`;
