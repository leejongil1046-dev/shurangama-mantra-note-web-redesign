import type { ReactNode } from "react";

type StudyLayoutProps = {
  children: ReactNode;
};

export default function StudyLayout({ children }: StudyLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex h-16 items-center border-b border-[var(--mantra-border)] bg-[var(--mantra-bg)] px-6">
        <div className="flex h-full items-center justify-between">
          <div className="text-xl font-semibold text-[var(--foreground)]">
            대불정수능엄신주 외우기
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-64px)]">{children}</main>
    </div>
  );
}
