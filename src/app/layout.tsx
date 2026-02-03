import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🚀 SEO Setup แบบจัดเต็ม (Thai-First Edition)
export const metadata: Metadata = {
  metadataBase: new URL('https://school-air.vercel.app'),
  title: {
    default: "LOMbbv | ตรวจวัดฝุ่น PM2.5 โรงเรียนบางปะกงฯ", // ✅ ใส่ภาษาไทยใน Title หลัก
    template: "%s | LOMbbv บางปะกง"
  },
  // ✅ Description ต้องมี Keyword ภาษาไทยครบๆ (ค่าฝุ่น, อากาศ, โรงเรียน)
  description: "เช็คค่าฝุ่น PM2.5 และสภาพอากาศวันนี้ ที่โรงเรียนบางปะกงบวรวิทยายน แบบ Real-time แม่นยำ รู้ทันทีก่อนเข้าแถว พัฒนาโดยสภานักเรียน",

  // ✅ เพิ่มคำค้นหาภาษาไทยที่คนน่าจะพิมพ์
  keywords: [
    "ค่าฝุ่นบางปะกง",
    "PM2.5 บางปะกง",
    "สภาพอากาศโรงเรียน",
    "บางปะกงบวรวิทยายน",
    "LOMbbv",
    "พยากรณ์อากาศบางปะกง",
    "ฝุ่นวันนี้",
    "Air Quality",
    "KidBright"
  ],
  authors: [{ name: "Student Council" }, { name: "Bang Pakong School" }],
  creator: "Bang Pakong Student Developer Team",
  publisher: "Bang Pakong Bowon Witthayayon School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    shortcut: "/icon-192x192.png",
    apple: "/icon-512x512.png",
  },
  appleWebApp: {
    capable: true,
    title: "LOMbbv",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    // ✅ เวลาแชร์ลง Facebook/Line ให้ขึ้นภาษาไทยสวยๆ
    title: "LOMbbv - ค่าฝุ่นและอากาศ โรงเรียนบางปะกงฯ",
    description: "เช็คฝุ่น PM2.5 วันนี้ที่โรงเรียน! ข้อมูลสดใหม่ Real-time เพื่อสุขภาพชาวบางปะกง",
    url: "https://school-air.vercel.app",
    siteName: "LOMbbv",
    images: [
      {
        url: "/og-image.png", // ✅ ใช้รูปที่ทำมาเพื่อ Social Media โดยเฉพาะ
        width: 1200,
        height: 630,
        alt: "LOMbbv Air Quality Monitor",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOMbbv | เช็คฝุ่น PM2.5 บางปะกง",
    description: "รู้ทันฝุ่นก่อนเข้าแถว! ระบบตรวจวัดคุณภาพอากาศโรงเรียนบางปะกงบวรวิทยายน",
    images: ["/og-image.png"], // ✅ ใช้รูปเดียวกับ OG
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white`}>

        {/* 🎨 Ambient Background (ลูกแก้วแสงวิญญาณ) */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob [animation-delay:2s]"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob [animation-delay:4s]"></div>
        </div>

        {/* Content อยู่ชั้นบน */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}