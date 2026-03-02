import { useMemo, useState } from "react";

type UsePaginationParams<T> = {
  items: T[];
  initialIndex?: number;
};

export function usePagination<T>({
  items,
  initialIndex = 0,
}: UsePaginationParams<T>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const total = items.length;

  const currentItem = useMemo(() => {
    return items[currentIndex] ?? null;
  }, [items, currentIndex]);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= total) return;
    setCurrentIndex(index);
  };

  return {
    currentIndex,
    currentItem,
    total,
    isFirst,
    isLast,
    goPrev,
    goNext,
    goTo,
    setCurrentIndex,
  };
}
