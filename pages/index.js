import { useState } from 'react';
import { Box, VStack, Container, Image, Heading, Text } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import BlurSection from "../components/BlurSection";
//import NextLink from 'next/link';
import Link from 'next/link';

function ErrorFallback({error}) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
      </div>
    )
  }

/*
export default function Home() {
  return (
    <Container maxW="container.md" py={10}>
        <VStack spacing={10} align="stretch">
          <Box textAlign="center">
            <Image
              borderRadius="full"
              boxSize="150px"
              src="/path-to-your-image.jpg"
              alt="Profile"
              mx="auto"
            />
            <Heading mt={4}>Sai Chaitanya Pachipulusu</Heading>
            <Text> software engineer | ai | ml | rl</Text>
          </Box>
          <Navbar />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
          <Footer />
        </VStack>
    </Container>

  );
}
*/

export default function Home() {
    const [activeSection, setActiveSection] = useState(null);

    return (
        <Container maxW="container.md" py={10}>
            <VStack spacing={10} align="stretch">
                    <Box textAlign="center">
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src="/images/MLpic.jpg" //C:/Users/siaic/Downloads/MLpic.jpg
                            alt="Profile"
                            mx="auto"
                        />
                        <Heading mt={2} mb={2}>Sai Chaitanya Pachipulusu</Heading>
                        <Text textTransform="lowercase"> ml | software engineer | ai | rl</Text>
                    </Box>
                    
                    <Navbar setActiveSection={setActiveSection} />
                    <BlurSection isActive={activeSection === 'about' || activeSection === null}>
                        <About />
                    </BlurSection>
                    <BlurSection isActive={activeSection === 'skills' || activeSection === null}>
                        <Skills />
                    </BlurSection>
                    <BlurSection isActive={activeSection === 'experience' || activeSection === null}>
                        <Experience />
                    </BlurSection>
                    <BlurSection isActive={activeSection === 'projects' || activeSection === null}>
                        <Projects />
                    </BlurSection>
                    <BlurSection isActive={activeSection === 'contact' || activeSection === null}>
                        <Contact />
                    </BlurSection>
                    <Footer />
                </VStack>
            </Container>
    );
}

/*
export default function Home() {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center" bg="black">
        <VStack spacing={4}>
          <Heading color="white" mb={6}>Sai Chaitanya Pachipulusu</Heading>
          <Link href="/about" passHref>
            <Box as="a" color="white">About</Box>
          </Link>
          <Link href="/skills" passHref>
            <Box as="a" color="white">Skills</Box>
          </Link>
          <Link href="/experience" passHref>
            <Box as="a" color="white">Experience</Box>
          </Link>
          <Link href="/projects" passHref>
            <Box as="a" color="white">Projects</Box>
          </Link>
          <Link href="/contact" passHref>
            <Box as="a" color="white">Contact</Box>
          </Link>
        </VStack>
      </Box>
    );
  }
*/