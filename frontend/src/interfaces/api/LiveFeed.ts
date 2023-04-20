export interface LiveFeed {
    gameClock: number;
    message: string;
    imgs: Array<string>;
    team: string;
    name: string;
}

export interface AllLiveFeeds {
    allLiveFeeds: Array<LiveFeed>;
}
