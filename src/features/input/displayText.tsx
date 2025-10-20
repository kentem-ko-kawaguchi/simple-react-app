import { useInputAtom } from "./inputAtom";

export const DisplayText = () => {
  const { displayText } = useInputAtom();

  return <h2 className="text-2xl text-sky-700 font-bold">{displayText}</h2>;
};
