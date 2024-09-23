import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      500: "#1A202C",  // Dark color theme
    },
  },
  styles: {
    global: {
      "html, body": {
        background: "#f0f0f0",
        color: "black",
      },
    },
  },
});

export default theme;
