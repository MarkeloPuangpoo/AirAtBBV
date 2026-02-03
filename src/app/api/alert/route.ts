import { NextResponse } from 'next/server';

// ✅ ผมใส่ Token ที่คุณหามาให้แล้วครับ
// ✅ ใช้ process.env เพื่อความปลอดภัย
const LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

// ❗ [ต้องแก้ตรงนี้] ไปเอา User ID จากหน้า Basic settings มาใส่ (ขึ้นต้นด้วย U...)
const USER_ID = process.env.LINE_USER_ID || '';

const getStatus = (pm25: number) => {
    if (pm25 <= 25) return { color: "#10b981", text: "อากาศดีเยี่ยม 🌳", bg: "#ecfdf5" };
    if (pm25 <= 37) return { color: "#f59e0b", text: "เริ่มมีฝุ่นเล็กน้อย 😷", bg: "#fffbeb" };
    if (pm25 <= 50) return { color: "#f97316", text: "ควรสวมหน้ากาก ⚠️", bg: "#fff7ed" };
    return { color: "#ef4444", text: "อันตราย งดกิจกรรม 🚨", bg: "#fef2f2" };
};

export async function GET() {
    try {
        // 1. ดึงข้อมูลจริงจากเซนเซอร์โรงเรียน
        const LAT = '13.504004';
        const LON = '101.002182';
        const TARGET_STATION_ID = '781C3CA55E54'; // โรงเรียนบางปะกง

        const kbRes = await fetch(`https://watch.kid-bright.org/diy/api/scan?datasource=latest_data_by_station&lat=${LAT}&lon=${LON}`, { cache: 'no-store' });
        const stations = await kbRes.json();
        const myStation = stations.find((s: any) => s?.meta?._key === TARGET_STATION_ID || s?._profile?.station_id === TARGET_STATION_ID);

        if (!myStation) return NextResponse.json({ error: 'Station not found' });

        const pm25 = myStation.data['pm2.5']?.current ?? 0;
        const temp = myStation.data['temp']?.current ?? 0;
        const theme = getStatus(pm25);

        // 2. สร้างการ์ด Flex Message
        const messagePayload = {
            to: USER_ID,
            messages: [
                {
                    type: "flex",
                    altText: `แจ้งเตือนฝุ่น PM2.5: ${pm25} µg/m³`,
                    contents: {
                        type: "bubble",
                        size: "mega",
                        header: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                { type: "text", text: "LOMbbv", color: "#ffffffaa", size: "xs", weight: "bold" },
                                { type: "text", text: "รายงานสภาพอากาศ", color: "#ffffff", size: "lg", weight: "bold" }
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
                                                { type: "text", text: `${myStation.data['humid']?.current}%`, size: "lg", weight: "bold", color: "#333333", align: "center" }
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
                                    action: { type: "uri", label: "ดู Dashboard เต็ม", uri: "https://school-air.vercel.app" }, // แก้เป็นลิงก์เว็บจริงของคุณเมื่อ Deploy แล้ว
                                    style: "primary",
                                    color: theme.color
                                }
                            ]
                        }
                    }
                }
            ]
        };

        // เพิ่มเงื่อนไขตรงนี้: ถ้า PM2.5 ไม่ถึง 50 ให้จบการทำงานเลย (ไม่ส่ง LINE)
        if (pm25 < 50) {
            return NextResponse.json({ message: 'อากาศดี ไม่ต้องแจ้งเตือน', pm25: pm25 });
        }

        // 3. ส่งเข้า LINE
        const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LINE_ACCESS_TOKEN}`
            },
            body: JSON.stringify(messagePayload)
        });

        if (!lineRes.ok) {
            const errorText = await lineRes.text();
            return NextResponse.json({ error: 'Line API Error', details: errorText }, { status: 500 });
        }

        return NextResponse.json({ success: true, pm25: pm25 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
