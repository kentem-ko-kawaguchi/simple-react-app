import { atom, useAtomValue, useSetAtom } from "jotai";

// inputの状態を管理するatomを定義
const inputAtom = atom("");

// 値とセット関数を返すカスタムフック
export const useInputAtom = () => {
  const inputValue = useAtomValue(inputAtom);
  const setInputValue = useSetAtom(inputAtom);

  return { displayText: getDisplayText(inputValue), setInputValue };
};

// 入力値を大文字に変換する関数
const getDisplayText = (inputValue: string) => {
  return inputValue ? inputValue.toUpperCase() : "no text";
};

// テストコード(ロジックをテスト)
if (import.meta.vitest) {
  describe("getDisplayText", () => {
    it("入力が小文字なら出力が大文字であること", () => {
      expect(getDisplayText("hello")).toBe("HELLO");
    });
    it("空文字の時はno textであること", () => {
      expect(getDisplayText("")).toBe("no text");
    });
  });
}
