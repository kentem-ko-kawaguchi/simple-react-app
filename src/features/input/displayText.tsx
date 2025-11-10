import { useInputAtom } from "./inputAtom";

export const DisplayText = () => {
    const { todoValue, setTodoValue } = useInputAtom();

    // index（連番）で完了状態を切り替える関数
    const changeCompletionStatusByIndex = (index: number) => {
        setTodoValue((prev) =>
            prev.map((todo, i) =>
                i === index ? { ...todo, isCompleted: !todo.isCompleted } : todo
            )
        );
    };

    // index（連番）で削除する関数
    const deleteTodoByIndex = (index: number) => {
        setTodoValue((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            {todoValue.map((todo, index) => (
                <h2 className="text-2xl text-sky-700 font-bold" key={index}>
                    <div className="flex items-center gap-2">
                        {/* 連番 */}
                        <span className="font-medium">{index + 1}.</span>
                        {/* タイトル */}
                        <span className={todo.isCompleted ? "line-through" : ""}>
                            {todo.title}
                        </span>
                        {/* 期限 */}
                        <div>
                            {" (期限: " + new Date(todo.deadLine).toLocaleDateString() + ")"}
                        </div>
                        {/* 完了・未完了切り替えボタン */} 
                        <button
                            type="button"
                            className="px-2 py-1 bg-green-500 text-white rounded"
                            onClick={() => changeCompletionStatusByIndex(index)}
                        >
                            {todo.isCompleted ? "未完了" : "完了"}
                        </button>
                        {/* 削除ボタン */}
                        <button
                            type="button"
                            className="px-2 py-1 bg-red-500 text-white rounded"
                            onClick={() => deleteTodoByIndex(index)}
                        >
                            削除
                        </button>
                    </div>
                </h2>
            ))}
        </div>
    );
};
