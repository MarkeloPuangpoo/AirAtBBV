import { NextRequest, NextResponse } from 'next/server';

// 🧠 ตัวแปรจำค่าชั่วคราว (Memory Cache)
// หมายเหตุ: บน Vercel ค่านี้อาจจะหายไปถ้าไม่มีการใช้งานนานๆ แต่เพียงพอสำหรับตอนตั้งค่าครับ
let latestGroupId: string | null = null;
let latestEventTime: string | null = null;

// 🟢 GET: ให้หน้า Admin มาถามว่า "เจอ Group ID หรือยัง?"
export async function GET() {
    return NextResponse.json({
        groupId: latestGroupId,
        timestamp: latestEventTime
    });
}

// 🔵 POST: รับข้อมูลจาก LINE (ตอนโดนเชิญเข้ากลุ่ม)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const events = body.events;

        // วนลูปเช็คทุกเหตุการณ์ที่ส่งมา
        for (const event of events) {
            // 1. ถ้าเป็น Event "Join" (บอทถูกเชิญเข้ากลุ่ม)
            // 2. หรือ Event "Message" (มีคนพิมพ์ในกลุ่ม)
            if (event.source.type === 'group' || event.source.type === 'room') {
                const id = event.source.groupId || event.source.roomId;

                // จำค่าไว้!
                latestGroupId = id;
                latestEventTime = new Date().toLocaleString('th-TH');

                console.log("🎯 DETECTED GROUP ID:", latestGroupId);
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}
