import SvgIcon from "@/components/SvgIcon/SvgIcon";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import RecentMatches from "@/components/RecentMatches/RecentMatches";
import styles from "../styles/pages/PageHome.module.scss";

const PageHome = () => {
  return (
    <main className={styles.pageHome}>
      <h1 className={styles.heading}>
        Welcome Back
        <span className={styles.name}>Craig Edwards</span>
      </h1>
      <div className={styles.homebutton}>
        <PrimaryButton label="View Past Matches" />
        <PrimaryButton
          label="Live Match Analysis"
          customClass={`${styles.btn} `}
        />
      </div>
      <RecentMatches /> {/*props and map? api data*/}
      <div className={styles.upcomingContainer}>
        <SvgIcon svgName="live" customClass={styles.live} />
        <div className={styles.upcoming}>
          <p>Upcoming Match</p>
          <p>Man City</p>
        </div>
      </div>
      <div className={styles.logocontainer}>
        <SvgIcon svgName="logo" customClass={styles.logo} />
      </div>
    </main>
  );
};

export default PageHome;
