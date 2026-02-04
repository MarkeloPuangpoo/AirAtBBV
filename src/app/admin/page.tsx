"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Lock, Activity, Users, RefreshCw, Copy, Send, Trash2,
    Radio, Smartphone, Search, X, CheckCircle2, AlertCircle,
    Zap, ShieldCheck, Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface GroupData {
    group_id: string;
    added_at: string;
}

interface Toast {
    id: number;
    message: string;
    type: "success" | "error" | "info";
}

// --- Components ---

// 1. Toast Notification Component (แจ้งเตือนสวยๆ แทน alert)
const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) => {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-right-full",
                        toast.type === "success" ? "bg-emerald-50/90 border-emerald-200 text-emerald-700" :
                            toast.type === "error" ? "bg-red-50/90 border-red-200 text-red-700" :
                                "bg-white/90 border-slate-200 text-slate-700"
                    )}
                >
                    {toast.type === "success" && <CheckCircle2 size={18} />}
                    {toast.type === "error" && <AlertCircle size={18} />}
                    {toast.type === "info" && <Zap size={18} />}
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-60">
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default function AdminPage() {
    // --- State ---
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Data
    const [groups, setGroups] = useState<GroupData[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Search State

    // Operations
    const [sending, setSending] = useState(false);
    const [targetId, setTargetId] = useState("");

    // Notifications
    const [toasts, setToasts] = useState<Toast[]>([]);

    // --- Helpers ---
    const addToast = (message: string, type: Toast["type"] = "info") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000); // Auto close
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const filteredGroups = useMemo(() => {
        return groups.filter(g => g.group_id.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [groups, searchQuery]);

    // --- Actions ---

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
                addToast("Login Successful", "success");
                fetchGroups();
            } else {
                addToast("Invalid Password", "error");
            }
        } catch (error) { addToast("Connection Error", "error"); }
    };

    const fetchGroups = async () => {
        setLoadingGroups(true);
        try {
            const res = await fetch('/api/groups');
            const data = await res.json();
            if (data.groups) setGroups(data.groups);
        } catch (error) {
            addToast("Failed to fetch groups", "error");
        } finally {
            setLoadingGroups(false);
        }
    };

    // Auto Refresh Logic
    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(() => {
            // Silent refresh logic here if needed
            // For UI demo, we keep it manual or simple
        }, 10000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const triggerAlert = async (specificTarget: string | null = null) => {
        const finalTarget = specificTarget || targetId;
        const isBroadcast = !finalTarget;

        if (!isBroadcast && !finalTarget) {
            addToast("Please specify a Target ID", "error");
            return;
        }

        if (isBroadcast && !confirm(`⚠️ Confirm Broadcast to ALL ${groups.length} groups?`)) return;

        setSending(true);
        try {
            const url = finalTarget ? `/api/alert?targetId=${finalTarget}` : '/api/alert';
            const res = await fetch(url);
            const data = await res.json();

            if (res.ok) {
                addToast(isBroadcast ? `Broadcast Sent to ${groups.length} groups` : `Sent! PM2.5: ${data.pm25}`, "success");
                if (!isBroadcast) setTargetId(finalTarget);
            } else {
                addToast(data.details || "Send Failed", "error");
            }
        } catch (error) {
            addToast("Server Error", "error");
        } finally {
            setSending(false);
        }
    };

    const deleteGroup = async (id: string) => {
        if (!confirm("Are you sure you want to remove this group?")) return;
        try {
            await fetch(`/api/groups?id=${id}`, { method: 'DELETE' });
            setGroups(groups.filter(g => g.group_id !== id));
            addToast("Group removed", "success");
        } catch (error) {
            addToast("Delete failed", "error");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast("Copied to clipboard", "info");
    };

    // --- Render: Login Screen ---
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-0 -right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/50 w-full max-w-md z-10 relative">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 rotate-3 hover:rotate-6 transition-transform">
                            <Lock className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Portal</h1>
                        <p className="text-slate-500 mt-2">Access Control for Air Monitor Bot</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 pl-12 rounded-2xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                                placeholder="Enter Security Code"
                            />
                            <ShieldCheck className="absolute left-4 top-4 text-slate-400" size={20} />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>Authenticate</span>
                            <Send size={16} />
                        </button>
                    </form>
                </div>
                <ToastContainer toasts={toasts} removeToast={removeToast} />
            </main>
        );
    }

    // --- Render: Main Dashboard ---
    return (
        <main className="min-h-screen bg-slate-50/50 text-slate-800 pb-20">
            {/* Top Navigation */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">Air Monitor <span className="text-indigo-600">HQ</span></h1>
                            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">System Operational</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-xs font-semibold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-full transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 space-y-8">

                {/* 1. Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={18} /></div>
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Live</span>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Total Groups</p>
                            <h3 className="text-2xl font-bold text-slate-800">{groups.length}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Activity size={18} /></div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">API Status</p>
                            <h3 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                                Online <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </h3>
                        </div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between relative overflow-hidden group">
                        <div className="z-10">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Broadcast System</p>
                            <h3 className="text-xl font-bold">Ready to Notify</h3>
                            <p className="text-xs text-slate-400 mt-1">Send PM2.5 alerts to everyone</p>
                        </div>
                        <button
                            onClick={() => triggerAlert(null)}
                            disabled={sending}
                            className="z-10 bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
                        >
                            {sending ? <RefreshCw className="animate-spin" size={16} /> : <Radio size={16} />}
                            Broadcast
                        </button>
                        {/* Decor */}
                        <Radio className="absolute -right-6 -bottom-6 text-white/5 w-32 h-32 transform rotate-12 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 2. Control Panel (Left) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                                    <Terminal size={20} />
                                </div>
                                <h2 className="font-bold text-lg text-slate-800">Debug Console</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 mb-2 block ml-1">MANUAL TARGET ID</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={targetId}
                                            onChange={(e) => setTargetId(e.target.value)}
                                            placeholder="Uxxxxxxxx..."
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500/50 transition-all text-slate-700"
                                        />
                                        <Smartphone className="absolute left-3 top-3 text-slate-400" size={16} />
                                    </div>
                                </div>

                                <button
                                    onClick={() => triggerAlert(targetId)}
                                    disabled={sending || !targetId}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Send size={16} />
                                    Test Send
                                </button>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Tips</h4>
                                    <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                                        <li>Leave Target ID empty to use Broadcast.</li>
                                        <li>Click copy icon in the list to fill ID.</li>
                                        <li>Data refreshes automatically.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Database List (Right) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col min-h-[600px]">
                            {/* Header & Filter */}
                            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg text-slate-800">Database</h2>
                                        <p className="text-xs text-slate-400">Manage connected LINE groups</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search ID..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-full text-xs font-medium w-48 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={fetchGroups}
                                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <RefreshCw size={18} className={cn(loadingGroups && "animate-spin")} />
                                    </button>
                                </div>
                            </div>

                            {/* List Content */}
                            <div className="flex-1 overflow-y-auto p-2">
                                {loadingGroups ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                                        <RefreshCw className="animate-spin text-indigo-200" size={32} />
                                        <p className="text-sm">Syncing with database...</p>
                                    </div>
                                ) : filteredGroups.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <Search size={24} className="opacity-20" />
                                        </div>
                                        <p className="text-sm">No groups found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredGroups.map((group, index) => (
                                            <div
                                                key={group.group_id}
                                                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                                            >
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-inner">
                                                        {index + 1}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <code className="text-sm font-bold text-slate-700 font-mono truncate max-w-[150px] md:max-w-xs block">
                                                                {group.group_id}
                                                            </code>
                                                            <button
                                                                onClick={() => copyToClipboard(group.group_id)}
                                                                className="text-slate-300 hover:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Copy size={12} />
                                                            </button>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                            Connected: {new Date(group.added_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setTargetId(group.group_id);
                                                            addToast(`Target set to ${group.group_id.substring(0, 8)}...`);
                                                        }}
                                                        className="p-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 transition-all"
                                                        title="Set as Target"
                                                    >
                                                        <Smartphone size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteGroup(group.group_id)}
                                                        className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 transition-all"
                                                        title="Delete Group"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer Stat */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                                    Showing {filteredGroups.length} of {groups.length} Groups
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Portal */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </main>
    );
}