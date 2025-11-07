"use client";

import {
  ChakraProvider,
  createSystem,
  defineConfig,
  defaultConfig,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const customConfig = defineConfig({
  cssVarsRoot: "#chakra-ui-root",
});

const system = createSystem(defaultConfig, customConfig);

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
