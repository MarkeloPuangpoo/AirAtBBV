export type Language = 'th' | 'en';

export interface Translation {
    station_label: string;
    last_updated: string;
    status_good: string;
    status_moderate: string;
    status_unhealthy: string;
    temp: string;
    humidity: string;
    wind: string;
    pm10: string;
    pm10_desc: string;
    aqi_title: string;
    health_title_good: string;
    health_desc_good: string;
    health_title_moderate: string;
    health_desc_moderate: string;
    health_title_unhealthy: string;
    health_desc_unhealthy: string;
}

export const translations: Record<Language, Translation> = {
    th: {
        // Header
        station_label: "สถานีวัดคุณภาพอากาศ",
        last_updated: "อัปเดตล่าสุด",

        // Status
        status_good: "ดี / อากาศบริสุทธิ์",
        status_moderate: "ปานกลาง",
        status_unhealthy: "เริ่มมีผลกระทบต่อสุขภาพ",

        // Cards
        temp: "อุณหภูมิ",
        humidity: "ความชื้น",
        wind: "ลม",
        pm10: "ค่าฝุ่น PM10",
        pm10_desc: "ฝุ่นละอองขนาดเล็ก (รอง)",

        // Gauge
        aqi_title: "ดัชนีคุณภาพอากาศ (PM2.5)",

        // Health
        health_title_good: "ปลอดภัยสำหรับกิจกรรมกลางแจ้ง",
        health_desc_good: "คุณภาพอากาศดี สามารถทำกิจกรรมหรือออกกำลังกายกลางแจ้งได้ตามปกติ",

        health_title_moderate: "ควรระวังเป็นพิเศษ",
        health_desc_moderate: "กลุ่มเสี่ยงควรลดระยะเวลาการทำกิจกรรมกลางแจ้ง คนทั่วไปสามารถทำกิจกรรมได้ตามปกติ",

        health_title_unhealthy: "คำเตือนสุขภาพ",
        health_desc_unhealthy: "ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง สวมหน้ากากป้องกันหากจำเป็นต้องออกนอกอาคาร ปิดหน้าต่างกันฝุ่น",
    },
    en: {
        // Header
        station_label: "Air Quality Station",
        last_updated: "Last Updated",

        // Status
        status_good: "Good / Air is Clean",
        status_moderate: "Moderate",
        status_unhealthy: "Unhealthy",

        // Cards
        temp: "Temp",
        humidity: "Humidity",
        wind: "Wind",
        pm10: "PM10 Levels",
        pm10_desc: "Secondary dust reading",

        // Gauge
        aqi_title: "Air Quality Index (PM2.5)",

        // Health
        health_title_good: "Safe for Activities",
        health_desc_good: "Air quality is good. It's a great day for outdoor sports and activities.",

        health_title_moderate: "Moderate Caution",
        health_desc_moderate: "Sensitive groups should reduce outdoor exercise. Generally safe for others.",

        health_title_unhealthy: "Health Warning",
        health_desc_unhealthy: "Avoid outdoor activities. Wear a mask if you must go outside. Keep windows closed.",
    }
};
