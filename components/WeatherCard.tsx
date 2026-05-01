"use client";

import { Cloud, Sun, Umbrella, Wind, Thermometer, Droplets } from 'lucide-react';

interface WeatherCardProps {
  weather: any;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  if (!weather) return <h1 className="text-black font-bold text-center">天気を調べてみよう！</h1>;

  const getWeatherIcon = (main: string) => {
    switch (main) {
      case "Clear": return <Sun className="text-yellow-400" />;
      case "Clouds": return <Cloud className="text-slate-400" />;
      case "Rain": return <Umbrella className="text-blue-400" />;
      default: return <Cloud className="text-slate-400" />;
    }
  };

  return (
    <div className="fade-in">
      <h1 className="text-black font-bold flex items-center gap-2">
        {getWeatherIcon(weather.weather[0].main)}
        {weather.display_name} の今の天気
      </h1>

      <div className="mt-6 text-center">
        <div className="flex justify-center items-center gap-2">
          <Thermometer className="w-10 h-10 text-red-500" />
          <p className="text-5xl font-extrabold text-slate-800">
            {Math.round(weather.main.temp)}°C
          </p>
        </div>
        
        <div className="flex gap-4 justify-center text-sm mt-2">
          <span className="text-red-500 font-bold">最高 {Math.round(weather.main.temp_max)}°</span>
          <span className="text-blue-500 font-bold">最低 {Math.round(weather.main.temp_min)}°</span>
        </div>
        
        <p className="text-slate-500 mt-2">{weather.weather[0].description}</p>

        {/* 詳細グリッド */}
        <div className="grid grid-cols-3 gap-2 mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <DetailItem icon={<Droplets className="text-blue-400" />} label="湿度" value={`${weather.main.humidity}%`} />
          <DetailItem icon={<Thermometer className="text-red-400" />} label="体感" value={`${Math.round(weather.main.feels_like)}°C`} isCenter />
          <DetailItem icon={<Wind className="text-slate-400" />} label="風速" value={`${weather.wind.speed}m/s`} />
        </div>
      </div>
    </div>
  );
};

// さらに小さいパーツ（湿度など）も分けておくと完璧！
const DetailItem = ({ icon, label, value, isCenter }: any) => (
  <div className={`flex items-center flex-col ${isCenter ? 'border-x border-slate-200 px-2' : ''}`}>
    <div className="flex items-center gap-1 mb-1">
      {icon}
      <p className="text-[10px] text-slate-400 font-medium">{label}</p>
    </div>
    <p className="font-bold text-sm text-slate-700">{value}</p>
  </div>
);