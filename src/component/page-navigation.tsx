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
    <aside className="h-full overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 text-sm font-semibold text-gray-700">페이지</div>

      <nav className="flex flex-col gap-2">
        {pages.map((page, index) => {
          const isActive = currentIndex === index;

          return (
            <button
              key={page.id}
              onClick={() => onSelectPage(index)}
              className={`cursor-pointer rounded px-3 py-2 text-left text-sm ${
                isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
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
