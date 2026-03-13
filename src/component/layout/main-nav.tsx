"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSettingStore, type Difficulty } from "@/store/setting-store";
import { useTestStore } from "@/store/test-store";

const NAV_ITEMS = [
  { href: "/", label: "시작하기", key: "home" },
  { href: "/practice", label: "연습하기", key: "practice" },
  { href: "/test", label: "테스트하기", key: "test" },
  { href: "/more/video", label: "더보기", key: "more" },
] as const;

export default function MainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const practiceTriggerRef = useRef<HTMLAnchorElement | null>(null);
  const testTriggerRef = useRef<HTMLAnchorElement | null>(null);
  const practicePanelRef = useRef<HTMLDivElement | null>(null);
  const testPanelRef = useRef<HTMLDivElement | null>(null);
  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0 });
  const [practiceLineStyle, setPracticeLineStyle] = useState({
    left: 0,
    width: 0,
  });
  const [testLineStyle, setTestLineStyle] = useState({
    left: 0,
    width: 0,
  });
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const setPracticeDifficulty = useSettingStore((s) => s.setPracticeDifficulty);
  const setTestDifficulty = useSettingStore((s) => s.setTestDifficulty);
  const resetTestSession = useTestStore((s) => s.resetSession);

  const getActiveKey = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/practice")) return "practice";
    if (pathname.startsWith("/test")) return "test";
    if (pathname.startsWith("/more/video")) return "more";
    return undefined;
  };

  const activeKey = getActiveKey();
  const activeIndex = NAV_ITEMS.findIndex((item) => item.key === activeKey);
  const practiceIndex = NAV_ITEMS.findIndex(
    (item) => item.key === "practice",
  );
  const testIndex = NAV_ITEMS.findIndex((item) => item.key === "test");

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

  useEffect(() => {
    if (practiceIndex < 0 || !containerRef.current) return;
    const el = itemRefs.current[practiceIndex];
    if (!el) return;
    const container = containerRef.current.getBoundingClientRect();
    const item = el.getBoundingClientRect();
    setPracticeLineStyle({
      left: item.left - container.left,
      width: item.width,
    });
  }, [practiceIndex, pathname]);

  useEffect(() => {
    if (testIndex < 0 || !containerRef.current) return;
    const el = itemRefs.current[testIndex];
    if (!el) return;
    const container = containerRef.current.getBoundingClientRect();
    const item = el.getBoundingClientRect();
    setTestLineStyle({
      left: item.left - container.left,
      width: item.width,
    });
  }, [testIndex, pathname]);

  useEffect(() => {
    if (!isPracticeOpen && !isTestOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      const clickedInPractice =
        (practiceTriggerRef.current &&
          practiceTriggerRef.current.contains(target)) ||
        (practicePanelRef.current &&
          practicePanelRef.current.contains(target));

      const clickedInTest =
        (testTriggerRef.current &&
          testTriggerRef.current.contains(target)) ||
        (testPanelRef.current && testPanelRef.current.contains(target));

      if (!clickedInPractice) {
        setIsPracticeOpen(false);
      }

      if (!clickedInTest) {
        setIsTestOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPracticeOpen, isTestOpen]);

  const handleClickPracticeNav = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsPracticeOpen((prev) => !prev);
    setIsTestOpen(false);
  };

  const handleClickTestNav = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsTestOpen((prev) => !prev);
    setIsPracticeOpen(false);
  };

  const handleSelectPracticeDifficulty = (difficulty: Difficulty) => {
    setPracticeDifficulty(difficulty);
    setIsPracticeOpen(false);
    router.push("/practice");
  };

  const handleSelectTestDifficulty = (difficulty: Difficulty) => {
    setTestDifficulty(difficulty);
    resetTestSession();
    setIsTestOpen(false);
    router.push("/test");
  };

  const difficultyItems: { value: Difficulty; label: string }[] = [
    { value: "easy", label: "쉬움" },
    { value: "medium", label: "보통" },
    { value: "hard", label: "어려움" },
  ];

  return (
    <nav className="flex h-16 w-full items-center border-b border-gray-200">
      <div
        ref={containerRef}
        className="relative mx-auto flex h-full w-[950px] items-center justify-between gap-20 text-2xl"
      >
        {NAV_ITEMS.map((item, index) => {
          const isActive = item.key === activeKey;
          const isPractice = item.key === "practice";
          const isTest = item.key === "test";
          return (
            <Link
              key={item.key}
              ref={(el) => {
                itemRefs.current[index] = el;
                if (isPractice) {
                  practiceTriggerRef.current = el;
                }
                if (isTest) {
                  testTriggerRef.current = el;
                }
              }}
              href={item.href}
              onClick={
                isPractice
                  ? handleClickPracticeNav
                  : isTest
                    ? handleClickTestNav
                    : undefined
              }
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

        {/* 연습하기 난이도 선택 패널 */}
        <div
          ref={practicePanelRef}
          className="pointer-events-none absolute bottom-0 z-10 translate-y-full"
          style={{
            left: practiceLineStyle.left,
            width: practiceLineStyle.width,
          }}
        >
          <div
            className={`pointer-events-auto overflow-hidden rounded-b-xl border border-gray-200 bg-white shadow-md transition-all duration-300 ease-out ${
              isPracticeOpen
                ? "max-h-50 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-1"
            }`}
          >
            <div className="grid text-xl divide-y divide-gray-200">
              {difficultyItems.map((item) => (
                <div
                  key={item.value}
                  onClick={() => handleSelectPracticeDifficulty(item.value)}
                  className="flex-1 w-full h-full px-5 py-3 text-center text-gray-700 whitespace-nowrap transition-colors cursor-pointer hover:bg-gray-100"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 테스트하기 난이도 선택 패널 */}
        <div
          ref={testPanelRef}
          className="pointer-events-none absolute bottom-0 z-10 translate-y-full"
          style={{
            left: testLineStyle.left,
            width: testLineStyle.width,
          }}
        >
          <div
            className={`pointer-events-auto overflow-hidden rounded-b-xl border border-gray-200 bg-white shadow-md transition-all duration-300 ease-out ${
              isTestOpen
                ? "max-h-50 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-1"
            }`}
          >
            <div className="grid text-xl divide-y divide-gray-200">
              {difficultyItems.map((item) => (
                <div
                  key={item.value}
                  onClick={() => handleSelectTestDifficulty(item.value)}
                  className="flex-1 w-full h-full px-5 py-3 text-center text-gray-700 whitespace-nowrap transition-colors cursor-pointer hover:bg-gray-100"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
