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
            }
        }
    }
`;
