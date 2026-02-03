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

    // History
    history_title: string;
    history_pm25_btn: string;
    history_temp_btn: string;
    history_table_date: string;
    history_table_aq: string;
    history_table_pm25: string;
    history_table_temp: string;
    history_table_humid: string;
    history_status_good: string;
    history_status_moderate: string;
    history_status_unhealthy: string;

    // Share
    share_button: string;
    share_modal_title: string;
    share_download: string;
    share_downloading: string;
    share_story_date: string;

    // About Us (Updated)
    about_button: string;
    about_title_pre: string;
    about_title_main: string;
    about_description: string;
    about_device_label: string;
    about_back: string;

    // Navigation (Preserved)
    about_me_button: string;

    // Credits
    credit_developed_by: string;
    credit_student_council: string;
    credit_cs_club: string;
    credit_advisor: string;
    credit_tech_stack: string;
    credit_tech_desc: string;
}

export const translations: Record<Language, Translation> = {
    th: {
        station_label: "สถานีวัดคุณภาพอากาศ",
        last_updated: "อัปเดตล่าสุด",
        status_good: "ดี / อากาศบริสุทธิ์",
        status_moderate: "ปานกลาง",
        status_unhealthy: "เริ่มมีผลกระทบ",
        temp: "อุณหภูมิ",
        humidity: "ความชื้น",
        wind: "ลม",
        pm10: "ค่าฝุ่น PM10",
        pm10_desc: "ฝุ่นละอองขนาดเล็ก (รอง)",
        aqi_title: "ดัชนีคุณภาพอากาศ (PM2.5)",
        health_title_good: "ปลอดภัยสำหรับกิจกรรมกลางแจ้ง",
        health_desc_good: "คุณภาพอากาศดี สามารถทำกิจกรรมหรือออกกำลังกายกลางแจ้งได้ตามปกติ",
        health_title_moderate: "ควรระวังเป็นพิเศษ",
        health_desc_moderate: "กลุ่มเสี่ยงควรลดระยะเวลาการทำกิจกรรมกลางแจ้ง คนทั่วไปสามารถทำกิจกรรมได้ตามปกติ",
        health_title_unhealthy: "คำเตือนสุขภาพ",
        health_desc_unhealthy: "ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง สวมหน้ากากป้องกันหากจำเป็นต้องออกนอกอาคาร",
        history_title: "📊 คลังข้อมูลย้อนหลัง",
        history_pm25_btn: "ฝุ่น PM2.5",
        history_temp_btn: "อุณหภูมิ",
        history_table_date: "วันที่",
        history_table_aq: "คุณภาพอากาศ",
        history_table_pm25: "PM2.5",
        history_table_temp: "อุณหภูมิ",
        history_table_humid: "ความชื้น",
        history_status_good: "อากาศดี",
        history_status_moderate: "ปานกลาง",
        history_status_unhealthy: "เริ่มมีผล",
        share_button: "แชร์สถานะ",
        share_modal_title: "📸 แชร์ลง Story",
        share_download: "บันทึกรูปภาพ",
        share_downloading: "กำลังสร้างรูป...",
        share_story_date: "ข้อมูล ณ เวลา",

        // About Us
        about_button: "เกี่ยวกับโครงการ",
        about_title_pre: "เกี่ยวกับโครงการ",
        about_title_main: "LOMbbv Monitor",
        about_description: "ระบบตรวจวัดคุณภาพอากาศอัจฉริยะ ริเริ่มโดยคณะกรรมการนักเรียน โรงเรียนบางปะกง 'บวรวิทยายน' เพื่อยกระดับคุณภาพชีวิตภายในโรงเรียน ด้วยข้อมูลที่แม่นยำ รวดเร็ว และเข้าถึงง่ายสำหรับทุกคน",
        about_device_label: "จุดติดตั้งอุปกรณ์ (IoT Station)",
        about_back: "กลับหน้าหลัก",

        // Navigation
        about_me_button: "เกี่ยวกับเรา",

        // Credits
        credit_developed_by: "ทีมพัฒนา",
        credit_student_council: "คณะกรรมการนักเรียน ปี 2569",
        credit_cs_club: "ชมรมคอมพิวเตอร์และนวัตกรรม",
        credit_advisor: "ที่ปรึกษาโครงการ",
        credit_tech_stack: "เทคโนโลยีเบื้องหลัง",
        credit_tech_desc: "ขับเคลื่อนด้วยเซนเซอร์ KidBright ความแม่นยำสูง ประมวลผลผ่าน Cloud Computing และแสดงผลด้วย Next.js ที่รวดเร็วที่สุด"
    },
    en: {
        station_label: "Air Quality Station",
        last_updated: "Last Updated",
        status_good: "Good / Air is Clean",
        status_moderate: "Moderate",
        status_unhealthy: "Unhealthy",
        temp: "Temp",
        humidity: "Humidity",
        wind: "Wind",
        pm10: "PM10 Levels",
        pm10_desc: "Secondary dust reading",
        aqi_title: "Air Quality Index (PM2.5)",
        health_title_good: "Safe for Activities",
        health_desc_good: "Air quality is good. It's a great day for outdoor sports and activities.",
        health_title_moderate: "Moderate Caution",
        health_desc_moderate: "Sensitive groups should reduce outdoor exercise. Generally safe for others.",
        health_title_unhealthy: "Health Warning",
        health_desc_unhealthy: "Avoid outdoor activities. Wear a mask if you must go outside.",
        history_title: "📊 History Archive",
        history_pm25_btn: "PM2.5",
        history_temp_btn: "Temperature",
        history_table_date: "Date",
        history_table_aq: "Air Quality",
        history_table_pm25: "PM2.5",
        history_table_temp: "Temp",
        history_table_humid: "Humidity",
        history_status_good: "Good",
        history_status_moderate: "Moderate",
        history_status_unhealthy: "Unhealthy",
        share_button: "Share Status",
        share_modal_title: "📸 Share to Story",
        share_download: "Save Image",
        share_downloading: "Generating...",
        share_story_date: "Data at",

        // About Us
        about_button: "About Project",
        about_title_pre: "About Project",
        about_title_main: "LOMbbv Monitor",
        about_description: "An intelligent air quality monitoring initiative by the Student Council of Bang Pakong 'Bowon Witthayayon' School. Dedicated to improving campus life through accurate, real-time, and accessible environmental data.",
        about_device_label: "IoT Station Setup",
        about_back: "Back Home",

        // Navigation
        about_me_button: "About me",

        // Credits
        credit_developed_by: "Developed By",
        credit_student_council: "Student Council 2026",
        credit_cs_club: "Computer Science & Innovation Club",
        credit_advisor: "Project Advisor",
        credit_tech_stack: "Tech Stack",
        credit_tech_desc: "Powered by high-precision KidBright IoT sensors, processed via Cloud Computing, and delivered instantly through Next.js."
    }
};
