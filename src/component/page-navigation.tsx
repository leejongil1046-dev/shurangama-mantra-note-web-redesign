import type { MantraPageItem } from "@/types/mantra";

type PageNavigationProps = {
  pages: MantraPageItem[];
  currentIndex: number;
  onSelectPage: (index: number) => void;
};

export default function PageNavigation({
  pages,
  currentIndex,
  onSelectPage,
}: PageNavigationProps) {
  return (
    <aside className="h-full overflow-y-auto border-r border-[var(--mantra-border)] bg-[var(--sidebar-bg)] p-4">
      <div className="mb-4 text-sm font-semibold text-[var(--foreground)]">
        페이지
      </div>

      <nav className="flex flex-col gap-2">
        {pages.map((page, index) => {
          const isActive = currentIndex === index;

          return (
            <button
              key={page.id}
              onClick={() => onSelectPage(index)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "bg-[var(--accent)] font-semibold text-white"
                  : "text-[var(--foreground)] hover:bg-[var(--mantra-border)]/50"
              }`}
            >
              {page.pageNumber}페이지
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
