import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import { state } from "../store";
import { downloadCanvasToImage } from "../config/helpers";
import { DecalTypes, EditorTabs, FilterTabs } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import ColorPicker from "../components/ColorPicker";
import FilePicker from "../components/FilePicker";
import CustomButton from "../components/CustomButton";
import Tab from "../components/Tab";
import { Minus, Plus } from "lucide-react";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [activeEditorTab, setActiveEditTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });
  useEffect(() => {
    if (activeFilterTab.logoShirt) {
      state.isLogoTexture = true;
      state.isFullTexture = false;
    } else if (activeFilterTab.stylishShirt) {
      state.isFullTexture = true;
      state.isLogoTexture = false;
    }
  }, [activeFilterTab]);
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker />;
      default:
        return null;
    }
  };
  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key={"custom"}
            className="absolute top-0 left-0 "
            {...slideAnimation("left")}>
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() =>
                      setActiveEditTab(
                        activeEditorTab === tab.name ? "" : tab.name
                      )
                    }
                  />
                ))}
              </div>
              {generateTabContent()}
            </div>
          </motion.div>
          <motion.div className="absolute top-0 right-0 m-4" {...fadeAnimation}>
            <div>
              <CustomButton
                type="filled"
                title="Go Back"
                handleClick={() => (state.intro = true)}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </div>
          </motion.div>
          <motion.div {...slideAnimation("up")}>
            <div className="filtertabs-container">
              {FilterTabs.map((tab) =>
                tab.name === "xyzfix" ? (
                  <div
                    onClick={() => (state.xyzFix = !state.xyzFix)}
                    className={`p-2 rounded-md cursor-pointer ${
                      snap.xyzFix ? "bg-gray-600" : "bg-gray-300"
                    }`}>
                    Fixed
                  </div>
                ) : (
                  <Tab
                    isFilterTab
                    isActiveTab={
                      activeFilterTab[tab.name as keyof typeof activeFilterTab]
                    }
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      if (tab.name === DecalTypes.logo.filterTab) {
                        setActiveFilterTab({
                          logoShirt: true,
                          stylishShirt: false,
                        });
                      } else if (tab.name === DecalTypes.full.filterTab) {
                        setActiveFilterTab({
                          logoShirt: false,
                          stylishShirt: true,
                        });
                      } else if (tab.name === "download") {
                        downloadCanvasToImage();
                      }
                    }}
                  />
                )
              )}
            </div>
          </motion.div>
          <motion.div
            {...slideAnimation("right")}
            className="absolute bottom-12 right-0 m-5">
            <div>
              <button
                disabled={snap.fov >= 80}
                className="p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => (state.fov += 10)}>
                <Plus />
              </button>
              <hr />
              <button
                disabled={snap.fov <= 10}
                className="p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => (state.fov -= 10)}>
                <Minus />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
