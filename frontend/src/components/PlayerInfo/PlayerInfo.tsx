import React from "react";
import styles from "./PlayerInfo.module.scss";
import SvgIcon from "../SvgIcon/SvgIcon";

const PlayerInfo = () => {
  return (
    <div className={styles.playerWrapper}>
      <div className={styles.img}></div>
      <div className={styles.playerInfo}>
        <div className={styles.nameNumber}>
          <p>Steph Houghton</p>
          <span>6</span>
        </div>
        <div className={styles.country}>
          <SvgIcon svgName="england-flag" customClass={styles.flag} />
          <p>ENG</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
