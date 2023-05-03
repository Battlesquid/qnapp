/**
 * @format
 */

import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { AppRegistry, Platform, useColorScheme } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";
import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";

const lightColors = {
  "primary": "rgb(188, 17, 35)",
  "onPrimary": "rgb(255, 255, 255)",
  "primaryContainer": "rgb(255, 218, 215)",
  "onPrimaryContainer": "rgb(65, 0, 5)",
  "secondary": "rgb(119, 86, 84)",
  "onSecondary": "rgb(255, 255, 255)",
  "secondaryContainer": "rgb(255, 218, 215)",
  "onSecondaryContainer": "rgb(44, 21, 20)",
  "tertiary": "rgb(115, 91, 46)",
  "onTertiary": "rgb(255, 255, 255)",
  "tertiaryContainer": "rgb(255, 222, 167)",
  "onTertiaryContainer": "rgb(39, 25, 0)",
  "error": "rgb(186, 26, 26)",
  "onError": "rgb(255, 255, 255)",
  "errorContainer": "rgb(255, 218, 214)",
  "onErrorContainer": "rgb(65, 0, 2)",
  "background": "rgb(255, 251, 255)",
  "onBackground": "rgb(32, 26, 26)",
  "surface": "rgb(255, 251, 255)",
  "onSurface": "rgb(32, 26, 26)",
  "surfaceVariant": "rgb(245, 221, 219)",
  "onSurfaceVariant": "rgb(83, 67, 66)",
  "outline": "rgb(133, 115, 113)",
  "outlineVariant": "rgb(216, 194, 192)",
  "shadow": "rgb(0, 0, 0)",
  "scrim": "rgb(0, 0, 0)",
  "inverseSurface": "rgb(54, 47, 46)",
  "inverseOnSurface": "rgb(251, 238, 236)",
  "inversePrimary": "rgb(255, 179, 174)",
  "elevation": {
    "level0": "transparent",
    "level1": "rgb(252, 239, 244)",
    "level2": "rgb(250, 232, 237)",
    "level3": "rgb(248, 225, 231)",
    "level4": "rgb(247, 223, 229)",
    "level5": "rgb(246, 218, 224)",
  },
  "surfaceDisabled": "rgba(32, 26, 26, 0.12)",
  "onSurfaceDisabled": "rgba(32, 26, 26, 0.38)",
  "backdrop": "rgba(59, 45, 44, 0.4)",
};

const darkColors = {
  "primary": "rgb(255, 179, 174)",
  "onPrimary": "rgb(104, 0, 12)",
  "primaryContainer": "rgb(147, 0, 22)",
  "onPrimaryContainer": "rgb(255, 218, 215)",
  "secondary": "rgb(231, 189, 185)",
  "onSecondary": "rgb(68, 41, 40)",
  "secondaryContainer": "rgb(93, 63, 61)",
  "onSecondaryContainer": "rgb(255, 218, 215)",
  "tertiary": "rgb(226, 194, 140)",
  "onTertiary": "rgb(64, 45, 4)",
  "tertiaryContainer": "rgb(89, 67, 25)",
  "onTertiaryContainer": "rgb(255, 222, 167)",
  "error": "rgb(255, 180, 171)",
  "onError": "rgb(105, 0, 5)",
  "errorContainer": "rgb(147, 0, 10)",
  "onErrorContainer": "rgb(255, 180, 171)",
  "background": "rgb(32, 26, 26)",
  "onBackground": "rgb(237, 224, 222)",
  "surface": "rgb(32, 26, 26)",
  "onSurface": "rgb(237, 224, 222)",
  "surfaceVariant": "rgb(83, 67, 66)",
  "onSurfaceVariant": "rgb(216, 194, 192)",
  "outline": "rgb(160, 140, 139)",
  "outlineVariant": "rgb(83, 67, 66)",
  "shadow": "rgb(0, 0, 0)",
  "scrim": "rgb(0, 0, 0)",
  "inverseSurface": "rgb(237, 224, 222)",
  "inverseOnSurface": "rgb(54, 47, 46)",
  "inversePrimary": "rgb(188, 17, 35)",
  "elevation": {
    "level0": "transparent",
    "level1": "rgb(43, 34, 33)",
    "level2": "rgb(50, 38, 38)",
    "level3": "rgb(57, 43, 42)",
    "level4": "rgb(59, 44, 44)",
    "level5": "rgb(63, 47, 47)",
  },
  "surfaceDisabled": "rgba(237, 224, 222, 0.12)",
  "onSurfaceDisabled": "rgba(237, 224, 222, 0.38)",
  "backdrop": "rgba(59, 45, 44, 0.4)",
};

const fontVariants = {
  bold: {
    fontFamily: "Montserrat-Semibold",
    fontWeight:800,
    fontSize: 20
  }
}

export default function Main() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ sourceColor: "#D22630" });

  const paperTheme =
    colorScheme === "dark"
      ? { ...MD3DarkTheme, colors: { ...theme.dark, ...darkColors }, fonts: configureFonts({ config: fontVariants, isV3: true }) }
      : { ...MD3LightTheme, colors: { ...theme.light, ...lightColors }, fonts: configureFonts({ config: fontVariants, isV3: true }) };

  return (
    <PaperProvider theme={paperTheme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
