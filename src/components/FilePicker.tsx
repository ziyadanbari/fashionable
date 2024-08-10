import React, { useEffect, useRef } from "react";
import { state } from "../store";
import { reader } from "../config/helpers";
import { toast } from "react-toastify";

const FilePicker = () => {
  const [selectedFile, setSelectedFile] = React.useState<File>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [fileInputRef.current]);
  useEffect(() => {
    (async () => {
      if (selectedFile) {
        if (!selectedFile.type.includes("image"))
          return toast("You must upload just images", {
            type: "error",
            theme: "dark",
            autoClose: 4000,
          });
        const base64 = String(await reader(selectedFile));
        if (!base64)
          return toast("Cannot upload image", {
            type: "error",
            theme: "dark",
            autoClose: 4000,
          });
        state.fullDecal = base64;
        state.logoDecal = base64;
      }
    })();
  }, [selectedFile]);
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          e.target.files && setSelectedFile(e?.target?.files[0]);
          e.target.value = "";
        }}
        hidden
        accept="image/*"
      />
    </div>
  );
};

export default FilePicker;
