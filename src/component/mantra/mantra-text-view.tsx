"use client";

import type React from "react";
import { useRef } from "react";
import { getIndentPx, getLinesForRender } from "@/lib/mantra-format";
import type { Mantra, RenderLineInfo } from "@/types/mantra";

export type GradeDisplayEntry = {
  correctChar: string;
  isCorrect: boolean;
};

export type MantraTextViewProps = {
  mantra: Mantra;
  blankIndices?: Set<number>;
  mode?: "practice" | "memorize";
  answers?: Record<number, string>;
  onChangeAnswer?: (index: number, value: string) => void;
  gradeDisplay?: Record<number, GradeDisplayEntry>;
  fontSize?: number;
  blankOrder?: number[];
};

const DEFAULT_FONT_SIZE = 20;

export function getMantraLayoutByFontSize(fontSize: number = DEFAULT_FONT_SIZE) {
  const baseFontSize = DEFAULT_FONT_SIZE;
  const ratio = fontSize / baseFontSize;

  return {
    fontSize,
    charBoxWidth: 24 * ratio,
    charBoxHeight: 26 * ratio,
    marginBottom: 12 * ratio,
  };
}

export default function MantraTextView({
  mantra,
  blankIndices = new Set<number>(),
  mode = "practice",
  answers,
  onChangeAnswer,
  gradeDisplay,
  fontSize = DEFAULT_FONT_SIZE,
  blankOrder,
}: MantraTextViewProps) {
  const { charBoxWidth, charBoxHeight, marginBottom } =
    getMantraLayoutByFontSize(fontSize);

  const lines = getLinesForRender(mantra);
  const isComposingRef = useRef(false);

  const focusInputAtEnd = (input: HTMLInputElement) => {
    input.focus();
  
    const length = input.value.length;
    input.setSelectionRange(length, length);
  };
  
  const moveToNextBlank = (
    currentElement: HTMLInputElement,
    globalIndex: number,
  ) => {
    if (!blankOrder) return;
  
    const currentPos = blankOrder.indexOf(globalIndex);
    if (currentPos === -1 || currentPos >= blankOrder.length - 1) return;
  
    const nextGlobalIndex = blankOrder[currentPos + 1];
    const container = currentElement.closest("[data-mantra-container]");
    if (!container) return;
  
    const selector = `input[data-blank-global-index="${nextGlobalIndex}"]`;
    const nextInput = container.querySelector<HTMLInputElement>(selector);
  
    if (!nextInput) return;
  
    focusInputAtEnd(nextInput);
  };
  
  const moveToPrevBlank = (
    currentElement: HTMLInputElement,
    globalIndex: number,
  ) => {
    if (!blankOrder) return;
  
    const currentPos = blankOrder.indexOf(globalIndex);
    if (currentPos <= 0) return;
  
    const prevGlobalIndex = blankOrder[currentPos - 1];
    const container = currentElement.closest("[data-mantra-container]");
    if (!container) return;
  
    const selector = `input[data-blank-global-index="${prevGlobalIndex}"]`;
    const prevInput = container.querySelector<HTMLInputElement>(selector);
  
    if (!prevInput) return;
  
    focusInputAtEnd(prevInput);
  };

  const handleBlankInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    globalIndex: number,
  ) => {
    if (!blankOrder || !onChangeAnswer) return;

    if (isComposingRef.current || e.nativeEvent.isComposing) return;

    const currentInput = e.currentTarget;
    const currentValue = currentInput.value;

    if (e.key === "Enter") {
      e.preventDefault();

      requestAnimationFrame(() => {
        moveToNextBlank(currentInput, globalIndex);
      });
      return;
    }

    if (e.key === "Backspace" && currentValue === "") {
      e.preventDefault();

      requestAnimationFrame(() => {
        moveToPrevBlank(currentInput, globalIndex);
      });
    }
  };

  const renderLine = (lineInfo: RenderLineInfo, lineIndex: number) => {
    const { line, indent, startIndex } = lineInfo;
    const lineChars = line.split("");
    const paddingLeft = getIndentPx(indent, charBoxWidth);
    const isMemorize = mode === "memorize";

    const elements = lineChars.map((char, i) => {
      const globalIndex = startIndex + i;

      if (blankIndices.has(globalIndex)) {
        if (gradeDisplay?.[globalIndex]) {
          const graded = gradeDisplay[globalIndex];

          return (
            <div
              key={globalIndex}
              className="flex items-center justify-center text-center font-mantra font-semibold"
              style={{
                width: charBoxWidth,
                height: charBoxHeight,
                border: "1px solid #999",
                borderRadius: 5,
                boxSizing: "border-box",
                backgroundColor: "#f8f8f8",
                fontSize,
                color: graded.isCorrect ? "#2563eb" : "#dc2626",
              }}
            >
              <span
                className="relative block leading-none"
                style={{
                  fontSize,
                  top: "-1px",
                }}
              >
                {graded.correctChar}
              </span>
            </div>
          );
        }

        if (isMemorize && onChangeAnswer) {
          const value = answers?.[globalIndex] ?? "";

          return (
            <input
              key={globalIndex}
              data-blank-global-index={globalIndex}
              value={value}
              maxLength={1}
              onChange={(e) => onChangeAnswer(globalIndex, e.target.value)}
              onKeyDown={(e) => handleBlankInputKeyDown(e, globalIndex)}
              onCompositionStart={() => {
                isComposingRef.current = true;
              }}
              onCompositionEnd={() => {
                isComposingRef.current = false;
              }}
              className="pb-0.5 text-center font-mantra font-semibold focus:outline-gray-500"
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
            className="flex items-center justify-center text-center"
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
              className="relative block leading-none font-mantra text-[#f8f8f8] hover:cursor-none hover:text-gray-400"
              style={{ fontSize, top: "-1px" }}
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
          <span
            className="relative block leading-none"
            style={{ fontSize, top: "-1px" }}
          >
            {char}
          </span>
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
    <div className="font-mantra leading-relaxed" data-mantra-container>
      {lines.map((lineInfo, lineIndex) => renderLine(lineInfo, lineIndex))}
    </div>
  );
}