import React from "react";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import styles from "./GoalKeeper.module.scss";

const GoalKeeper = () => {
  return (
    <>
      <h3>Goal Keepers</h3>
      <div className={styles.playerInfoContainer}>
        <PlayerInfo />
        <PlayerInfo />
        <PlayerInfo />
        <PlayerInfo />
      </div>
    </>
  );
};

export default GoalKeeper;
