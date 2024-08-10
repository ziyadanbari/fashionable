import { CSSProperties } from "react";
import { EditorTabs, FilterTabs } from "../config/constants";
import { useSnapshot } from "valtio";
import { state } from "../store";

interface Props {
  handleClick?: (...args: any) => any;
  tab: (typeof EditorTabs | typeof FilterTabs)[0];
  isFilterTab?: boolean;
  isActiveTab?: boolean;
}

const Tab = ({ tab, isFilterTab, isActiveTab, handleClick }: Props) => {
  const snap = useSnapshot(state);
  const activeStyles: CSSProperties =
    isFilterTab && isActiveTab
      ? { backgroundColor: snap.color, opacity: 0.5 }
      : {
          backgroundColor: "transparent",
          opacity: 1,
        };
  return (
    <div
      key={tab.name}
      className={`tab-btn ${
        isFilterTab ? "rounded-full glassmorhism" : "rounded-4"
      }`}
      onClick={handleClick}
      style={activeStyles}>
      <img
        src={tab.icon}
        alt={tab.name}
        className={`${
          isFilterTab ? "w-2/3 h-2/3" : "w-11/12 h-11/12"
        } object-contain`}
      />
    </div>
  );
};

export default Tab;
