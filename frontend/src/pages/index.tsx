import { useState } from "react";

import SplashScreen from "@/components/SplashScreen/SplashScreen";
import PageHome from "./PageHome";
import styles from "@/styles/pages/Home.module.scss";

export default function Home() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  setTimeout(() => setShowSplashScreen(false), 4000);

  return (
    <>
      <div
        className={`${showSplashScreen ? styles.show : styles.hide} ${
          styles.splashScreen
        }`}
      >
        <SplashScreen />
      </div>
      <div className={styles.home}>
        <div className={styles.container}>
          <PageHome />
        </div>
      </div>
    </>
  );
}
