import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  fontSizes: {
    md: "1.05rem",
    lg: "1.2rem",
  },
  colors: {
    brand: {
      100: '#f7fafc',
      900: '#1a202c',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#000',
        color: 'gray.100',
        fontFamily: 'body',
        fontSize: 'md',
        lineHeight: 'tall',
      },
      a: {
        fontFamily: 'body',
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: 'white',
        fontFamily: 'heading',
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.100',
        fontFamily: 'body',
        fontSize: 'md',
      },
    },
    Button: {
      baseStyle: {
        fontFamily: 'body',
      },
    },
    Input: {
      baseStyle: {
        fontFamily: 'body',
      },
    },
    Box: {
      variants: {
        card: {
          bg: 'rgba(26, 32, 44, 0.7)',
          borderRadius: 'md',
          p: 4,
          boxShadow: 'md',
        },
      },
    },
  },
});

export default theme;