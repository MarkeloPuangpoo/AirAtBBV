import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // 1. รับค่า
        const pm25 = parseFloat(searchParams.get('pm25') || '0');
        const temp = searchParams.get('temp') || '--';
        const humid = searchParams.get('humid') || '--';
        const date = searchParams.get('date') || new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

        // 2. Theme Logic
        let theme = {
            color: '#10b981',
            bgGradient: 'linear-gradient(to bottom right, #d1fae5, #10b981)',
            icon: '🌳',
            label: 'Good Air',
            statusBg: '#ecfdf5',
            statusText: '#064e3b'
        };

        if (pm25 > 25) {
            theme = {
                color: '#f59e0b',
                bgGradient: 'linear-gradient(to bottom right, #fef3c7, #f59e0b)',
                icon: '😷',
                label: 'Moderate',
                statusBg: '#fffbeb',
                statusText: '#78350f'
            };
        }
        if (pm25 > 37.5) {
            theme = {
                color: '#f97316',
                bgGradient: 'linear-gradient(to bottom right, #ffedd5, #f97316)',
                icon: '⚠️',
                label: 'Unhealthy',
                statusBg: '#fff7ed',
                statusText: '#7c2d12'
            };
        }
        if (pm25 > 50) {
            theme = {
                color: '#ef4444',
                bgGradient: 'linear-gradient(to bottom right, #fee2e2, #ef4444)',
                icon: '🚨',
                label: 'Danger',
                statusBg: '#fef2f2',
                statusText: '#7f1d1d'
            };
        }

        // 3. SVG Calc
        const maxVal = 100;
        const radius = 120;
        const stroke = 25;
        const normalizedValue = Math.min(pm25, maxVal);
        const circumference = radius * 2 * Math.PI;
        const strokeDashoffset = circumference - (normalizedValue / maxVal) * circumference;

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex', // ✅ Root ต้องมี
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8fafc',
                        fontFamily: 'sans-serif', // ใช้ sans-serif มาตรฐานกันเหนียว
                    }}
                >
                    {/* Background Decor */}
                    <div style={{ display: 'flex', position: 'absolute', top: -100, left: -100, width: 600, height: 600, background: theme.color, opacity: 0.2, filter: 'blur(80px)', borderRadius: '100%' }} />
                    <div style={{ display: 'flex', position: 'absolute', bottom: -100, right: -100, width: 500, height: 500, background: theme.color, opacity: 0.3, filter: 'blur(80px)', borderRadius: '100%' }} />

                    {/* Main Card */}
                    <div
                        style={{
                            display: 'flex', // ✅ ต้องมี เพราะมีลูกหลายคน
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '520px',
                            height: '820px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '48px',
                            border: '1px solid rgba(255,255,255,0.8)',
                            boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)',
                            padding: '40px',
                            position: 'relative',
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', fontSize: 18, color: '#64748b', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>LOMbbv Monitor</div>
                            <div style={{ display: 'flex', fontSize: 14, color: '#94a3b8', marginTop: 5 }}>Bang Pakong School</div>
                        </div>

                        {/* SVG Wrapper */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 300, height: 300, margin: '20px 0' }}>
                            <svg width="300" height="300" viewBox="0 0 300 300" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="150" cy="150" r={radius} stroke="#f1f5f9" strokeWidth={stroke} fill="transparent" />
                                <circle cx="150" cy="150" r={radius} stroke={theme.color} strokeWidth={stroke} fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                            </svg>

                            {/* Center Text */}
                            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', fontSize: 96, fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>{Math.round(pm25)}</div>
                                <div style={{ display: 'flex', fontSize: 20, color: '#64748b', fontWeight: 600 }}>µg/m³</div>
                            </div>
                        </div>

                        {/* Status Badge (เปลี่ยน span เป็น div และใส่ flex) */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', // จัดกลาง
                            padding: '12px 32px',
                            backgroundColor: theme.statusBg,
                            borderRadius: '50px',
                            border: `2px solid ${theme.color}20`,
                            marginBottom: 40
                        }}>
                            <div style={{ display: 'flex', fontSize: 32, marginRight: 12 }}>{theme.icon}</div>
                            <div style={{ display: 'flex', fontSize: 28, fontWeight: 800, color: theme.statusText }}>{theme.label}</div>
                        </div>

                        {/* Weather Grid */}
                        <div style={{ display: 'flex', width: '100%', gap: 20 }}>
                            {/* Temp */}
                            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', fontSize: 42, fontWeight: 800, color: '#334155' }}>{temp}°</div>
                                <div style={{ display: 'flex', fontSize: 14, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>TEMP</div>
                            </div>
                            {/* Humidity */}
                            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', fontSize: 42, fontWeight: 800, color: '#334155' }}>{humid}%</div>
                                <div style={{ display: 'flex', fontSize: 14, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>HUMID</div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ display: 'flex', width: 10, height: 10, backgroundColor: '#10b981', borderRadius: '50%' }} />
                                <div style={{ display: 'flex', fontSize: 14, color: '#64748b', fontWeight: 600 }}>System Online</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>LAST UPDATE</div>
                                <div style={{ display: 'flex', fontSize: 16, color: '#475569', fontWeight: 700, fontFamily: 'monospace' }}>{date}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 600,
                height: 900,
                // ปิด debug mode
                debug: false,
            }
        );
    } catch (e: any) {
        console.error(e);
        return new Response(`Generative Error: ${e.message}`, { status: 500 });
    }
}