"use client";

import type React from "react";
import { useCallback, useRef } from "react";

const CONTAINER_SELECTOR = "[data-mantra-container]";
const BLANK_INPUT_SELECTOR = (globalIndex: number) =>
  `input[data-blank-global-index="${globalIndex}"]`;

function focusInputAtEnd(input: HTMLInputElement) {
  input.focus();
  const length = input.value.length;
  input.setSelectionRange(length, length);
}

export function useBlankInputKeys(
  blankOrder: number[] | undefined,
  options?: {
    onEnterAtLastBlank?: () => void;
    onBackspaceAtFirstBlank?: () => void;
  },
) {
  const isComposingRef = useRef(false);
  const onEnterAtLastBlank = options?.onEnterAtLastBlank;
  const onBackspaceAtFirstBlank = options?.onBackspaceAtFirstBlank;

  const moveToNextBlank = useCallback(
    (currentElement: HTMLInputElement, globalIndex: number) => {
      if (!blankOrder?.length) return;
      const currentPos = blankOrder.indexOf(globalIndex);
      if (currentPos === -1 || currentPos >= blankOrder.length - 1) return;
      const nextGlobalIndex = blankOrder[currentPos + 1];
      const container = currentElement.closest(CONTAINER_SELECTOR);
      if (!container) return;
      const nextInput = container.querySelector<HTMLInputElement>(
        BLANK_INPUT_SELECTOR(nextGlobalIndex),
      );
      if (nextInput) focusInputAtEnd(nextInput);
    },
    [blankOrder],
  );

  const moveToPrevBlank = useCallback(
    (currentElement: HTMLInputElement, globalIndex: number) => {
      if (!blankOrder?.length) return;
      const currentPos = blankOrder.indexOf(globalIndex);
      if (currentPos <= 0) return;
      const prevGlobalIndex = blankOrder[currentPos - 1];
      const container = currentElement.closest(CONTAINER_SELECTOR);
      if (!container) return;
      const prevInput = container.querySelector<HTMLInputElement>(
        BLANK_INPUT_SELECTOR(prevGlobalIndex),
      );
      if (prevInput) focusInputAtEnd(prevInput);
    },
    [blankOrder],
  );

  const handleBlankInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, globalIndex: number) => {
      if (!blankOrder?.length) return;
      if (isComposingRef.current || e.nativeEvent.isComposing) return;

      const currentInput = e.currentTarget;
      const currentValue = currentInput.value;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const currentPos = blankOrder.indexOf(globalIndex);
        const isLastBlank = currentPos === blankOrder.length - 1;
        if (isLastBlank && onEnterAtLastBlank) {
          onEnterAtLastBlank();
          return;
        }
        requestAnimationFrame(() => moveToNextBlank(currentInput, globalIndex));
        return;
      }

      if (e.key === "Backspace" && currentValue === "") {
        e.preventDefault();
        const currentPos = blankOrder.indexOf(globalIndex);
        const isFirstBlank = currentPos === 0;
        if (isFirstBlank && onBackspaceAtFirstBlank) {
          onBackspaceAtFirstBlank();
          return;
        }
        requestAnimationFrame(() => moveToPrevBlank(currentInput, globalIndex));
      }
    },
    [
      blankOrder,
      moveToNextBlank,
      moveToPrevBlank,
      onEnterAtLastBlank,
      onBackspaceAtFirstBlank,
    ],
  );

  const onCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const onCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
  }, []);

  return {
    handleBlankInputKeyDown,
    onCompositionStart,
    onCompositionEnd,
  };
}
