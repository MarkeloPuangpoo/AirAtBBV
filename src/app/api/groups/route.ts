// src/app/api/groups/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 📋 GET: ดึงรายชื่อกลุ่มทั้งหมด
export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM line_groups ORDER BY added_at DESC');
        client.release();

        return NextResponse.json({
            groups: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
    }
}

// 🗑️ DELETE: ลบกลุ่มออก (Unsubscribe)
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const client = await pool.connect();
        await client.query('DELETE FROM line_groups WHERE group_id = $1', [id]);
        client.release();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Database Error' }, { status: 500 });
    }
}
