"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { CloudRain, Thermometer, Wind } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface HistoryItem {
    date: string; // "28 Nov"
    ts: number;
    pm25: number;
    temp: number;
    humid: number;
}

export default function HistorySection({ data }: { data: HistoryItem[] }) {
    const [activeTab, setActiveTab] = useState<'pm25' | 'temp'>('pm25');
    const { t } = useLanguage();

    // ถ้าไม่มีข้อมูล ให้แสดงว่างๆ
    if (!data || data.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {t.history_title}
                </h2>

                {/* Switcher ปุ่มเลือกดูกราฟ */}
                <div className="bg-white/40 backdrop-blur-md p-1 rounded-xl border border-white/50 flex gap-1">
                    <button
                        onClick={() => setActiveTab('pm25')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'pm25' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/20'}`}
                    >
                        {t.history_pm25_btn}
                    </button>
                    <button
                        onClick={() => setActiveTab('temp')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'temp' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:bg-white/20'}`}
                    >
                        {t.history_temp_btn}
                    </button>
                </div>
            </div>

            {/* 1. กราฟแนวโน้ม (Glass Chart) */}
            <div className="h-[350px] w-full bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-sm p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPm" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />

                        {activeTab === 'pm25' ? (
                            <Area
                                type="monotone"
                                dataKey="pm25"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPm)"
                                name={t.history_pm25_btn}
                            />
                        ) : (
                            <Area
                                type="monotone"
                                dataKey="temp"
                                stroke="#f97316"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTemp)"
                                name={t.history_temp_btn}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* 2. ตารางข้อมูล (Glass Table) */}
            <div className="overflow-hidden rounded-3xl border border-white/60 shadow-sm bg-white/40 backdrop-blur-md">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-white/50 border-b border-white/40">
                        <tr>
                            <th className="px-6 py-4 font-bold">{t.history_table_date}</th>
                            <th className="px-6 py-4 font-bold">{t.history_table_aq}</th>
                            <th className="px-6 py-4 font-bold text-center">{t.history_table_pm25}</th>
                            <th className="px-6 py-4 font-bold text-center">{t.history_table_temp}</th>
                            <th className="px-6 py-4 font-bold text-center">{t.history_table_humid}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40">
                        {[...data].reverse().map((item, index) => ( // กลับด้านให้ล่าสุดอยู่บน
                            <tr key={index} className="hover:bg-white/30 transition-colors group">
                                <td className="px-6 py-4 font-medium text-slate-700">
                                    {item.date}
                                </td>
                                <td className="px-6 py-4">
                                    {/* Logic สีจุด Status */}
                                    <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.pm25 <= 25 ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200' :
                                        item.pm25 <= 50 ? 'bg-amber-100/80 text-amber-700 border-amber-200' :
                                            'bg-rose-100/80 text-rose-700 border-rose-200'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.pm25 <= 25 ? 'bg-emerald-500' : item.pm25 <= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}></span>
                                        {item.pm25 <= 25 ? t.history_status_good : item.pm25 <= 50 ? t.history_status_moderate : t.history_status_unhealthy}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-600">
                                    {item.pm25}
                                </td>
                                <td className="px-6 py-4 text-center text-slate-600">
                                    <span className="inline-flex items-center gap-1">
                                        <Thermometer size={14} className="text-orange-500" />
                                        {item.temp}°
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center text-slate-600">
                                    <span className="inline-flex items-center gap-1">
                                        <CloudRain size={14} className="text-blue-500" />
                                        {item.humid}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
