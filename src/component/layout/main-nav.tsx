"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "시작하기", key: "home" },
  { href: "/practice", label: "연습하기", key: "practice" },
  { href: "/test", label: "테스트하기", key: "test" },
  { href: "/more/video", label: "더보기", key: "more" },
] as const;

export default function MainNav() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0 });

  const getActiveKey = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/practice")) return "practice";
    if (pathname.startsWith("/test")) return "test";
    if (pathname.startsWith("/more/video")) return "more";
    return undefined;
  };

  const activeKey = getActiveKey();
  const activeIndex = NAV_ITEMS.findIndex((item) => item.key === activeKey);

  useEffect(() => {
    if (activeIndex < 0 || !containerRef.current) return;
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    const container = containerRef.current.getBoundingClientRect();
    const item = el.getBoundingClientRect();
    setLineStyle({
      left: item.left - container.left,
      width: item.width,
    });
  }, [activeIndex, pathname]);

  return (
    <nav className="flex h-16 w-full items-center border-b border-gray-200">
      <div
        ref={containerRef}
        className="relative mx-auto flex h-full w-[950px] items-center justify-between gap-20 text-2xl"
      >
        {NAV_ITEMS.map((item, index) => {
          const isActive = item.key === activeKey;
          return (
            <Link
              key={item.key}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={item.href}
              className={`relative z-10 flex h-full flex-1 items-center justify-center px-3 font-medium cursor-pointer transition-colors ${
                isActive
                  ? "text-gray-900 hover:text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <div
          className="absolute bottom-0 z-0 h-0.5 bg-gray-900 transition-all duration-200 ease-out"
          style={{
            left: lineStyle.left,
            width: lineStyle.width,
          }}
          aria-hidden
        />
      </div>
    </nav>
  );
}
