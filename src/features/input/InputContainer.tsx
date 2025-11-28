import { useInputAtom } from "./inputAtom";

export const InputContainer = () => {
  const { todoValue,setTodoValue } = useInputAtom();

    const onSubmit = (data: FormData) => {
        const formData = Object.fromEntries(data.entries());

        setTodoValue((prev) =>[
            ...prev,
            {
                id: todoValue.length,
                title: String(formData.title),
                deadLine: String(formData.deadLine),
                isCompleted: false
            }
        ]);
  };

  return (
    <form className="flex gap-4" action={onSubmit}>
      <input
        name="title"
        type="text"
        className="p-2 border-2 border-slate-500 rounded"
      />
      {/* ‚¢‚©‚É Calendar ‚ÅŠúŒÀ‚ğİ’è‚·‚é UI ‚ğ’Ç‰Á */}
      <input
        name="deadLine"
        type="date"
        className="p-2 border-2 border-slate-500 rounded"
      />
      <button type="submit" className="px-4 py-2 bg-slate-700 text-white rounded">
        Submit
      </button>
    </form>
  );
};
