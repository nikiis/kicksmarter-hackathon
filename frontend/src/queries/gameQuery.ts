import { gql } from '@apollo/client';

export const getAllGamesQuery = gql`
    query {
        allGames {
            gameId
            startTime
            home {
                name
                score
            }
            away {
                name
                score
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
                jerseyColor
                secondaryColor
                players {
                    optaId
                    number
                    position
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
                jerseyColor
                secondaryColor
                players {
                    optaId
                    number
                    position
                }
                events {
                    type
                    period
                    outcome
                }
            }
            periods {
                startGameClock
                stopGameClock
                homeAttPositive
            }
        }
    }
`;
