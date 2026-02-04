// src/app/api/alert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

// ฟังก์ชันสร้างสีและข้อความตามค่าฝุ่น
const getStatus = (pm25: number) => {
    if (pm25 <= 25) return { color: "#10b981", text: "อากาศดีเยี่ยม 🌳", bg: "#ecfdf5" };
    if (pm25 <= 37) return { color: "#f59e0b", text: "เริ่มมีฝุ่นเล็กน้อย 😷", bg: "#fffbeb" };
    if (pm25 <= 50) return { color: "#f97316", text: "ควรสวมหน้ากาก ⚠️", bg: "#fff7ed" };
    return { color: "#ef4444", text: "อันตราย งดกิจกรรม 🚨", bg: "#fef2f2" };
};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const customTargetId = searchParams.get('targetId'); // สำหรับการกด Test

        // 1. ดึงข้อมูลจากเซนเซอร์
        const LAT = '13.504004';
        const LON = '101.002182';
        const TARGET_STATION_ID = '781C3CA55E54';

        const kbRes = await fetch(`https://watch.kid-bright.org/diy/api/scan?datasource=latest_data_by_station&lat=${LAT}&lon=${LON}`, { cache: 'no-store' });
        const stations = await kbRes.json();
        const myStation = stations.find((s: any) => s?.meta?._key === TARGET_STATION_ID || s?._profile?.station_id === TARGET_STATION_ID);

        if (!myStation) return NextResponse.json({ error: 'Station not found' }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });

        const pm25 = myStation.data['pm2.5']?.current ?? 0;
        const temp = myStation.data['temp']?.current ?? 0;
        const humid = myStation.data['humid']?.current ?? 0;
        const theme = getStatus(pm25);

        // 2. เช็คเงื่อนไขฝุ่น (ถ้าฝุ่นน้อยกว่า 50 และไม่ใช่การเทส -> ไม่ส่ง)
        if (pm25 < 50 && !customTargetId) {
            return NextResponse.json({ message: 'อากาศดี ไม่ต้องแจ้งเตือน (Saved Quota)', pm25: pm25 }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
        }

        // 3. เตรียม Payload ของ Flex Message (ใช้โครงสร้างเดิม)
        const flexMessage = {
            type: "flex",
            altText: `แจ้งเตือนฝุ่น PM2.5: ${pm25} µg/m³`,
            contents: {
                type: "bubble",
                size: "mega",
                header: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        { type: "text", text: "LOMbbv REPORT", color: "#ffffffaa", size: "xs", weight: "bold" },
                        { type: "text", text: "โรงเรียนบางปะกงฯ", color: "#ffffff", size: "lg", weight: "bold" }
                    ],
                    backgroundColor: theme.color,
                    paddingAll: "20px"
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    backgroundColor: "#ffffff",
                    contents: [
                        { type: "text", text: theme.text, weight: "bold", size: "xl", align: "center", color: theme.color, wrap: true },
                        {
                            type: "box",
                            layout: "vertical",
                            margin: "xl",
                            contents: [
                                { type: "text", text: "PM 2.5", size: "sm", color: "#aaaaaa", align: "center" },
                                { type: "text", text: `${pm25}`, size: "5xl", weight: "bold", color: "#333333", align: "center" },
                                { type: "text", text: "µg/m³", size: "xs", color: "#aaaaaa", align: "center" }
                            ]
                        },
                        { type: "separator", margin: "xl" },
                        {
                            type: "box",
                            layout: "horizontal",
                            margin: "xl",
                            contents: [
                                {
                                    type: "box", layout: "vertical", flex: 1,
                                    contents: [
                                        { type: "text", text: "อุณหภูมิ", size: "xs", color: "#aaaaaa", align: "center" },
                                        { type: "text", text: `${temp}°C`, size: "lg", weight: "bold", color: "#333333", align: "center" }
                                    ]
                                },
                                {
                                    type: "box", layout: "vertical", flex: 1,
                                    contents: [
                                        { type: "text", text: "ความชื้น", size: "xs", color: "#aaaaaa", align: "center" },
                                        { type: "text", text: `${humid}%`, size: "lg", weight: "bold", color: "#333333", align: "center" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                footer: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "button",
                            action: { type: "uri", label: "ดู Dashboard เต็ม", uri: "https://airatbbv.vercel.app" },
                            style: "primary",
                            color: theme.color
                        }
                    ]
                }
            }
        };

        // 4. ส่งข้อความ
        let responseData;

        if (customTargetId) {
            // A. โหมด TEST: ส่งหาคนเดียว (Push API)
            const body = {
                to: customTargetId,
                messages: [flexMessage]
            };
            const res = await fetch('https://api.line.me/v2/bot/message/push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LINE_ACCESS_TOKEN}` },
                body: JSON.stringify(body)
            });
            responseData = await res.json();

        } else {
            // B. โหมด AUTO: ส่งหาทุกกลุ่มใน Neon (Multicast API)

            // B1. ดึง ID ทั้งหมด
            const client = await pool.connect();
            const result = await client.query('SELECT group_id FROM line_groups');
            client.release();

            const allGroupIds = result.rows.map(row => row.group_id);

            if (allGroupIds.length === 0) {
                return NextResponse.json({ message: 'No groups found in database' }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
            }

            // B2. ส่ง Multicast (LINE รับได้ทีละ 500 IDs, ถ้ามีเยอะกว่านี้อาจต้อง loop แบ่ง array)
            const body = {
                to: allGroupIds,
                messages: [flexMessage]
            };

            const res = await fetch('https://api.line.me/v2/bot/message/multicast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${LINE_ACCESS_TOKEN}` },
                body: JSON.stringify(body)
            });
            responseData = await res.json();
        }

        return NextResponse.json({ success: true, pm25: pm25, lineResponse: responseData }, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
    }
}
