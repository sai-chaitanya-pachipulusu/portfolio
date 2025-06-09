import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import ParticleBackground from '../components/ParticleBackground';
//import '../styles/globals.css';

// Enhanced theme with better font sizes
const theme = extendTheme({
  fonts: {
    heading: 'Manrope, sans-serif',
    body: 'Manrope, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#0a0a0a',
        color: 'white',
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ParticleBackground />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;