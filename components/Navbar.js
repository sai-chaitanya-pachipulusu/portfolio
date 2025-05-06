import {
    Box,
    Flex,
    HStack,
    Link as ChakraLink, // Rename to avoid conflict
    IconButton,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Text
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

// Custom NavLink component for consistent styling and scroll behavior
const NavLink = ({ children, onClick, ...props }) => (
    <ChakraLink
        px={3}
        py={1} // Slightly reduced vertical padding for a more compact look
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: 'rgba(255, 255, 255, 0.1)', // Lighter, subtle hover background
        }}
        onClick={onClick}
        cursor="pointer"
        color="white" // Ensure text is white
        fontSize="sm" // Match reference style closer
        {...props}
    >
        {children}
    </ChakraLink>
);

// Sections for the navbar
const Links = [
    { name: 'About', id: 'about-section' },
    { name: 'Skills', id: 'skills-section' },
    { name: 'Experience', id: 'experience-section' },
    { name: 'Projects', id: 'projects-section' },
    { name: 'Contact', id: 'contact-section' },
];

export default function Navbar({ setActiveSection, scrollToSection }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const backdropBlur = '10px'; // Blur effect

    return (
        <Box
            as="nav" // Added as nav for semantics
            bg="rgba(10, 10, 10, 0.8)"
            backdropFilter={`blur(${backdropBlur})`}
            px={4} // Adjusted padding
            py={2} // Adjusted padding
            position="sticky" // Changed to sticky
            width="full" // Takes full width for sticky positioning
            top={4} // Add space from top when sticky
            zIndex={10}
            // Apply maxW and centering here for the container effect
            maxW="container.md" // Use md for a more compact look like reference
            mx="auto"
            borderRadius="lg" // Added rounded corners
            boxShadow="md" // Slightly stronger shadow
        >
            {/* Removed mx and maxW from Flex, it's handled by the parent Box now */}
            <Flex h={12} alignItems={'center'} justifyContent={'space-between'}>
                {/* Hamburger Menu (Mobile) - Placed first for mobile layout */}
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon color="white" /> : <HamburgerIcon color="white" />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                    variant="ghost"
                    _hover={{ bg: 'transparent' }}
                    color="white"
                />

                {/* Left Side: Name Link (Desktop) */}
                <Box display={{ base: 'none', md: 'block' }}>
                   <NavLink onClick={() => scrollToSection('about-section', false)} fontWeight="bold">Sai Chaitanya Pachipulusu</NavLink>
                </Box>

                {/* Right Side: Navigation Links (Desktop) */}
                <HStack
                    as={'nav'}
                    spacing={4} // Adjusted spacing
                    display={{ base: 'none', md: 'flex' }}
                >
                    {Links.map((link) => (
                        <NavLink
                            key={link.id}
                            onClick={() => {
                                scrollToSection(link.id);
                            }}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </HStack>

                 {/* Removed the redundant Box for centering name on mobile */}

                 {/* The space-between on the parent Flex handles desktop layout */}

            </Flex>

            {/* Mobile Menu Links Dropdown */}
            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }} mt={2}>
                    <Stack as={'nav'} spacing={4}>
                         {/* Added Name link to top of mobile menu */}
                         <NavLink
                            onClick={() => {
                                scrollToSection('about-section', false);
                                onClose(); // Close menu after clicking
                            }}
                            fontWeight="bold"
                         >
                            Sai Chaitanya Pachipulusu
                         </NavLink>
                        {Links.map((link) => (
                            <NavLink
                                key={link.id}
                                onClick={() => {
                                    scrollToSection(link.id);
                                    onClose(); // Close menu after clicking
                                }}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
}