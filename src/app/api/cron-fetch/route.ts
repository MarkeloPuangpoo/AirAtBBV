import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    // 1. Set school coordinates and ID
    const LAT = '13.504004';
    const LON = '101.002182';
    const TARGET_STATION_ID = '781C3CA55E54'; // Bang Pakong School ID

    const API_URL = `https://watch.kid-bright.org/diy/api/scan?datasource=latest_data_by_station&lat=${LAT}&lon=${LON}`;

    try {
        // 2. Fetch data from KidBright Server
        const res = await fetch(API_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 0 } // Always fetch fresh
        });

        if (!res.ok) throw new Error('KidBright Fetch failed');

        const stations = await res.json();

        // 3. Find our school's station
        const myStation = stations.find((s: any) =>
            s?.meta?._key === TARGET_STATION_ID ||
            s?._profile?.station_id === TARGET_STATION_ID
        );

        if (!myStation) {
            return NextResponse.json({ error: 'School Station not found' }, { status: 404 });
        }

        const data = myStation.data;

        // 4. Prepare data for insert
        const newRecord = {
            pm25: data['pm2.5']?.current ?? 0,
            pm10: data['pm10']?.current ?? 0,
            temperature: data['temp']?.current ?? 0,
            humidity: data['humid']?.current ?? 0,
            wind_speed: data['wind_speed']?.current ?? 0,
            wind_direction: data['wind_direct']?.current ?? 0,
        };

        // 5. Insert into Supabase
        const { error: insertError } = await supabase
            .from('aq_history')
            .insert([newRecord]);

        if (insertError) {
            console.error("Supabase Insert Error:", insertError);
            return NextResponse.json({ error: 'Failed to insert to Supabase' }, { status: 500 });
        }

        return NextResponse.json({ success: true, inserted: newRecord });

    } catch (error) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
    }
}
