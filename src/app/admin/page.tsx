"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    Lock, Bell, CheckCircle, AlertTriangle, Activity, Users,
    RefreshCw, Copy, Send, Trash2, Radio, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

// Interface สำหรับข้อมูลกลุ่ม
interface GroupData {
    group_id: string;
    added_at: string;
}

export default function AdminPage() {
    // Auth State
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Data State
    const [groups, setGroups] = useState<GroupData[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    // Alert State
    const [sending, setSending] = useState(false);
    const [alertStatus, setAlertStatus] = useState<{ success?: boolean; message?: string } | null>(null);

    // Target State
    const [targetId, setTargetId] = useState("");

    // Auto Scan State
    const [detectedGroupId, setDetectedGroupId] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);

    // --- 1. LOGIN SYSTEM ---
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
                fetchGroups(); // Login ผ่านแล้วดึงข้อมูลกลุ่มทันที
            } else alert("รหัสผ่านไม่ถูกต้อง!");
        } catch (error) { alert("Error checking password"); }
    };

    // --- 2. DATA FETCHING ---
    const fetchGroups = async () => {
        setLoadingGroups(true);
        try {
            const res = await fetch('/api/groups');
            const data = await res.json();
            if (data.groups) setGroups(data.groups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoadingGroups(false);
        }
    };

    const scanForGroup = async () => {
        setIsScanning(true);
        try {
            // เรียก webhook เพื่อดูว่ามีกลุ่มใหม่เข้ามาล่าสุดหรือไม่ (ถ้า API Webhook รองรับ)
            // หรือในเวอร์ชั่น DB นี้ เราใช้วิธี Refresh รายชื่อกลุ่มแทนได้
            await fetchGroups();

            // ถ้าอยากใช้ logic เดิมที่ดู cache ก็เรียก /api/webhook ได้
            const res = await fetch('/api/webhook');
            const data = await res.json();
            if (data.latestGroup && data.latestGroup.group_id) {
                // ถ้า group id นี้ยังไม่อยู่ใน list หรือเป็นตัวล่าสุด
                setDetectedGroupId(data.latestGroup.group_id);
            }
        } catch (e) { console.error(e); }
        setIsScanning(false);
    };

    // Auto Refresh ทุก 5 วินาที
    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(scanForGroup, 5000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    // --- 3. ACTIONS ---
    const triggerAlert = async (specificTarget: string | null = null) => {
        const finalTarget = specificTarget || targetId; // ถ้าส่ง parameter มาให้ใช้ตัวนั้น (เช่นกดจากปุ่มใน list)
        const isBroadcast = !finalTarget; // ถ้าไม่มี target เลย คือ Broadcast

        if (!isBroadcast && !finalTarget) {
            alert("กรุณาระบุ Target ID");
            return;
        }

        if (isBroadcast && !confirm(`⚠️ ยืนยันการส่งหา "ทุกกลุ่ม" (${groups.length} กลุ่ม)?`)) return;

        setSending(true);
        setAlertStatus(null);
        try {
            // ถ้ามี target ใส่ query param, ถ้าไม่มี (Broadcast) ไม่ต้องใส่
            const url = finalTarget ? `/api/alert?targetId=${finalTarget}` : '/api/alert';

            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                setAlertStatus({
                    success: true,
                    message: isBroadcast
                        ? `Broadcast สำเร็จ! (ส่งหา ${groups.length} กลุ่ม)`
                        : `ส่งแล้ว! (PM2.5: ${data.pm25})`
                });
                if (!isBroadcast) setTargetId(finalTarget); // Update input
            } else {
                setAlertStatus({ success: false, message: data.details || "เกิดข้อผิดพลาด" });
            }
        } catch (error) {
            setAlertStatus({ success: false, message: "Server Error" });
        } finally {
            setSending(false);
        }
    };

    const deleteGroup = async (id: string) => {
        if (!confirm("คุณแน่ใจหรือไม่ที่จะลบกลุ่มนี้? บอทจะไม่ส่งแจ้งเตือนหากลุ่มนี้อีก")) return;
        try {
            await fetch(`/api/groups?id=${id}`, { method: 'DELETE' });
            setGroups(groups.filter(g => g.group_id !== id)); // Update UI ทันที
        } catch (error) {
            alert("ลบไม่สำเร็จ");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // เล็กๆ น้อยๆ feedback
    };

    // --- RENDER ---
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50 w-full max-w-md">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-500">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
                        <p className="text-slate-500 text-sm">LOMbbv Air Monitor</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800"
                            placeholder="Secret Password"
                        />
                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95">
                            Enter Dashboard
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen p-4 md:p-8 bg-slate-50/50">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <header className="flex flex-wrap items-center justify-between bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white/50 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center overflow-hidden">
                            {/* ใส่ Logo ถ้ามี หรือใช้ Icon */}
                            <Activity className="text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Mission Control</h1>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <p className="text-xs text-slate-500 font-medium">System Online</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Connected Groups</span>
                            <span className="text-2xl font-bold text-slate-700 leading-none">{groups.length}</span>
                        </div>
                        <button onClick={() => setIsAuthenticated(false)} className="bg-white hover:bg-red-50 text-slate-600 hover:text-red-500 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-200">
                            Log out
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN: Controls */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* 1. Broadcast Control */}
                        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                    <Radio size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800">Broadcast Center</h3>
                            </div>

                            <p className="text-sm text-slate-500 mb-4">
                                ส่งการแจ้งเตือนหา <b>ทุกกลุ่ม ({groups.length})</b> พร้อมกันทันที
                            </p>

                            <button
                                onClick={() => triggerAlert(null)} // null = broadcast
                                disabled={sending || groups.length === 0}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2",
                                    sending ? "bg-slate-400" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95"
                                )}
                            >
                                {sending ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                                {sending ? "Broadcasting..." : "BROADCAST ALL"}
                            </button>
                        </div>

                        {/* 2. Manual Send */}
                        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                                    <Smartphone size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800">Manual Test</h3>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={targetId}
                                    onChange={(e) => setTargetId(e.target.value)}
                                    placeholder="Paste Group/User ID here..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                                <button
                                    onClick={() => triggerAlert(targetId)}
                                    disabled={sending || !targetId}
                                    className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-sm transition-all"
                                >
                                    Test Send
                                </button>
                            </div>

                            {/* Status Feedback */}
                            {alertStatus && (
                                <div className={cn(
                                    "mt-4 p-3 rounded-xl flex items-start gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-1",
                                    alertStatus.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                )}>
                                    {alertStatus.success ? <CheckCircle size={14} className="mt-0.5" /> : <AlertTriangle size={14} className="mt-0.5" />}
                                    <span>{alertStatus.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Group List (DATABASE) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-sm min-h-[500px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">Active Groups</h3>
                                        <p className="text-xs text-slate-500">รายชื่อกลุ่มใน Database (Neon)</p>
                                    </div>
                                </div>
                                <button
                                    onClick={fetchGroups}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
                                    title="Refresh List"
                                >
                                    <RefreshCw size={20} className={cn(loadingGroups && "animate-spin")} />
                                </button>
                            </div>

                            {/* New Detected Alert */}
                            {detectedGroupId && !groups.some(g => g.group_id === detectedGroupId) && (
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between animate-in zoom-in-95">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-3 w-3 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold text-green-800">New Group Detected!</p>
                                            <code className="text-xs text-green-600 font-mono">{detectedGroupId}</code>
                                        </div>
                                    </div>
                                    <button
                                        onClick={fetchGroups}
                                        className="text-xs bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all"
                                    >
                                        Refresh List
                                    </button>
                                </div>
                            )}

                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-1 text-center">#</div>
                                <div className="col-span-6 md:col-span-7">Group ID</div>
                                <div className="col-span-5 md:col-span-4 text-right">Actions</div>
                            </div>

                            {/* List Items */}
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {loadingGroups ? (
                                    <div className="text-center py-10 text-slate-400">Loading database...</div>
                                ) : groups.length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-300 mb-3">
                                            <Users size={24} />
                                        </div>
                                        <p className="text-slate-500 font-medium">No groups connected yet.</p>
                                        <p className="text-xs text-slate-400">Invite the bot to a group to start.</p>
                                    </div>
                                ) : (
                                    groups.map((group, index) => (
                                        <div key={group.group_id} className="group flex items-center bg-white border border-slate-100 p-3 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all">

                                            {/* Index */}
                                            <div className="w-8 text-center text-xs font-bold text-slate-300">
                                                {index + 1}
                                            </div>

                                            {/* ID Info */}
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <code className="text-xs md:text-sm font-mono text-slate-700 truncate block">
                                                        {group.group_id}
                                                    </code>
                                                    <button
                                                        onClick={() => copyToClipboard(group.group_id)}
                                                        className="text-slate-300 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Copy size={12} />
                                                    </button>
                                                </div>
                                                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                    Added: {new Date(group.added_at).toLocaleDateString('th-TH')}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => triggerAlert(group.group_id)}
                                                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                                                    title="Test Send"
                                                >
                                                    <Send size={14} />
                                                </button>
                                                <button
                                                    onClick={() => deleteGroup(group.group_id)}
                                                    className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                                    title="Remove Group"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
