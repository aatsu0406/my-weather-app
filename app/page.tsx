"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, Umbrella, Wind, Thermometer, Search, Droplets } from 'lucide-react'; // アイコン素材

export default function Home() {
  const [city, setCity] = useState("Nishinomiya");
  const [inputCity, setInputCity] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getWeatherIcon = (main: string) => {
    switch (main) {
      case "Clear":
        return <Sun className="text-yellow-400" />;
      case "Clouds":
        return <Cloud className="text-slate-400" />;
      case "Rain":
        return <Umbrella className="text-blue-400" />;
      default:
        return <Cloud className="text-slate-400" />;
    }
  };

  const fetchWeather = async (targetCity: string) => {
    if (!targetCity) return;
    try {
      setLoading(true);

      // STEP 1: 日本語名から緯度・経度を取得 (Geocoding API)
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${targetCity}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoData || geoData.length === 0) {
        alert("都市の位置情報が見つかりませんでした。都市名を確認してください。");
        setInputCity("");
        return;
      }

      const firstResult = geoData[0];
      const foundNameJa = firstResult.local_names?.ja || "";
      const foundNameEn = firstResult.name || "";

      // 【バリデーション】入力値が取得データの名前（日/英）に含まれているかチェック
      if (!foundNameJa.includes(targetCity) && !foundNameEn.toLowerCase().includes(targetCity.toLowerCase())) {
        alert(`「${targetCity}」と一致する正しい都市名が見つかりませんでした。都市名を確認してください。`);
        setInputCity("");
        return;
      }

      const { lat, lon } = firstResult;
      const japaneseName = foundNameJa || foundNameEn;

      // STEP 2: 緯度・経度を使って天気を取得
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (weatherData.cod !== 200) {
        alert("天気情報の取得に失敗しました。");
      } else {
        setWeather({ ...weatherData, display_name: japaneseName });
      }
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSearch = () => {
    fetchWeather(inputCity);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-sm">
        
        {/* 検索窓セクション (Enterキー対応) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-3 mb-10 w-full"
        >
          <div className="relative flex-1">
            <input 
              type="text"
              className="w-full p-2.5 pl-10 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-slate-700 text-sm"
              placeholder="都市名を入力（例: 大阪市）"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 text-sm shadow-md shadow-blue-200 cursor-pointer whitespace-nowrap"
          >
            検索
          </button>
        </form>

        {/* 表示エリアの切り替え */}
        {loading ? (
          <div className="mt-20 mb-20 flex flex-col items-center text-slate-400 animate-pulse">
            <p>読み込み中...</p>
          </div>
        ) : (
          <>
            {/* タイトル表示 */}
            <h1 className="text-black font-bold flex items-center gap-2">
              {weather && getWeatherIcon(weather.weather[0].main)}
              {weather ? `${weather.display_name} の今の天気` : "天気を調べてみよう！"}
            </h1>

            {weather && (
              <div className="mt-6 text-center">
                <div className="flex justify-center items-center gap-2">
                  <Thermometer className="w-10 h-10 text-red-500" />
                  <p className="text-5xl font-extrabold text-slate-800">
                    {Math.round(weather.main.temp)}°C
                  </p>
                </div>
                <div className="flex gap-4 justify-center text-sm mt-2">
                  <span className="text-red-500 font-bold">
                    最高 {Math.round(weather.main.temp_max)}°
                  </span>
                  <span className="text-blue-500 font-bold">
                    最低 {Math.round(weather.main.temp_min)}°
                  </span>
                </div>
                <p className="text-slate-500 mt-2">{weather.weather[0].description}</p>

                {/* 詳細カード */}
                <div className="flex justify-around mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center flex-col">
                    <div className="flex items-center gap-1 mb-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <p className="text-xs text-slate-400 font-medium">湿度</p>
                    </div>
                    <p className="font-bold text-lg text-slate-700">{weather.main.humidity}%</p>
                  </div>
                  <div className="flex items-center flex-col border-x border-slate-200 px-6">
                    <div className="flex items-center gap-1 mb-1">
                      <Thermometer className="w-4 h-4 text-red-400" />
                      <p className="text-xs text-slate-400 font-medium">体感</p>
                    </div>
                    <p className="font-bold text-lg text-slate-700">{Math.round(weather.main.feels_like)}°C</p>
                  </div>
                  <div className="flex items-center flex-col">
                    <div className="flex items-center gap-1 mb-1">
                      <Wind className="w-4 h-4 text-slate-400" />
                      <p className="text-xs text-slate-400 font-medium">風速</p>
                    </div>
                    <p className="font-bold text-lg text-slate-700">{weather.wind.speed}m/s</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}