import styles from "./LiveFeedWhole.module.scss";
import LiveFeed from "@/components/LiveFeed/LiveFeed";
import SvgIcon from "../SvgIcon/SvgIcon";

const LiveFeedWhole = () => {
  return (
    <div className={styles.liveFeedWhole}>
      <div className={styles.liveFeedContainer}>
        <div className={styles.FeedHeading}>
          <SvgIcon svgName="logoletters" customClass={styles.logoLetters} />
          <h2> Live Feed</h2>
        </div>
        <div className={styles.liveFeed}>
          <LiveFeed
            playerName="Chloe Kelley"
            timeStamp="14:08"
            text="has a player a part in the build up to 4 shots so far- more than any other player for us"
            colour="#65AFC6"
          />
          <LiveFeed
            playerName="Chloe Kelley"
            timeStamp="14:08"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit,Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            colour="red"
          />
          <LiveFeed
            playerName="Chloe Kelley"
            timeStamp="14:08"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit,Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            colour="aqua"
          />
          <LiveFeed
            playerName="Chloe Kelley"
            timeStamp="14:08"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit,Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            colour="antiquewhite"
          />
        </div>
      </div>
      <div className={styles.graphDataContainer}>
        <LiveFeed
          playerName="Chloe Kelley"
          timeStamp="14:08"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit,Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          colour="aqua"
        />
        <LiveFeed
          playerName="Chloe Kelley"
          timeStamp="14:08"
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit,Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          colour="antiquewhite"
        />
      </div>
    </div>
  );
};

export default LiveFeedWhole;
