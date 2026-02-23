"use client";

import React, { useState, useEffect } from "react";
import { StationData } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import AQIGauge from "@/components/dashboard/AQIGauge";
import WeatherGrid from "@/components/dashboard/WeatherGrid";
import HealthRecommendations from "@/components/dashboard/HealthRecommendations";
import Link from "next/link";
import { MapPin, Share2, Info, ArrowRight } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import HistorySection from "@/components/dashboard/HistorySection";
import Image from "next/image";
import SocialShareModal from "@/components/dashboard/SocialShareModal";

// Initial empty state or loading state
function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { t } = useLanguage();
  const [timeStr, setTimeStr] = useState<string>("");

  // Fallback Mock Data
  const FALLBACK_DATA: StationData = {
    "_profile": {
      "station_name": "Bangpakong Bowonwittayayon School",
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

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/school-history');
      const data = await res.json();
      if (!data.error && Array.isArray(data)) {
        setHistoryData(data);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchRealData();
    fetchHistory();
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
                <Image src="/logo-1.png" alt="School Logo" fill className="object-contain drop-shadow-sm" priority sizes="(max-width: 768px) 48px, 64px" />
              </div>
              <div className="w-px h-8 bg-slate-300/50"></div>
              <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform hover:scale-110 duration-300">
                <Image src="/logo-2.png" alt="Project Logo" fill className="object-contain drop-shadow-sm" priority sizes="(max-width: 768px) 48px, 64px" />
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="p-2 bg-white/40 backdrop-blur-md rounded-xl border border-white/50 text-slate-600 hover:bg-white/60 transition-colors shadow-sm"
                title={t.share_button}
              >
                <Share2 size={20} />
              </button>
              <LanguageToggle />
            </div>

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
        {/* History Section (NEW!) */}
        <section className="pt-8 border-t border-slate-200/50">
          <HistorySection data={historyData} />
        </section>

        {/* About Me Button */}
        <section className="flex justify-center pt-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 hover:bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <span className="text-slate-600 font-medium group-hover:text-emerald-600 transition-colors">
              {t.about_me_button}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-12 mb-8">
          <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200/50">

            <div className="flex flex-col items-center md:items-start gap-1">
              <h3 className="text-lg font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                LOMbbv Monitor
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Bangpakong "Bowonwittayayon" School
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/bbv.038531400" className="p-2.5 bg-white/60 hover:bg-white text-slate-600 hover:text-blue-600 rounded-full transition-all hover:scale-110 shadow-sm border border-white/50 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com/bbv.studentcouncil/" className="p-2.5 bg-white/60 hover:bg-white text-slate-600 hover:text-pink-600 rounded-full transition-all hover:scale-110 shadow-sm border border-white/50 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://airatbbv.vercel.app" className="p-2.5 bg-white/60 hover:bg-white text-slate-600 hover:text-emerald-600 rounded-full transition-all hover:scale-110 shadow-sm border border-white/50 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </a>
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs text-slate-400 font-medium">Developed by Student Council</p>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">© 2026 BBV School</p>
            </div>

          </div>
        </footer>

        {/* Social Share Modal */}
        {stationData && (
          <SocialShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            data={stationData}
          />
        )}
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
