import { Image } from "react-native";

import { images } from "../../assets/assets";

export function preloadAssets() {
  Image.prefetch(images.logo);
}
