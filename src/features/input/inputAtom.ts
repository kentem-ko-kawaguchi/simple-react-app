import { atom, useAtomValue, useSetAtom } from "jotai";

// inputの状態を管理するatom
const inputAtom = atom<string>("");

// todoList用のatom
type Todo = {
    title: string;
    deadLine: Date;
    isCompleted: boolean
};
export const todosAtom = atom<Todo[]>([]);

// 値とセット関数を返すカスタムフック
export const useInputAtom = () => {
    const todoValue = useAtomValue(todosAtom);
    const setTodoValue = useSetAtom(todosAtom);

    return { todoValue, setTodoValue };
};

