import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    bg: "#000000",
    text: "#FFFFFF",
    accent: "#4A5568",
  },
  styles: {
    global: {
      body: {
        bg: "bg",
        color: "text",
      },
    },
  },
});

export default theme;
