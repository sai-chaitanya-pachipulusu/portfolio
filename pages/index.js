import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <Box>
      <Navbar />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </Box>
  );
}