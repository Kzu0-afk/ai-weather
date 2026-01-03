import Link from "next/link";
import { notFound } from "next/navigation";
import WeatherDisplay from "../../components/WeatherDisplay";
import CitySearch from "../../components/CitySearch";
import { fetchWeather } from "../../../lib/api";
import styles from "./page.module.css";

interface CityPageProps {
  params: Promise<{
    name: string;
  }>;
}

export async function generateMetadata({ params }: CityPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  
  return {
    title: `${decodedName} Weather | AI Weather`,
    description: `Current weather conditions for ${decodedName}. Temperature, humidity, wind speed, and conditions.`,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  try {
    const data = await fetchWeather(decodedName);

    return (
      <div className={styles.page}>
        <main className={styles.panel}>
          <header className={styles.header}>
            <div>
              <p className={styles.kicker}>
                <Link href="/" className={styles.link}>
                  AI Weather
                </Link>
                {" · 静"}
              </p>
              <h1>Weather in {data.city}</h1>
              <p className={styles.subhead}>
                Current conditions and essential weather data for {data.city},
                {data.country}.
              </p>
            </div>
            <div className={styles.badge}>Minimal JP</div>
          </header>

          <CitySearch initialCity="" />
          <WeatherDisplay data={data} />
        </main>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

