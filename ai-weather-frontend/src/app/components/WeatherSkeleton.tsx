import styles from "./WeatherSkeleton.module.css";

export default function WeatherSkeleton() {
  return (
    <section className={styles.result} aria-label="Loading weather data">
      <div className={styles.resultHeader}>
        <div>
          <div className={styles.skeletonTitle}></div>
          <div className={styles.skeletonMeta}></div>
        </div>
        <div className={styles.skeletonCondition}></div>
      </div>

      <div className={styles.grid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.card}>
            <div className={styles.skeletonLabel}></div>
            <div className={styles.skeletonValue}></div>
          </div>
        ))}
      </div>
    </section>
  );
}

