import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <main className={styles.panel}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.heading}>City Not Found</h2>
          <p className={styles.message}>
            We couldn't find weather data for this city. Please check the city
            name and try again.
          </p>
          <Link href="/" className={styles.link}>
            ← Back to Search
          </Link>
        </div>
      </main>
    </div>
  );
}

