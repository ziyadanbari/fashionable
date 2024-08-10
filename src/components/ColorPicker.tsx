import { SketchPicker } from "react-color";
import { state } from "../store";
import { useSnapshot } from "valtio";

const ColorPicker = () => {
  const snap = useSnapshot(state);
  return (
    <div>
      <SketchPicker
        color={snap.shirtColor}
        onChange={(color) => (state.shirtColor = color.hex)}
      />
    </div>
  );
};

export default ColorPicker;
