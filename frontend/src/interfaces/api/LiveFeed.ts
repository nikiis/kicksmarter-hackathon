export interface LiveFeed {
    gameClock: number;
    message: string;
    imgs: Array<string>;
    team: String;
}

export interface AllLiveFeeds {
    allLiveFeeds: Array<LiveFeed>;
}
