import { getIndentPx, getLinesForRender } from "@/lib/mantra-format";
import type { Mantra, RenderLineInfo } from "@/types/mantra";

export type MantraTextViewProps = {
  mantra: Mantra;
  blankIndices?: Set<number>;
  mode?: "practice" | "memorize";
  answers?: Record<number, string>;
  onChangeAnswer?: (index: number, value: string) => void;
  charBoxWidth?: number;
  charBoxHeight?: number;
  fontSize?: number;
  marginBottom?: number;
};

export default function MantraTextView({
  mantra,
  blankIndices = new Set<number>(),
  mode = "practice",
  answers,
  onChangeAnswer,
  charBoxWidth = 24,
  charBoxHeight = 26,
  fontSize = 20,
  marginBottom = 10,
}: MantraTextViewProps) {
  const lines = getLinesForRender(mantra);

  const renderLine = (lineInfo: RenderLineInfo, lineIndex: number) => {
    const { line, indent, startIndex } = lineInfo;
    const lineChars = line.split("");
    const paddingLeft = getIndentPx(indent, charBoxWidth);
    const isMemorize = mode === "memorize";

    const elements = lineChars.map((char, i) => {
      const globalIndex = startIndex + i;

      if (blankIndices.has(globalIndex)) {
        if (isMemorize && onChangeAnswer) {
          const value = answers?.[globalIndex] ?? "";

          return (
            <input
              key={globalIndex}
              value={value}
              maxLength={1}
              onChange={(e) => onChangeAnswer(globalIndex, e.target.value)}
              className="flex items-center justify-center text-center font-mantra font-semibold focus:outline-gray-500"
              style={{
                width: charBoxWidth,
                height: charBoxHeight,
                border: "1px solid #999",
                borderRadius: 5,
                boxSizing: "border-box",
                backgroundColor: "#f8f8f8",
                fontSize,
              }}
            />
          );
        }

        return (
          <div
            key={globalIndex}
            className="flex items-center justify-center"
            style={{
              width: charBoxWidth,
              height: charBoxHeight,
              border: "1px solid #999",
              borderRadius: 5,
              boxSizing: "border-box",
              backgroundColor: "#f8f8f8",
            }}
          >
            <span
              className="font-mantra text-[#f8f8f8] hover:text-gray-400 hover:cursor-none"
              style={{ fontSize }}
            >
              {char}
            </span>
          </div>
        );
      }

      return (
        <div
          key={globalIndex}
          className="flex items-center justify-center font-mantra"
          style={{
            width: charBoxWidth,
            height: charBoxHeight,
          }}
        >
          <span style={{ fontSize }}>{char}</span>
        </div>
      );
    });

    return (
      <div
        key={lineIndex}
        className="flex"
        style={{ paddingLeft, marginBottom }}
      >
        {elements}
      </div>
    );
  };

  return (
    <div className="font-mantra leading-relaxed">
      {lines.map((lineInfo, lineIndex) => renderLine(lineInfo, lineIndex))}
    </div>
  );
}
