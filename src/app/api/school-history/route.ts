import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export async function GET() {
    try {
        const today = new Date();
        const past7DaysStart = startOfDay(subDays(today, 6)); // Past 6 days + today

        // Fetch all data for the last 7 days from Supabase
        const { data: records, error } = await supabase
            .from('aq_history')
            .select('*')
            .gte('created_at', past7DaysStart.toISOString())
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Supabase Query Error:", error);
            throw error;
        }

        // Aggregate data by day (Average per day)
        // Group by date string (e.g., "3 Feb")
        const dailyData: Record<string, any> = {};

        records?.forEach((row: any) => {
            const dateStr = format(new Date(row.created_at), 'd MMM');
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = { count: 0, pm25: 0, temp: 0, humid: 0, ts: new Date(row.created_at).getTime() };
            }
            dailyData[dateStr].count += 1;
            dailyData[dateStr].pm25 += row.pm25;
            dailyData[dateStr].temp += row.temperature;
            dailyData[dateStr].humid += row.humidity;
            // update timestamp to latest in that day
            dailyData[dateStr].ts = Math.max(dailyData[dateStr].ts, new Date(row.created_at).getTime());
        });

        // Format into the array expected by the frontend
        const historyData = Array.from({ length: 7 }).map((_, i) => {
            const date = subDays(today, 6 - i);
            const dateStr = format(date, 'd MMM');

            const dayData = dailyData[dateStr];

            if (dayData && dayData.count > 0) {
                return {
                    date: dateStr,
                    ts: dayData.ts,
                    pm25: Math.round(dayData.pm25 / dayData.count),
                    temp: Math.round(dayData.temp / dayData.count),
                    humid: Math.round(dayData.humid / dayData.count)
                };
            } else {
                // Fallback if no data for that specific day (return 0 or last known good? 0 is safer for chart missing data)
                return {
                    date: dateStr,
                    ts: date.getTime(),
                    pm25: 0,
                    temp: 0,
                    humid: 0
                };
            }
        });

        return NextResponse.json(historyData);

    } catch (error) {
        console.error("History API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch history data' }, { status: 500 });
    }
}
