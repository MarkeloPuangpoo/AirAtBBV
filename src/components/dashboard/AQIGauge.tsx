"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn, getAQIColor, getAQIStatus } from "@/lib/utils";
import { AQDataPoint } from "@/lib/types";
import { useLanguage } from "@/components/LanguageContext";

interface AQIGaugeProps {
    pm25: AQDataPoint;
}

export default function AQIGauge({ pm25 }: AQIGaugeProps) {
    const value = pm25.current;
    const colors = getAQIColor(value);
    const { t } = useLanguage();

    const getStatusText = (val: number) => {
        if (val <= 25) return t.status_good;
        if (val <= 50) return t.status_moderate;
        return t.status_unhealthy;
    };

    const status = getStatusText(value);

    const data = useMemo(() => [
        { name: "Current", value: Math.min(value, 100) },
        { name: "Remaining", value: Math.max(0, 100 - value) },
    ], [value]);

    return (
        <div className={cn(
            "relative overflow-hidden rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center justify-center text-center h-full min-h-[350px] md:min-h-[450px] transition-all duration-700 shadow-2xl hover:shadow-3xl ring-1 ring-white/20",
            "bg-gradient-to-br", colors.gradientString
        )}>
            {/* Grain Noise Texture (Optional: ถ้ามีรูป Noise ใส่จะเท่มาก) */}

            {/* Glass Overlay ที่ซ้อนกันหลายชั้น */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent" />

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
                <h2 className="text-white/90 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 md:mb-6 bg-black/10 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
                    {t.aqi_title}
                </h2>

                <div className="w-56 h-56 md:w-72 md:h-72 relative filter drop-shadow-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                startAngle={220} // ปรับองศาให้ดู Modern ขึ้น (เกือกม้ากว้าง)
                                endAngle={-40}
                                innerRadius="65%"
                                outerRadius="80%"
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={10} // ปลายมนโค้ง
                            >
                                <Cell fill="white" fillOpacity={0.95} />
                                <Cell fill="black" fillOpacity={0.1} />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Value */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                        <span className="text-6xl md:text-8xl font-black text-white drop-shadow-lg tracking-tighter leading-none scale-110">
                            {value}
                        </span>
                        <span className="text-white/80 text-sm md:text-lg font-medium mt-1 md:mt-2 bg-white/20 px-3 py-0.5 rounded-lg backdrop-blur-sm">
                            {pm25.unit}
                        </span>
                    </div>
                </div>

                <div className="mt-6 md:mt-8 px-6 md:px-8 py-2 md:py-3 bg-white/25 rounded-2xl backdrop-blur-xl border border-white/30 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <p className="text-white text-xl md:text-2xl font-bold tracking-wide">
                        {status}
                    </p>
                </div>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-white/30 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
        </div>
    );
}
