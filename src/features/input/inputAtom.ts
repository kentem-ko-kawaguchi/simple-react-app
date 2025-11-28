import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// inputの状態を管理するatom（必要なら使用）
const inputAtom = atom<string>("");

// todoList用のatom
type Todo = {
    id: number;
    title: string;
    //deadLine: Date;
    isCompleted: boolean;
};

const TODOS_STORAGE_KEY = "todos";

// localStorageと同期するatom。atomWithStorageを使うことで読み書きは自動でlocalStorageに反映される。
export const todosAtom = atomWithStorage<Todo[]>(TODOS_STORAGE_KEY, []);

// 値とセット関数を返すカスタムフック
export const useInputAtom = () => {
    const todoValue = useAtomValue(todosAtom);
    const setTodoValue = useSetAtom(todosAtom);

    return { todoValue, setTodoValue };
};
