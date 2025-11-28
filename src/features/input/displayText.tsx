import { useInputAtom } from "./inputAtom";

export const DisplayText = () => {
    const { todoValue, setTodoValue } = useInputAtom();

    // idで完了状態を切り替える関数
    const changeCompletionStatus = (id: number) => {
        setTodoValue((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            )
        );
    };

    // todoを編集する
    const editTodoByIndex = (id: number, newTitle: string, newDeadLine: Date) => {
        setTodoValue((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, title: newTitle, deadLine: newDeadLine } : todo
            )
        );
    }

    // 削除していいかの確認を行う
    const confirmDelete = (id: number): boolean => {
        let result = window.confirm("本当に削除しますか？");
        if (result) {
            deleteTodoByIndex(id);
        }

        return false;
    }

    // idでtodoを削除する
    const deleteTodoByIndex = (id: number) => {
        setTodoValue((prev) => prev.filter((todo) => todo.id !== id));
    };

    // 今日の日付を取得
    const today = new Date();

    return (
        <div>
            {todoValue.map((todo) => (
                <h2 className="text-2xl text-sky-700 font-bold" key={todo.id}>
                    <div className="flex items-center gap-2">
                        {/* タイトル */}
                        <span className={`${todo.isCompleted ? "line-through" : ""} ${todo.deadLine < today ? "text-red-500" : ""}`}>
                            {todo.title}
                        </span>
                        {/* 期限 */}
                        <div>
                            {" (期限: " + new Date(todo.deadLine).toLocaleDateString() + ")"}
                        </div>
                        {/*編集ボタン*/}
                        <button
                            type="button"
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                            onClick={() => {
                                const newTitle = prompt("新しいタイトルを入力してください", todo.title);
                                const newDeadLineString = prompt("新しい期限を入力してください (YYYY-MM-DD)", new Date(todo.deadLine).toISOString().split('T')[0]);
                                if (newTitle && newDeadLineString) {
                                    const newDeadLine = new Date(newDeadLineString);
                                    editTodoByIndex(todo.id, newTitle, newDeadLine);
                                }
                            }}
                        >
                            編集
                        </button>
                        {/* 完了・未完了切り替えボタン */}
                        <button
                            type="button"
                            className="px-2 py-1 bg-green-500 text-white rounded"
                            onClick={() => changeCompletionStatus(todo.id)}
                        >
                            {todo.isCompleted ? "未完了" : "完了"}
                        </button>
                        {/* 削除ボタン */}
                        <button
                            type="button"
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={() => confirmDelete(todo.id)}
                        >
                            削除
                        </button>
                    </div>
                </h2>
            ))}
        </div>
    );
};
