import { FC } from "react";
import styles from "./LiveFeed.module.scss";
import { Livefeedprops } from "@/interfaces/components/LivefeedProps";

const LiveFeed: FC<Livefeedprops> = ({
  playerName,
  text,
  timeStamp,
  colour,
}) => {
  return (
    <div
      className={styles.cardWrapper}
      style={{ border: `3px solid ${colour}` }}
    >
      <p>{timeStamp}</p>
      <p>
        <span style={{ color: colour }}>{playerName}</span>
        {text}
      </p>
    </div>
  );
};

export default LiveFeed;
