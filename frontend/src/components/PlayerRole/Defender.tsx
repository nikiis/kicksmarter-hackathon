import React from "react";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import styles from "./Defender.module.scss";

const Defender = () => {
  return (
    <>
      <h3>Defenders</h3>
      <div className={styles.playerInfoContainer}>
        <PlayerInfo />
        <PlayerInfo />
        <PlayerInfo />
        <PlayerInfo />
      </div>
    </>
  );
};

export default Defender;
