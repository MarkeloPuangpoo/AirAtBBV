import { NextResponse } from 'next/server';

export async function GET() {
    // 1. Set school coordinates and ID
    const LAT = '13.504004';
    const LON = '101.002182';
    const TARGET_STATION_ID = '781C3CA55E54'; // Bang Pakong School ID

    // URL to scan for devices in the area
    const API_URL = `https://watch.kid-bright.org/diy/api/scan?datasource=latest_data_by_station&lat=${LAT}&lon=${LON}`;

    try {
        // 2. Fetch data from KidBright Server
        const res = await fetch(API_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!res.ok) throw new Error('Fetch failed');

        const stations = await res.json();

        // 3. Find our school's station
        const myStation = stations.find((s: any) =>
            s?.meta?._key === TARGET_STATION_ID ||
            s?._profile?.station_id === TARGET_STATION_ID
        );

        if (!myStation) {
            return NextResponse.json({ error: 'School Station not found' }, { status: 404 });
        }

        // 4. Format data to match UI structure
        const formattedData = {
            _profile: {
                station_name: myStation._profile?.station_name || "โรงเรียนบางปะกงบวรวิทยายน",
                latitude: myStation._profile?.latitude,
                longitude: myStation._profile?.longitude
            },
            data: {
                "pm2.5": {
                    current: myStation.data['pm2.5']?.current ?? 0,
                    unit: "µg/m³"
                },
                "pm10": {
                    current: myStation.data['pm10']?.current ?? 0,
                    unit: "µg/m³"
                },
                "temp": {
                    current: myStation.data['temp']?.current ?? 0,
                    unit: "°C"
                },
                "humid": {
                    current: myStation.data['humid']?.current ?? 0,
                    unit: "%"
                },
                "wind_speed": {
                    current: myStation.data['wind_speed']?.current ?? 0,
                    unit: "m/s"
                },
                "wind_direct": {
                    current: myStation.data['wind_direct']?.current ?? 0,
                    unit: "deg"
                },
                "rain": {
                    current: myStation.data['rainfall']?.current ?? 0,
                    unit: "mm"
                }
            },
            meta: {
                _ts: myStation.meta?._ts // Last update timestamp
            }
        };

        // Return formatted data
        return NextResponse.json(formattedData);

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
