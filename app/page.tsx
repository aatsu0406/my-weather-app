"use client";

import { useEffect, useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherState } from "@/types/weather";

export default function Home() {
  const [inputCity, setInputCity] = useState("");
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const fetchWeather = async (targetCity: string) => {
    if (!targetCity) return;
    try {
      setLoading(true);
      // STEP 1: 都市名から「緯度・経度」を調べる（Geocoding API）
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${targetCity}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl); //OpenWeatherMapのサーバーにデータを貰いに行く
      const geoData = await geoResponse.json(); //貰ったデータをJSON形式に変換する

      if (!geoData?.[0]) {
        alert("都市が見つかりませんでした。");
        return;
      }

      const { lat, lon, local_names, name } = geoData[0]; // 緯度と経度を取り出す
      const japaneseName = local_names?.ja || name; //name：フォールバック（代避策）

      // 【バリデーションcheck】
      if (!japaneseName.includes(targetCity) && !name.toLowerCase().includes(targetCity.toLowerCase())) {
        alert("一致する都市名が見つかりませんでした。");
        return;
      }

      // STEP 2: 緯度・経度を使って「今の天気」を調べる（Current Weather API）
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      setWeather({ ...weatherData, display_name: japaneseName });
    } catch (error) {
      alert("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Nishinomiya"); //初期表示の都市を設定（例: 西宮市）
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm">
        
        {/* 検索窓（パーツ呼び出し） */}
        <SearchForm 
          inputCity={inputCity} 
          setInputCity={setInputCity} 
          onSearch={() => fetchWeather(inputCity)} 
        />

        {/* 表示エリア（パーツ呼び出し） */}
        {loading ? (
          <div className="mt-20 mb-20 flex flex-col items-center text-slate-400 animate-pulse">
            <p>読み込み中...</p>
          </div>
        ) : (
          <WeatherCard weather={weather} />
        )}
        
      </div>
    </main>
  );
}