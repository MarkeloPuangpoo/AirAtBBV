"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, translations, Translation } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('th');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'th' ? 'en' : 'th');
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
