"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "시작하기", key: "home" },
  { href: "/practice", label: "연습하기", key: "practice" },
  { href: "/memorize", label: "암기하기", key: "memorize" },
] as const;

export default function MainNav() {
  const pathname = usePathname();

  const getActiveKey = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/practice")) return "practice";
    if (pathname.startsWith("/memorize")) return "memorize";
    return undefined;
  };

  const activeKey = getActiveKey();

  return (
    <nav className="flex h-16 w-full items-center border-b border-gray-200">
      <div className="mx-auto flex h-full w-[800px] items-center justify-between gap-12 text-2xl">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex h-full items-center px-3 border-b-4 cursor-pointer transition-colors ${
                isActive
                  ? "border-gray-900 font-medium text-gray-900 hover:text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
