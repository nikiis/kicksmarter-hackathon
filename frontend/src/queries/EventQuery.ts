import { gql } from '@apollo/client';

export const getAllEventsQuery = gql`
    query ($gameId: String!) {
        allEvents(gameId: $gameId) {
            shots {
                gameClock
                xG
                team {
                    jerseyColor
                    secondaryColor
                }
                player {
                    name
                    number
                    optaId
                    position
                }
                length
            }
            progressivePasses {
                gameClock
                xG
                team {
                    jerseyColor
                    secondaryColor
                }
                player {
                    name
                    number
                    optaId
                    position
                }
                length
            }
            progressiveCarries {
                gameClock
                xG
                team {
                    jerseyColor
                    secondaryColor
                }
                player {
                    name
                    number
                    optaId
                    position
                }
                length
            }
            keyPasses {
                gameClock
                xG
                team {
                    jerseyColor
                    secondaryColor
                }
                player {
                    name
                    number
                    optaId
                    position
                }
                length
            }
            goals {
                gameClock
                xG
                team {
                    jerseyColor
                    secondaryColor
                }
                player {
                    name
                    number
                    optaId
                    position
                }
                length
            }
        }
    }
`;
