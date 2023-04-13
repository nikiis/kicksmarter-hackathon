import React from "react";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import styles from "./Forward.module.scss";

const Forward = () => {
  return (
    <>
      <h3>Forwards</h3>
      <div className={styles.playerInfoContainer}>
        <PlayerInfo />
        <PlayerInfo />
        <PlayerInfo />
        <PlayerInfo />
      </div>
    </>
  );
};

export default Forward;
