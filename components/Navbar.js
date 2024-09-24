import { Box, Flex, Link, Stack } from "@chakra-ui/react";

const Navbar = ({ setActiveSection }) => (
    <Box as="nav" bg="primary.500" color="white" p={4} textTransform="lowercase" position="fixed" top="0" left="0" right="0" zIndex="sticky">
      <Flex justify="space-between">
        <Link onClick={() => setActiveSection(null)}>home</Link>
        <Flex>
          <Link onClick={() => setActiveSection('about')} mr={4}>about</Link>
          <Link onClick={() => setActiveSection('skills')} mr={4}>skills</Link>
          <Link onClick={() => setActiveSection('experience')} mr={4}>experience</Link>
          <Link onClick={() => setActiveSection('projects')} mr={4}>projects</Link>
          <Link onClick={() => setActiveSection('contact')}>contact</Link>
        </Flex>
      </Flex>
    </Box>
);

export default Navbar;