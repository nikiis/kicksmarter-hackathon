export interface PlayerStats {
    ownGoals: number;
    goals: number;
    assists: number;
    penaltiesScored: number;
    penaltiesMissed: number;
    penaltiesSaved: number;
}

export interface Player {
    number: number;
    position: string;
    optaId: string; //main id
    ssiId: string;
    statBombId: number;
    name: string;
    birthDate: string;
    gender: string;
    height?: number;
    weight?: number;
    country: string;
    stats: PlayerStats;
    xy?: Array<number>;
    openness: number;
}
