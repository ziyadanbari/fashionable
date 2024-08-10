import { CSSProperties } from "react";
import { useSnapshot } from "valtio";
import { state } from "../store";

interface Props {
  type?: string;
  title: string;
  handleClick?: (...args: any) => any;
  customStyles?: string;
}

const CustomButton = ({ type, title, handleClick, customStyles }: Props) => {
  const snap = useSnapshot(state);
  const generateStyle = (type?: string): CSSProperties | undefined => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color,
        color: "#fff",
      };
    }
  };
  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      onClick={handleClick}
      style={generateStyle(type)}>
      {title}
    </button>
  );
};

export default CustomButton;
