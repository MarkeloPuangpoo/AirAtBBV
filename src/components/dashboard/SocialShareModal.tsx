"use client";

import { useState } from "react";
import { X, Download, Share2, Instagram } from "lucide-react";
import { StationData } from "@/lib/types";
import { useLanguage } from "@/components/LanguageContext";
import Image from "next/image";

interface SocialShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: StationData;
}

export default function SocialShareModal({ isOpen, onClose, data }: SocialShareModalProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const { t } = useLanguage();

    if (!isOpen) return null;

    const pm25 = data.data["pm2.5"].current;

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            // 1. Prepare params
            const params = new URLSearchParams({
                pm25: data.data["pm2.5"].current.toString(),
                temp: data.data.temp.current.toString(),
                humid: data.data.humid.current.toString(),
                date: new Date(data.meta._ts * 1000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
            });

            // 2. Fetch from our Server-Side Generation API
            const response = await fetch(`/api/share?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to generate image");

            const blob = await response.blob();

            // 3. Create Download Link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `LOMbbv-Story-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err: any) {
            console.error("Failed to generate image", err);
            alert(`Error: ${err.message || 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    // Construct Preview URL
    const previewParams = new URLSearchParams({
        pm25: data.data["pm2.5"].current.toString(),
        temp: data.data.temp.current.toString(),
        humid: data.data.humid.current.toString(),
        date: new Date(data.meta._ts * 1000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    });
    const previewUrl = `/api/share?${previewParams.toString()}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Actions */}
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-md">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center gap-6 overflow-y-auto">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {t.share_modal_title}
                    </h3>

                    {/* PREVIEW IMAGE (Real Server Generated) */}
                    <div className="relative w-[300px] aspect-[2/3] rounded-2xl overflow-hidden shadow-lg bg-slate-100">
                        {/* We use standard img to avoid next/image complexity with dynamic API urls for now, or just to keep it simple */}
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {t.share_downloading}
                            </>
                        ) : (
                            <>
                                <Download size={24} />
                                {t.share_download}
                            </>
                        )}
                    </button>

                    <p className="text-xs text-slate-400 text-center">
                        Supports Instagram Stories, Facebook, LINE
                    </p>
                </div>
            </div>
        </div>
    );
}
