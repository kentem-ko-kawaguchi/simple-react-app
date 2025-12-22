import { useInputAtom } from "./inputAtom";

export const InputContainer = () => {
    const { todoValue, setTodoValue } = useInputAtom();

    const onSubmit = (data: FormData) => {
        const formData = Object.fromEntries(data.entries());

        if (!formData.title) {
            window.confirm("タイトルを入力してください");
            return;
        }

        if (!formData.deadLine) {
            formData.deadLine = String(new Date());
        }

        // 最大IDを取得して+1する（重複を防ぐ）
        const maxId = todoValue.length > 0 ? Math.max(...todoValue.map((t) => t.id)) : -1;
        const newId = maxId + 1;

        setTodoValue((prev) => [
            ...prev,
            {
                id: newId,
                title: String(formData.title),
                detail: String(formData.detail),
                deadLine: String(formData.deadLine), // 文字列を Date に変換
                isCompleted: false,
            },
        ]);
    };

    return (
        <form className="flex gap-4" action={onSubmit}>
            <input
                name="title"
                placeholder="タイトル"
                type="text"
                className="p-2 border-2 border-slate-500 rounded"
            />
            <textarea
                name="detail"
                placeholder="詳細"
                className="p-2 border-2 border-slate-500 rounded"
            />
            {/* Calendar で期限を設定する UI */}
            <input
                name="deadLine"
                type="date"
                className="p-2 border-2 border-slate-500 rounded"
            />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                追加
            </button>
        </form>
    );
};
