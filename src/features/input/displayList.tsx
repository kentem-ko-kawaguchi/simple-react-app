import { useState, useMemo } from "react";
import { useInputAtom } from "./inputAtom";

type CompletionFilter = "all" | "incomplete" | "completed";
type DeadlineFilter = "all" | "today" | "week" | "month";
type SortOrder = "asc" | "desc";

export const DisplayList = () => {
    const { todoValue, setTodoValue } = useInputAtom();
    const [openId, setOpenId] = useState<number | null>(null);

    // 編集モーダル用 state
    const [editId, setEditId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState<string>("");
    const [editDetail, setEditDetail] = useState<string>("");
    const [editDeadLine, setEditDeadLine] = useState<string>("");

    // 削除確認モーダル用 state
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // フィルター・ソート用 state
    const [completionFilter, setCompletionFilter] = useState<CompletionFilter>("all");
    const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>("all");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [searchQuery, setSearchQuery] = useState("");

    // idで完了状態を切り替える関数
    const changeCompletionStatus = (id: number) => {
        setTodoValue((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            )
        );
    };

    // todoを編集する（deadLine は ISO 文字列で扱う）
    const editTodoByIndex = (id: number, newTitle: string, newDetail: string, newDeadLineIso: string) => {
        setTodoValue((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, title: newTitle, detail: newDetail, deadLine: newDeadLineIso } : todo
            )
        );
    };

    // 編集モーダルを開く
    const openEditModal = (id: number) => {
        const todo = todoValue.find((t) => t.id === id);
        if (!todo) return;
        setEditId(id);
        setEditTitle(todo.title ?? "");
        setEditDetail(todo.detail ?? "");
        setEditDeadLine(todo.deadLine ? new Date(todo.deadLine).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    };

    // 編集モーダルの保存
    const saveEdit = () => {
        if (editId === null) return;
        if (editTitle.trim() === "") {
            window.alert("タイトルを入力してください");
            return;
        }
        const iso = editDeadLine ? new Date(editDeadLine).toISOString() : new Date().toISOString();
        editTodoByIndex(editId, editTitle.trim(), editDetail, iso);
        setEditId(null);
    };

    // 削除確認モーダルを開く
    const openDeleteModal = (id: number) => {
        setDeleteId(id);
    };

    // 削除を実行
    const confirmDelete = () => {
        if (deleteId !== null) {
            deleteTodoByIndex(deleteId);
            setDeleteId(null);
        }
    };

    // idでtodoを削除する
    const deleteTodoByIndex = (id: number) => {
        setTodoValue((prev) => prev.filter((todo) => todo.id !== id));
    };

    // 今日の日付を取得
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // フィルタリング・ソート処理
    const filteredAndSortedTodos = useMemo(() => {
        let result = [...todoValue];

        // 完了状態フィルター
        if (completionFilter === "incomplete") {
            result = result.filter((todo) => !todo.isCompleted);
        } else if (completionFilter === "completed") {
            result = result.filter((todo) => todo.isCompleted);
        }

        // 期限フィルター
        if (deadlineFilter !== "all") {
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            result = result.filter((todo) => {
                const deadlineDate = new Date(todo.deadLine);
                deadlineDate.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                if (deadlineFilter === "today") {
                    return diffDays <= 0; // 今日まで（過去含む）
                } else if (deadlineFilter === "week") {
                    return diffDays <= 7; // 1週間以内
                } else if (deadlineFilter === "month") {
                    return diffDays <= 30; // 1ヶ月以内
                }
                return true;
            });
        }

        // 検索フィルター
        result = result.filter((todo) => 
            todo.title.includes(searchQuery) || 
            todo.detail.includes(searchQuery)
        );

        // ソート（日付順）
        result.sort((a, b) => {
            const dateA = new Date(a.deadLine).getTime();
            const dateB = new Date(b.deadLine).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [todoValue, completionFilter, deadlineFilter, sortOrder, searchQuery]);

    // 削除対象の todo を取得
    const deleteTargetTodo = todoValue.find((todo) => todo.id === deleteId);

    return (
        <div className="w-full">
            {/* フィルター・ソート UI */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <div className="flex flex-wrap gap-4 items-center">
                    {/* 完了状態フィルター */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold">完了状態：</label>
                        <select
                            value={completionFilter}
                            onChange={(e) => setCompletionFilter(e.target.value as CompletionFilter)}
                            className="p-2 border-2 border-slate-300 rounded"
                        >
                            <option value="all">すべて</option>
                            <option value="incomplete">未完了のみ</option>
                            <option value="completed">完了のみ</option>
                        </select>
                    </div>

                    {/* 期限フィルター */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold">期限：</label>
                        <select
                            value={deadlineFilter}
                            onChange={(e) => setDeadlineFilter(e.target.value as DeadlineFilter)}
                            className="p-2 border-2 border-slate-300 rounded"
                        >
                            <option value="all">すべて</option>
                            <option value="today">今日まで</option>
                            <option value="week">1週間以内</option>
                            <option value="month">1ヶ月以内</option>
                        </select>
                    </div>

                    {/* ソート */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold">並び順：</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                            className="p-2 border-2 border-slate-300 rounded"
                        >
                            <option value="asc">日付が近い順</option>
                            <option value="desc">日付が遠い順</option>
                        </select>
                    </div>

                    {/* 検索ボックス */}
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <label className="text-sm font-semibold whitespace-nowrap">検索：</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="タイトルまたは詳細で検索"
                            className="flex-1 p-2 border-2 border-slate-300 rounded"
                        />
                    </div>

                    {/* 表示件数 */}
                    <div className="ml-auto text-sm font-semibold text-gray-700">
                        {filteredAndSortedTodos.length} 件 / {todoValue.length} 件
                    </div>
                </div>
            </div>

            {/* Todo リスト */}
            <div className="space-y-2">
                {filteredAndSortedTodos.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">該当するTodoがありません</p>
                ) : (
                    filteredAndSortedTodos.map((todo) => {
                        const deadlineDate = new Date(todo.deadLine);
                        deadlineDate.setHours(0, 0, 0, 0);
                        const deadlineText = deadlineDate.toLocaleDateString();
                        
                        // 期限切れかどうかを判定（未完了で期限が過去）
                        const isOverdue = !todo.isCompleted && deadlineDate < today;

                        return (
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200" key={todo.id}>
                                <div className="flex items-center gap-3">
                                    {/* タイトル（フレックスで拡張） */}
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-lg font-semibold ${
                                            todo.isCompleted 
                                                ? "line-through text-gray-400" 
                                                : isOverdue 
                                                    ? "text-red-500" 
                                                    : "text-sky-700"
                                        }`}>
                                            {todo.title}
                                        </span>
                                    </div>

                                    {/* 期限（固定幅） */}
                                    <div className={`text-sm whitespace-nowrap w-32 ${isOverdue ? "text-red-600 font-semibold" : "text-gray-600"}`}>
                                        期限： {deadlineText}
                                    </div>

                                    {/* ボタン群（固定幅） */}
                                    <div className="flex gap-2 flex-shrink-0">
                                        {/* 詳細ボタン */}
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm w-16"
                                            onClick={() => setOpenId(todo.id)}
                                        >
                                            詳細
                                        </button>

                                        {/* 編集ボタン */}
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm w-16"
                                            onClick={() => openEditModal(todo.id)}
                                        >
                                            編集
                                        </button>

                                        {/* 完了・未完了切り替えボタン */}
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-sm w-20"
                                            onClick={() => changeCompletionStatus(todo.id)}
                                        >
                                            {todo.isCompleted ? "未完了" : "完了"}
                                        </button>

                                        {/* 削除ボタン */}
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-sm w-16"
                                            onClick={() => openDeleteModal(todo.id)}
                                        >
                                            削除
                                        </button>
                                    </div>

                                    {/* モーダル（詳細表示） */}
                                    {openId === todo.id && (
                                        <div
                                            className="fixed inset-0 z-50 flex items-center justify-center"
                                            aria-modal="true"
                                            role="dialog"
                                        >
                                            {/* オーバーレイ */}
                                            <div
                                                className="absolute inset-0 bg-black opacity-50"
                                                onClick={() => setOpenId(null)}
                                            />
                                            {/* モーダルコンテナ */}
                                            <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md mx-4 z-10">
                                                <h3 className="text-xl font-bold mb-2">{todo.title}</h3>
                                                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{todo.detail}</p>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                                        onClick={() => setOpenId(null)}
                                                    >
                                                        閉じる
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* 編集モーダル */}
            {editId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setEditId(null)} />
                    <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md mx-4 z-10">
                        <h3 className="text-xl font-bold mb-4">Todoを編集</h3>
                        <label className="block mb-2">
                            <div className="text-sm text-gray-600">タイトル</div>
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border-2 border-slate-300 rounded mt-1"
                            />
                        </label>
                        <label className="block mb-2">
                            <div className="text-sm text-gray-600">詳細</div>
                            <textarea
                                value={editDetail}
                                onChange={(e) => setEditDetail(e.target.value)}
                                className="w-full p-2 border-2 border-slate-300 rounded mt-1"
                                rows={4}
                            />
                        </label>
                        <label className="block mb-4">
                            <div className="text-sm text-gray-600">期限</div>
                            <input
                                type="date"
                                value={editDeadLine}
                                onChange={(e) => setEditDeadLine(e.target.value)}
                                className="w-full p-2 border-2 border-slate-300 rounded mt-1"
                            />
                        </label>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setEditId(null)}
                            >
                                キャンセル
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={saveEdit}
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 削除確認モーダル */}
            {deleteId !== null && deleteTargetTodo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setDeleteId(null)} />
                    <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md mx-4 z-10">
                        <h3 className="text-xl font-bold mb-4 text-red-600">削除確認</h3>
                        <p className="text-gray-700 mb-6">
                            <span className="font-semibold">{deleteTargetTodo.title}</span>を削除しますか？
                            <br />
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                onClick={() => setDeleteId(null)}
                            >
                                キャンセル
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={confirmDelete}
                            >
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
