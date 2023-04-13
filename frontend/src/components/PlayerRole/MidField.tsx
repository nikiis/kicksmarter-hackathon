import React from "react";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import styles from "./Midfield.module.scss";

const MidField = () => {
  return (
    <>
      <h3>Midfielders</h3>
      <div className={styles.playerInfoContainer}>
        <PlayerInfo />
        <PlayerInfo />
        <PlayerInfo />
        <PlayerInfo />
      </div>
    </>
  );
};

export default MidField;
