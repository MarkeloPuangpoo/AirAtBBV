"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Bell, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertStatus, setAlertStatus] = useState<{ success?: boolean; message?: string } | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setIsAuthenticated(true);
            } else {
                alert("รหัสผ่านไม่ถูกต้อง!");
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน");
        }
    };

    const triggerAlert = async () => {
        setLoading(true);
        setAlertStatus(null);
        try {
            const res = await fetch("/api/alert");
            const data = await res.json();
            if (res.ok) {
                setAlertStatus({ success: true, message: `ส่งแจ้งเตือนสำเร็จ! (PM2.5: ${data.pm25})` });
            } else {
                setAlertStatus({ success: false, message: data.message || "เกิดข้อผิดพลาด" });
            }
        } catch (error) {
            setAlertStatus({ success: false, message: "เชื่อมต่อ Server ไม่ได้" });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50 w-full max-w-md">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-500">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
                        <p className="text-slate-500 text-sm">LOMbbv Control Panel</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800"
                            placeholder="Enter Password..."
                        />
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white/50">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                            <Image src="/logo-1.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                            <p className="text-xs text-slate-500">System Control</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-sm text-red-500 font-medium hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Card */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">System Status</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-slate-600 font-medium">Online & Monitoring</span>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                <Bell size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">LINE Notification</h3>
                        </div>

                        <p className="text-sm text-slate-500 mb-6">
                            Manually trigger a check and notification. Note: Will only send if PM2.5 {'>'}= 50.
                        </p>

                        <button
                            onClick={triggerAlert}
                            disabled={loading}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all shadow-md",
                                loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                            )}
                        >
                            {loading ? (
                                <>Loading...</>
                            ) : (
                                <>
                                    <Bell size={18} />
                                    Trigger Alert Check
                                </>
                            )}
                        </button>

                        {alertStatus && (
                            <div className={cn(
                                "mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2",
                                alertStatus.success ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                            )}>
                                {alertStatus.success ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                                {alertStatus.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
