import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { AppRegistry, useColorScheme } from "react-native";
import { name as appName } from "./app.json";
import { configureFonts, MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import { Navigator } from "./src/screens/Navigator";
import { darkColors, lightColors } from "./src/components";
import { en, registerTranslation } from "react-native-paper-dates";

registerTranslation("en", en);

const fontVariants = {
  bold: {
    fontWeight: 700,
    fontSize: 20,
  },
  light: {
    fontWeight: 400,
  },
  appHeader: {
    fontSize: 24,
    fontWeight: 700,
  },
};

if (__DEV__) {
  import("./Reactotron").then(() => console.log("Reactotron Configured"));
}

export default function Main() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();

  const paperTheme =
    colorScheme === "dark"
      ? {
        ...MD3DarkTheme,
        colors: { ...theme.dark, ...darkColors },
        fonts: configureFonts({ config: fontVariants, isV3: true }),
      }
      : {
        ...MD3LightTheme,
        colors: { ...theme.light, ...lightColors },
        fonts: configureFonts({ config: fontVariants, isV3: true }),
      };

  return (
    <PaperProvider theme={paperTheme}>
      <Navigator />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
