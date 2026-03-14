import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_KR, Yeon_Sung } from "next/font/google";
import "./globals.css";
import MainNav from "@/component/layout/main-nav";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const yeonSung = Yeon_Sung({
  variable: "--font-yeon-sung",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "능엄주 게임",
  description:
    "능엄주를 페이지별 읽기와 빈칸 채우기로 차근차근 암기하는 웹사이트",
  icons: {
    icon: "/icons/lotus-flower.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifKR.variable} ${yeonSung.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col min-w-[1200px]">
          <header className="flex h-35 items-center border-b border-gray-200 px-6">
            <div className="mx-auto flex h-full items-center justify-center">
              <Link href="/">
                <div className="font-mantra text-[60px] font-bold cursor-pointer">
                  능엄주 게임
                </div>
              </Link>
            </div>
          </header>

          <MainNav />

          <main className="flex flex-1 flex-col">{children}</main>

          <footer className="h-[50px] border-t border-gray-200 px-6 py-3 text-xs">
            <div className="mx-auto flex items-center justify-center gap-4 h-5">
              <span>© {new Date().getFullYear()} 능엄주 암기 노트</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
