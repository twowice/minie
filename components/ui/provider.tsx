"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { useState, useEffect } from "react";

export function Provider(props: ColorModeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ChakraProvider value={defaultSystem}>
      {mounted && <ColorModeProvider {...props} />}
    </ChakraProvider>
  );
}
