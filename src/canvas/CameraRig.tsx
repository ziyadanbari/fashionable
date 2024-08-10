import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSnapshot } from "valtio";
import { state as storeState } from "../store";
import * as THREE from "three";

const CameraRig = ({
  children,
  isRotating,
  setIsRotating,
}: {
  children: ReactNode;
  isRotating: boolean;
  setIsRotating: Dispatch<SetStateAction<boolean>>;
}) => {
  const group = useRef<any>();
  const snap = useSnapshot(storeState);

  const [mouseDown, setMouseDown] = useState(false);
  const previousMouseCords = useRef({
    x: 0,
    y: 0,
  });

  useFrame((state, delta) => {
    state.onPointerMissed = () => {
      setMouseDown(false);
      setIsRotating(false);
    };
    const isBreakPoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    let targetPosition: [x: number, y: number, z: number] = [-0.5, 0, 2];
    if (snap.intro) {
      if (isBreakPoint) targetPosition = [0, 0.04, 2];
      if (isMobile) targetPosition = [0, 0.2, 2.5];
    } else {
      if (isMobile) targetPosition = [0, 0, 2.5];
      else targetPosition = [0, 0, 2];
    }
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    if (isRotating && state && !storeState.intro) {
      const deltaMove = {
        x:
          (state.pointer.x * window.innerWidth - previousMouseCords.current.x) *
          0.6,
        y:
          -(
            state.pointer.y * window.innerHeight -
            previousMouseCords.current.y
          ) * 0.6,
      };

      if (
        previousMouseCords.current.x !== 0 ||
        previousMouseCords.current.y !== 0
      ) {
        const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            THREE.MathUtils.degToRad(deltaMove.y * 0.5),
            THREE.MathUtils.degToRad(deltaMove.x * 0.5),
            0,
            "XYZ"
          )
        );

        group.current.quaternion.multiplyQuaternions(
          deltaRotationQuaternion,
          group.current.quaternion
        );
      }

      previousMouseCords.current = {
        x: state.mouse.x * window.innerWidth,
        y: state.mouse.y * window.innerHeight,
      };
    } else if (!isRotating && !snap.xyzFix) {
      easing.dampE(group.current.rotation, [0, 0, 0], 0.25, delta);
    }
  });

  useEffect(() => {
    const handleMouseDown = () => {
      setMouseDown(true);
    };

    const handleMouseUp = () => {
      setMouseDown(false);
      setIsRotating(false);
      previousMouseCords.current = { x: 0, y: 0 };
    };

    const handleMouseMove = () => {
      if (mouseDown) {
        setIsRotating(true);
      }
    };

    const shirtCanvas = document.getElementById("shirt_canvas");
    if (shirtCanvas) {
      shirtCanvas.addEventListener("mousedown", handleMouseDown);
      shirtCanvas.addEventListener("mouseup", handleMouseUp);
      shirtCanvas.addEventListener("mousemove", handleMouseMove);

      return () => {
        shirtCanvas.removeEventListener("mousedown", handleMouseDown);
        shirtCanvas.removeEventListener("mouseup", handleMouseUp);
        shirtCanvas.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [mouseDown]);

  useEffect(() => {
    (() => {
      const shirtCanvas = document.getElementById("shirt_canvas");
      if (!shirtCanvas) return;
      if (!snap.intro) {
        return (shirtCanvas.style.cursor = isRotating ? "grabbing" : "grab");
      } else if (snap.intro) {
        return (shirtCanvas.style.cursor = "default");
      }
    })();
  }, [isRotating]);

  return <group ref={group}>{children}</group>;
};

export default CameraRig;
