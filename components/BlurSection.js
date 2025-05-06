import { Box } from "@chakra-ui/react";

// Renamed props for clarity: sectionId is the ID of this specific section,
// activeSection is the ID of the currently active section (or null)
const BlurSection = ({ children, sectionId, activeSection }) => {
    // Determine if this section should be active (not blurred)
    const shouldBeActive = activeSection === null || activeSection === sectionId;

    return (
        <Box
            // Apply blur ONLY if some other section is active
            filter={shouldBeActive ? "none" : "blur(2px)"}
            transition="filter 0.3s ease-in-out" // Added easing
            // Allow interaction ONLY if this section should be active
            pointerEvents={shouldBeActive ? "auto" : "none"}
            // Optionally add opacity change for a smoother visual transition
            opacity={shouldBeActive ? 1 : 0.6} // Example: reduce opacity when blurred
            transitionProperty="filter, opacity" // Ensure both transitions apply
        >
            {children}
        </Box>
    );
};

export default BlurSection;