"use client";

import { useLanguage } from './LanguageContext';
import { cn } from '@/lib/utils';

export default function LanguageToggle({ className }: { className?: string }) {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className={cn(
                "relative inline-flex h-9 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
                "bg-slate-200/80 backdrop-blur-sm hover:bg-slate-300",
                className
            )}
        >
            <span className="sr-only">Toggle Language</span>
            <span
                className={cn(
                    "pointer-events-none block h-8 w-8 rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out flex items-center justify-center text-xs font-bold text-slate-700",
                    language === 'en' ? "translate-x-7" : "translate-x-0"
                )}
            >
                {language === 'th' ? 'TH' : 'EN'}
            </span>
        </button>
    );
}