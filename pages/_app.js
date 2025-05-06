import { ChakraProvider } from "@chakra-ui/react";
import theme from "../styles/theme";
import ParticleBackground from '../components/ParticleBackground';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ParticleBackground />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;