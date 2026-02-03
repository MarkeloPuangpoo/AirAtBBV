"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Lock, Bell, CheckCircle, AlertTriangle, Activity, Users, RefreshCw, Copy, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Alert State
    const [loading, setLoading] = useState(false);
    const [alertStatus, setAlertStatus] = useState<{ success?: boolean; message?: string } | null>(null);

    // Group ID State
    const [detectedGroupId, setDetectedGroupId] = useState<string | null>(null);
    const [targetId, setTargetId] = useState(""); // เอาไว้ใส่ ID ที่จะทดสอบส่ง
    const [isScanning, setIsScanning] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (res.ok && data.success) setIsAuthenticated(true);
            else alert("รหัสผ่านไม่ถูกต้อง!");
        } catch (error) { alert("Error checking password"); }
    };

    // ฟังก์ชันสแกนหา Group ID (Polling)
    const scanForGroup = async () => {
        setIsScanning(true);
        try {
            const res = await fetch('/api/webhook'); // เรียก API หูทิพย์
            const data = await res.json();
            if (data.groupId) {
                setDetectedGroupId(data.groupId);
                setTargetId(data.groupId); // ใส่ลงช่อง Input อัตโนมัติ
            }
        } catch (e) { console.error(e); }
        setIsScanning(false);
    };

    // ตั้งเวลาสแกนทุก 3 วินาที (เมื่อเปิดหน้า Admin)
    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(scanForGroup, 3000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const triggerAlert = async () => {
        if (!targetId) {
            alert("กรุณาระบุ Target ID ก่อน (User ID หรือ Group ID)");
            return;
        }

        setLoading(true);
        setAlertStatus(null);
        try {
            // ส่ง targetId ไปด้วย
            const res = await fetch(`/api/alert?targetId=${targetId}`);
            const data = await res.json();
            if (res.ok) {
                setAlertStatus({ success: true, message: `ส่งแล้ว! (PM2.5: ${data.pm25}) ไปที่ ${targetId.substring(0, 6)}...` });
            } else {
                setAlertStatus({ success: false, message: data.details || "เกิดข้อผิดพลาด" });
            }
        } catch (error) {
            setAlertStatus({ success: false, message: "เชื่อมต่อ Server ไม่ได้" });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("คัดลอก ID แล้ว! (อย่าลืมเอาไปใส่ใน Vercel Environment Variables เพื่อใช้ถาวร)");
    };

    if (!isAuthenticated) {
        // ... (หน้า Login เหมือนเดิม) ...
        return (
            <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                {/* ... Code Login เดิม ... */}
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
        <main className="min-h-screen p-4 md:p-8 bg-slate-50">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white/50">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                            <Image src="/logo-1.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                            <p className="text-xs text-slate-500">System Control Center</p>
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

                    {/* 1. Group Manager (NEW!) */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 md:col-span-2 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">จัดการกลุ่ม LINE (Group Manager)</h3>
                                <p className="text-xs text-slate-500">ดักจับ ID กลุ่มและทดสอบส่งข้อความ</p>
                            </div>

                            {/* Radar Animation */}
                            <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-500">
                                <RefreshCw size={12} className={cn(isScanning && "animate-spin")} />
                                {isScanning ? "Scanning..." : "Idle"}
                            </div>
                        </div>

                        {/* Zone แสดงผล ID ที่เจอ */}
                        <div className="mb-6 p-6 bg-slate-100/50 rounded-2xl border border-slate-200 text-center space-y-3">
                            {detectedGroupId ? (
                                <>
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-2">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-700">เจอ Group ID แล้ว!</h4>
                                    <div className="flex items-center justify-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm max-w-md mx-auto">
                                        <code className="text-sm font-mono text-slate-600 break-all">{detectedGroupId}</code>
                                        <button onClick={() => copyToClipboard(detectedGroupId)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-amber-600 mt-2">
                                        ⚠️ สำคัญ: ให้ Copy ID นี้ไปใส่ใน Vercel (Settings {'>'} Env Vars {'>'} LINE_USER_ID) เพื่อให้บอทจำได้ถาวร
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 text-slate-400 mb-2">
                                        <Users size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-700">ยังไม่พบกลุ่มใหม่...</h4>
                                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                        1. เชิญบอทเข้ากลุ่มไลน์<br />
                                        2. พิมพ์ข้อความอะไรก็ได้ในกลุ่ม<br />
                                        3. รอสักครู่ ID จะเด้งขึ้นมาตรงนี้
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Test Send Zone */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                value={targetId}
                                onChange={(e) => setTargetId(e.target.value)}
                                placeholder="ใส่ User ID หรือ Group ID (U... หรือ C...)"
                                className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                            />
                            <button
                                onClick={triggerAlert}
                                disabled={loading}
                                className={cn(
                                    "px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2",
                                    loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                                )}
                            >
                                {loading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                                ทดสอบส่ง
                            </button>
                        </div>

                        {/* Alert Status Feedback */}
                        {alertStatus && (
                            <div className={cn(
                                "mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2",
                                alertStatus.success ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                            )}>
                                {alertStatus.success ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                                {alertStatus.message}
                            </div>
                        )}
                    </div>

                    {/* 2. System Status (เหมือนเดิม) */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50">
                        {/* ... Code Status Card เดิม ... */}
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
                            <span className="text-slate-600 font-medium">Monitoring Active</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-4">
                            ระบบกำลังทำงานและตรวจสอบค่าฝุ่นทุกชั่วโมง
                        </p>
                    </div>

                    {/* 3. Manual Check (เหมือนเดิมแต่ย่อลง) */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                <Bell size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Manual Check</h3>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">
                            ตรวจสอบค่าฝุ่นตอนนี้ (ระบบจะใช้การตั้งค่า Default)
                        </p>
                        <button className="w-full py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed">
                            Auto-Check (Running)
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
