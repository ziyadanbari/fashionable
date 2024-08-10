import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, Center, Environment } from "@react-three/drei";
import Shirt from "./Shirt";
import CameraRig from "./CameraRig";
import { useSnapshot } from "valtio";
import { state } from "../store";

const CanvasModel = () => {
  const snap = useSnapshot(state);
  const [isRotating, setIsRotating] = useState(false);
  const [zoom, setZoom] = useState(
    (snap.intro ? 50 : snap.fov) * 8.88888888888889
  );
  const targetZoomRef = useRef((snap.intro ? 50 : snap.fov) * 8.88888888888889);
  const cameraRef = useRef<any>(null);
  useEffect(() => {
    const targetZoom = (snap.intro ? 50 : snap.fov) * 8.88888888888889;
    targetZoomRef.current = targetZoom;

    const animateZoom = () => {
      if (cameraRef.current) {
        const currentZoom = cameraRef.current.zoom;
        const targetZoom = targetZoomRef.current;
        const zoomDifference = targetZoom - currentZoom;

        if (Math.abs(zoomDifference) < 0.01) {
          setZoom(targetZoom);
          return;
        }

        const newZoom = currentZoom + zoomDifference * 0.1;
        setZoom(newZoom);

        requestAnimationFrame(animateZoom);
      }
    };

    animateZoom();
  }, [snap.fov, snap.intro]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default double-click behavior
    e.stopPropagation(); // Stop the event from propagating further
  };

  return (
    <Canvas
      shadows
      gl={{ preserveDrawingBuffer: true }}
      id="shirt_canvas"
      camera={{
        position: [0.4, 0.3, 0],
        fov: 100,
      }}
      onPointerUp={() => setIsRotating(false)}
      onPointerDown={() => setIsRotating(true)}
      onPointerCancel={() => setIsRotating(false)}
      onMouseLeave={() => setIsRotating(false)}
      onDoubleClick={handleDoubleClick} // Handle double-click to prevent zoom
      className={`w-full max-w-full h-full transition-all ease-in ${
        !state.intro && "cursor-grab"
      }`}>
      <OrthographicCamera
        ref={cameraRef}
        position={[0, 0.2, 5]}
        zoom={zoom}
        makeDefault={true}
      />
      <ambientLight intensity={0.2} />
      <Environment preset="city" />
      <CameraRig isRotating={isRotating} setIsRotating={setIsRotating}>
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
};

export default CanvasModel;
