import { NextResponse } from 'next/server';
import { format, subDays } from 'date-fns';

// Mock generation helper
const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export async function GET() {
    // Generate data for the last 7 days
    const today = new Date();
    const historyData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(today, 6 - i); // Past 6 days + today
        return {
            date: format(date, 'd MMM'), // Format: "3 Feb"
            ts: date.getTime(),
            pm25: getRandom(10, 60), // Random PM2.5 between 10-60
            temp: getRandom(28, 34), // Random Temp 28-34
            humid: getRandom(50, 80) // Random Humid 50-80
        };
    });

    return NextResponse.json(historyData);
}
