import styles from "./RecentMatches.module.scss";

const RecentMatches = () => {
  const dummyMatches = [
    {
      id: 1,
      dateTime: "Sun, 05-MAR-2023, 14:01",
      type: "FA WSL",
      teams: ["Manchester City WFC", "Tottenham Hotspur WFC"],
      score: "3 - 1",
    },
    {
      id: 2,
      dateTime: "Sun, 26-FEB-2023, 14:01",
      type: "Women's FA Cup",
      teams: ["Bristol City", "Manchester City WFC"],
      score: "1 - 8",
    },
    {
      id: 3,
      dateTime: "Sun, 05-Mar-2023, 14:01",
      type: "FA Women's League Club",
      teams: ["Arsenal", "Manchester City WFC"],
      score: "1 - 0",
    },
  ];
  return (
    <div className={styles.recentMatches}>
      <h2>Most Recent Matches</h2>

      <div className={styles.matchesContainer}>
        {dummyMatches.map((match) => {
          return (
            <div className={styles.matches} key={match.id}>
              <div className={styles.dateTime}>
                <p>{match.dateTime}</p>
                <span>{match.type}</span>
              </div>
              <div className={styles.teamScore}>
                <p>{match.teams[0]}</p>
                <p className={styles.scores}>{match.score}</p>
                <p>{match.teams[1]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMatches;
