// src/app/api/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db'; // เรียกใช้ db ที่สร้างเมื่อกี้

export async function GET() {
    // ดึงกลุ่มล่าสุดที่เพิ่งเข้ามา (เผื่อ Admin อยากดู)
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM line_groups ORDER BY added_at DESC LIMIT 1');
        client.release();

        return NextResponse.json({
            latestGroup: result.rows[0] || null
        });
    } catch (error) {
        return NextResponse.json({ error: 'DB Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const events = body.events;

        for (const event of events) {
            // เช็คว่าเป็น Group หรือ Room
            if (event.source.type === 'group' || event.source.type === 'room') {
                const groupId = event.source.groupId || event.source.roomId;

                // บันทึกลง Neon (ถ้ามีอยู่แล้วไม่ต้องทำอะไรด้วย ON CONFLICT)
                const client = await pool.connect();
                await client.query(
                    'INSERT INTO line_groups (group_id) VALUES ($1) ON CONFLICT (group_id) DO NOTHING',
                    [groupId]
                );
                client.release();

                console.log("✅ SAVED GROUP ID:", groupId);
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}
