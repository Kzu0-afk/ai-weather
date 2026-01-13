"use client";

import { useEffect } from "react";
import { WeatherResponse } from "../../lib/api";
import { addRecentSearch } from "../../lib/storage";
import WeatherDisplay from "./WeatherDisplay";

interface CityWeatherWrapperProps {
  data: WeatherResponse;
}

export default function CityWeatherWrapper({ data }: CityWeatherWrapperProps) {
  useEffect(() => {
    // Add to recent searches when city page loads
    addRecentSearch({
      name: data.city,
      country: data.country,
      countryCode: data.country,
      savedAt: new Date().toISOString(),
    });
  }, [data.city, data.country]);

  return <WeatherDisplay data={data} />;
}

