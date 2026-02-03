"use client";

import React, { useState, useEffect } from "react";
import { StationData } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import AQIGauge from "@/components/dashboard/AQIGauge";
import WeatherGrid from "@/components/dashboard/WeatherGrid";
import HealthRecommendations from "@/components/dashboard/HealthRecommendations";
import { MapPin } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Image from "next/image";

// Initial empty state or loading state
function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [stationData, setStationData] = useState<StationData | null>(null);
  const { t } = useLanguage();
  const [timeStr, setTimeStr] = useState<string>("");

  // Fallback Mock Data
  const FALLBACK_DATA: StationData = {
    "_profile": {
      "station_name": "Bang Pakong School (Mock)",
      "latitude": 13.504,
      "longitude": 101.001
    },
    "data": {
      "pm2.5": { "current": 35.5, "unit": "µg/m³" },
      "pm10": { "current": 45.0, "unit": "µg/m³" },
      "temp": { "current": 32.5, "unit": "°C" },
      "humid": { "current": 60.2, "unit": "%" },
      "wind_speed": { "current": 2.5, "unit": "m/s" },
      "wind_direct": { "current": 180, "unit": "deg" },
      "rain": { "current": 0, "unit": "mm" }
    },
    "meta": { "_ts": 1770091202 }
  };

  const fetchRealData = async () => {
    try {
      const res = await fetch('/api/school-weather');
      // Check if response is ok (status 200-299)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const realData = await res.json();

      if (realData.error) throw new Error(realData.error);

      // API now returns the formatted structure directly
      setStationData(realData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to mock data on error so UI doesn't break
      setStationData(FALLBACK_DATA);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
    const interval = setInterval(fetchRealData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stationData?.meta?._ts) {
      setTimeStr(formatTime(stationData.meta._ts));
    }
  }, [stationData]);

  if (loading || !stationData) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading Station Data...</p>
        </div>
      </main>
    );
  }

  const { _profile: profile, data } = stationData;

  // ... (Imports เดิม)

  // เปลี่ยนส่วน Header และ Container
  return (
    <main className="min-h-screen text-slate-900 p-4 pb-20 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header: ปรับให้ดู Clean ขึ้น */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-6">
          <div className="space-y-4">

            {/*  logos */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform hover:scale-110 duration-300">
                <Image src="/logo-1.png" alt="School Logo" fill className="object-contain drop-shadow-sm" />
              </div>
              <div className="w-px h-8 bg-slate-300/50"></div>
              <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform hover:scale-110 duration-300">
                <Image src="/logo-2.png" alt="Project Logo" fill className="object-contain drop-shadow-sm" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/50 backdrop-blur-md shadow-sm w-fit mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t.station_label}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-600 tracking-tighter">
                {profile.station_name}
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <LanguageToggle />
            <div className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 text-right shadow-sm">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{t.last_updated}</p>
              <p className="text-xl font-bold font-mono text-slate-700">{timeStr || "--:--"}</p>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Hero: AQI Gauge */}
          <section className="lg:col-span-5 xl:col-span-4 flex flex-col">
            <AQIGauge pm25={data["pm2.5"]} />
          </section>

          {/* Right Column: Details */}
          <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">

            {/* Health (ทำให้เด่นขึ้น) */}
            <div className="flex-none transition-transform hover:scale-[1.01] duration-300">
              <HealthRecommendations pm25={data["pm2.5"]} />
            </div>

            {/* Weather Grid */}
            <div className="flex-grow">
              <WeatherGrid data={data} />
            </div>

          </section>
        </div>

        {/* Footer */}
        <footer className="flex justify-center mt-12">
          <p className="text-xs text-slate-400 bg-white/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
            © 2026 {profile.station_name} • Designed by สภานักเรียนโรงเรียนบางปะกง "บวรวิทยายน"
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  );
}
