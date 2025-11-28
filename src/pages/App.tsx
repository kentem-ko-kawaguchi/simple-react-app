import { DisplayText } from "../features/input/displayText";
import { InputContainer } from "../features/input/InputContainer";

export const App = () => {
  return (
      <main className="p-4 flex flex-col gap-4 items-center">
          <h1 className=" text-4xl text-teal-700 text-center">Todo List({})</h1>
          <InputContainer />
          <DisplayText />
    </main>
  );
};
