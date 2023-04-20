import { gql } from '@apollo/client';

export const getAllGamesQuery = gql`
    query {
        allGames {
            gameId
            startTime
            home {
                name
                score
                jerseyColor
            }
            away {
                name
                score
                jerseyColor
            }
            description
            league
            live
        }
    }
`;

export const getGameQuery = gql`
    query ($id: String) {
        game(gameId: $id) {
            gameId
            description
            league
            live
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
                    name
                    country
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
                    name
                    country
                }
            }
            periods {
                startGameClock
                stopGameClock
                startFrameIdx
                stopFrameIdx
                homeAttPositive
            }
        }
    }
`;
