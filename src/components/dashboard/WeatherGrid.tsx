"use client";

import { WeatherData } from "@/lib/types";
import { Thermometer, Droplets, Wind, CloudFog } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/components/LanguageContext";
import { cn } from "@/lib/utils";

// Component ย่อยสำหรับการ์ดแต่ละใบ (ลดโค้ดซ้ำ)
const BentoCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn(
        "bg-white/60 backdrop-blur-xl p-5 rounded-[2rem] shadow-sm border border-white/60",
        "hover:shadow-lg hover:bg-white/80 transition-all duration-300 hover:-translate-y-1",
        className
    )}>
        {children}
    </div>
);

export default function WeatherGrid({ data }: { data: WeatherData }) {
    const { t } = useLanguage();
    const mockTempHistory = [{ temp: 28 }, { temp: 29 }, { temp: 31 }, { temp: 32.5 }, { temp: 33 }, { temp: 32 }, { temp: 31 }];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
            {/* Temp */}
            <BentoCard className="col-span-2 sm:col-span-1 flex flex-col justify-between group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-orange-100/80 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
                        <Thermometer size={20} />
                    </div>
                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wide">{t.temp}</span>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-4xl font-black text-slate-800 tracking-tighter">{data.temp.current}</span>
                        <span className="text-slate-500 ml-1 font-medium">{data.temp.unit}</span>
                    </div>
                    <div className="h-10 w-24 opacity-70 group-hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockTempHistory}>
                                <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </BentoCard>

            {/* Humidity */}
            <BentoCard className="col-span-1 flex flex-col justify-between group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-blue-100/80 rounded-2xl text-blue-600 group-hover:rotate-12 transition-transform">
                        <Droplets size={20} />
                    </div>
                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wide">{t.humidity}</span>
                </div>
                <div>
                    <span className="text-4xl font-black text-slate-800 tracking-tighter">{data.humid.current}</span>
                    <span className="text-slate-500 ml-1 font-medium">{data.humid.unit}</span>
                </div>
            </BentoCard>

            {/* Wind */}
            <BentoCard className="col-span-1 flex flex-col justify-between group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-cyan-100/80 rounded-2xl text-cyan-600 group-hover:skew-x-6 transition-transform">
                        <Wind size={20} />
                    </div>
                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wide">{t.wind}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="leading-none">
                        <span className="text-3xl font-black text-slate-800 tracking-tighter">{data.wind_speed.current}</span>
                        <div className="text-xs text-slate-500 font-bold mt-1">{data.wind_speed.unit}</div>
                    </div>
                    <div className="relative w-12 h-12 bg-white rounded-full shadow-inner border border-slate-100 flex items-center justify-center">
                        <span className="absolute text-[8px] top-1 text-slate-400 font-bold">N</span>
                        <div style={{ transform: `rotate(${data.wind_direct.current}deg)` }} className="transition-transform duration-1000 ease-in-out origin-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-800 drop-shadow-sm">
                                <path d="M12 2L19 21L12 17L5 21L12 2Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </BentoCard>

            {/* PM10 */}
            <BentoCard className="col-span-2 lg:col-span-4 lg:grid-cols-1 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100/80 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
                        <CloudFog size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">{t.pm10}</p>
                        <p className="text-xs text-slate-400 font-medium">{t.pm10_desc}</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black text-slate-800 tracking-tighter">{data.pm10.current}</span>
                    <span className="text-slate-500 text-sm ml-1 font-medium">{data.pm10.unit}</span>
                </div>
            </BentoCard>
        </div>
    );
}