import { proxy } from "valtio";

export const state = proxy({
  intro: true,
  color: "#EFBD48",
  shirtColor: "#EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./threejs.png",
  fullDecal: "./threejs.png",
  fov: 70,
  xyzFix: false,
});
