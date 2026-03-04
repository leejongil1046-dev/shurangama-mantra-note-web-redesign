import { getFullText } from "@/lib/mantra-format";
import type { Mantra } from "@/types/mantra";
import type { Difficulty } from "@/store/setting-store";

export const difficultyToRatio: Record<Difficulty, number> = {
  easy: 0.1,
  medium: 0.2,
  hard: 0.3,
} as const;

export function createBlankIndices(mantra: Mantra, ratio: number): Set<number> {
  const fullText = getFullText(mantra);
  const chars = fullText.split("");

  const canBlank = chars
    .map((char, index) => ({ char, index }))
    .filter(({ char }) => char !== " " && char !== "\n");

  const clampedRatio = Math.max(0, Math.min(ratio, 1));
  const count = Math.max(1, Math.floor(canBlank.length * clampedRatio));
  const shuffled = [...canBlank].sort(() => Math.random() - 0.5);

  return new Set(shuffled.slice(0, count).map((item) => item.index));
}
