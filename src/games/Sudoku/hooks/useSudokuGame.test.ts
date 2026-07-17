import {describe, expect, it} from "vitest";
import {renderHook, act} from "@testing-library/react";
import {useSudokuGame} from "./useSudokuGame.ts";

describe("useSudokuGame draft candidates", () => {
  it("adds a candidate to a cell when selecting in draft mode", () => {
    const {result} = renderHook(() => useSudokuGame());

    act(() => {
      result.current.setIsInDraftMode(true);
    });
    act(() => {
      result.current.handleSelect(5, 0);
    });

    expect(result.current.candidates[0]).toContain(5);
  });

  it("toggles a candidate off when selected twice", () => {
    const {result} = renderHook(() => useSudokuGame());

    act(() => {
      result.current.setIsInDraftMode(true);
    });
    act(() => {
      result.current.handleSelect(5, 0);
    });
    act(() => {
      result.current.handleSelect(5, 0);
    });

    expect(result.current.candidates[0]).not.toContain(5);
  });

  it("keeps candidates of other cells untouched", () => {
    const {result} = renderHook(() => useSudokuGame());

    act(() => {
      result.current.setIsInDraftMode(true);
    });
    act(() => {
      result.current.handleSelect(3, 0);
    });
    act(() => {
      result.current.handleSelect(7, 1);
    });

    expect(result.current.candidates[0]).toEqual([3]);
    expect(result.current.candidates[1]).toEqual([7]);
  });
});
