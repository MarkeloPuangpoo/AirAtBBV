"use client";

import { getAQILevel } from "@/lib/utils";
import { AQDataPoint } from "@/lib/types";
import { Activity, ShieldCheck, TriangleAlert } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface HealthRecommendationsProps {
    pm25: AQDataPoint;
}

export default function HealthRecommendations({ pm25 }: HealthRecommendationsProps) {
    const level = getAQILevel(pm25.current);
    const { t } = useLanguage();

    const content = {
        good: {
            title: t.health_title_good,
            description: t.health_desc_good,
            icon: Activity,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        moderate: {
            title: t.health_title_moderate,
            description: t.health_desc_moderate,
            icon: ShieldCheck,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        unhealthy: {
            title: t.health_title_unhealthy,
            description: t.health_desc_unhealthy,
            icon: TriangleAlert,
            color: "text-rose-600",
            bg: "bg-rose-50",
        }
    };

    // Adjust icons based on level
    type RecommendationKey = 'good' | 'moderate' | 'unhealthy';

    // Explicitly let it infer as standard object with string properties since t returns strings now
    let selectedContent = content.good;
    let Icon = Activity;

    if (level === 'moderate') {
        selectedContent = content.moderate;
        Icon = ShieldCheck;
    } else if (level === 'unhealthy') {
        selectedContent = content.unhealthy;
        Icon = TriangleAlert;
        // I shall check if I can import Mask, maybe it exists in new versions. 
        // If not, I'll use generic.
    }

    // Note: I can't easily check if Mask exists without running, so I'll stick to safe ones.
    // Activity is requested.

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-white/60 h-full flex flex-col justify-center hover:shadow-lg hover:bg-white/80 transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className={`p-4 rounded-2xl ${selectedContent.bg}`}>
                    <Icon className={`w-8 h-8 ${selectedContent.color}`} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {selectedContent.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                        {selectedContent.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
