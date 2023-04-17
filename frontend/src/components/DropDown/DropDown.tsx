import { useState } from "react";
import styles from "./DropDown.module.scss";
import SvgIcon from "../SvgIcon/SvgIcon";

const DropDown = () => {
  const [show, setShow] = useState(false);

  const showDropDown = () => {
    if (!show) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <div className={styles.dropdown} onClick={showDropDown}>
      <div className={styles.dropdownPlaceholder}>
        <p>Season</p>
        <div className={styles.inner}>
          <span>2022-2023</span>
          <SvgIcon
            svgName="arrow-down"
            customClass={`${styles.arrow} ${show ? styles.open : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default DropDown;
