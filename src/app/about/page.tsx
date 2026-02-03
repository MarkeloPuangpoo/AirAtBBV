"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Users, Zap, Code2, Award, Cpu } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import Image from "next/image";

function AboutContent() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-[family-name:var(--font-geist-sans)] overflow-hidden relative">

            {/* Background Blobs (Animation) */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob [animation-delay:2s]"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob [animation-delay:4s]"></div>
            </div>

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">

                {/* Header */}
                <header className="flex items-center justify-between pt-4">
                    <Link href="/" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-white/60 text-slate-600 hover:text-slate-900 hover:bg-white transition-all duration-300 hover:shadow-md">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="font-medium">{t.about_back}</span>
                    </Link>
                    <LanguageToggle />
                </header>

                {/* Main Content Card (Glassmorphism) */}
                <div className="bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-6 md:p-12 shadow-xl space-y-12">

                    {/* Hero Section */}
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-xs font-bold uppercase tracking-widest">
                            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                            Official Project
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                            <span className="block text-2xl md:text-3xl font-bold text-slate-500 mb-2 font-mono uppercase tracking-widest">{t.about_title_pre}</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600">
                                {t.about_title_main}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                            {t.about_description}
                        </p>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* Left: Device Photo (Large) */}
                        <div className="md:col-span-7 flex flex-col gap-4">
                            <div className="relative group rounded-[2.5rem] overflow-hidden border border-white/50 shadow-lg aspect-[4/3] md:aspect-auto md:h-full bg-slate-100">
                                <Image
                                    src="/IMG_8324.JPG" // อย่าลืมไฟล์รูปนี้นะครับ
                                    alt="Station Setup"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                                <div className="absolute bottom-0 left-0 p-8 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Active Station</span>
                                    </div>
                                    <h3 className="text-2xl font-bold">{t.about_device_label}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Right: Credits & Tech (Stacked) */}
                        <div className="md:col-span-5 flex flex-col gap-6">

                            {/* Developed By */}
                            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4 text-slate-800">
                                    <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                                        <Users size={24} />
                                    </div>
                                    <h4 className="text-xl font-bold">{t.credit_developed_by}</h4>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></div>
                                        <div>
                                            <p className="font-bold text-slate-700">{t.credit_student_council}</p>
                                            <p className="text-xs text-slate-500">Project Management</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></div>
                                        <div>
                                            <p className="font-bold text-slate-700">{t.credit_cs_club}</p>
                                            <p className="text-xs text-slate-500">Software & IoT Development</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Tech Stack */}
                            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-slate-800 rounded-xl text-emerald-400">
                                            <Cpu size={24} />
                                        </div>
                                        <h4 className="text-xl font-bold">{t.credit_tech_stack}</h4>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                        {t.credit_tech_desc}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Next.js 16', 'TypeScript', 'Tailwind', 'KidBright'].map((tech) => (
                                            <span key={tech} className="px-2 py-1 rounded-md bg-white/10 text-xs font-mono text-emerald-300 border border-white/5">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Advisor Section (Bottom) */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-full shadow-sm text-indigo-600">
                                <Award size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{t.credit_advisor}</h4>
                                <p className="text-sm text-slate-500">ครูที่ปรึกษากลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี</p>
                            </div>
                        </div>
                        {/* Placeholder for Teacher's Name if needed */}
                        {/* <div className="text-right">
                             <p className="font-bold text-slate-700">คุณครูใจดี นามสมมติ</p>
                         </div> */}
                    </div>

                </div>

                {/* Footer */}
                <footer className="text-center pb-8">
                    <p className="text-sm text-slate-400 font-medium">© 2026 Bang Pakong "Bowon Witthayayon" School</p>
                </footer>

            </div>
        </main>
    );
}

export default function AboutPage() {
    return (
        <LanguageProvider>
            <AboutContent />
        </LanguageProvider>
    );
}
