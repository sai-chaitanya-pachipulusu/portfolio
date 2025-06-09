import { useState, useEffect } from 'react';
import { Box, Container, Image, Heading, Text } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Chat from "../components/Chat";
import BlurSection from "../components/BlurSection";
import ConstellationBackground from '../components/ConstellationBackground';
import AnimatedSection from '../components/AnimatedSection';

export default function Home() {
    // Initialize activeSection to null for default unblurred state
    const [activeSection, setActiveSection] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Scroll handler for Navbar
    const scrollToSection = (sectionId, shouldSetActive = true) => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (shouldSetActive) {
          setActiveSection(sectionId.replace('-section', '')); // Update active section state
        } else {
          setActiveSection(null); // Explicitly set to null to unblur all
        }
      }
    };

    if (!isClient) {
        // Render nothing or a loading spinner server-side
        return null; 
    }
    
    return (
      <Box>
          <ConstellationBackground />
          <Container maxW="container.lg" py={10} px={6} position="relative" zIndex={1}>
              {/* Remove profile Box as it's not requested and might interfere */}
              {/* <Box textAlign="center" mb={6}>
                  <Image
                      borderRadius="full"
                      boxSize={["100px", "120px", "150px"]}
                      src="/images/scp.jpeg"
                      alt="Profile"
                      mx="auto"
                  />
                  <Heading size="lg" mt={2} mb={2} color="white">Sai Chaitanya Pachipulusu</Heading>
                  <Text textTransform="lowercase" color="white"> mle | software engineer | ai | rl</Text>
              </Box> */}
              
              <Navbar setActiveSection={setActiveSection} scrollToSection={scrollToSection} />
              
              {/* Use Box with pt to account for sticky navbar height, adjust value as needed */}
              <Box pt="80px"> 
                <AnimatedSection delay={0.1}>
                  <Box id="about-section" mb={12}> {/* Added ID and margin */} 
                    <BlurSection sectionId="about" activeSection={activeSection}>
                      <About />
                    </BlurSection>
                  </Box>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                  <Box id="skills-section" mb={12}> {/* Added ID and margin */}
                    <BlurSection sectionId="skills" activeSection={activeSection}>
                      <Skills />
                    </BlurSection>
                  </Box>
                </AnimatedSection>

                <AnimatedSection delay={0.3}>
                  <Box id="experience-section" mb={12}> {/* Added ID and margin */}
                    <BlurSection sectionId="experience" activeSection={activeSection}>
                      <Experience />
                    </BlurSection>
                  </Box>
                </AnimatedSection>

                <AnimatedSection delay={0.4}>
                  <Box id="projects-section" mb={12}> {/* Added ID and margin */}
                    <BlurSection sectionId="projects" activeSection={activeSection}>
                      <Projects />
                    </BlurSection>
                  </Box>
                </AnimatedSection>

                <AnimatedSection delay={0.5}>
                  <Box id="contact-section" mb={12}> {/* Added margin back */} 
                    <BlurSection sectionId="contact" activeSection={activeSection}>
                      <Contact />
                    </BlurSection>
                  </Box>
                </AnimatedSection>
              </Box>
              
              <AnimatedSection delay={0.6}>
                <Footer />
              </AnimatedSection>
          </Container>
          
          {/* Only the Chat component remains */}
          <Chat /> 
      </Box>
    );
  }