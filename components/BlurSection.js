import { Box } from "@chakra-ui/react";

const BlurSection = ({ children, isActive }) => (
    <Box
        filter={isActive ? "none" : "blur(2px)"}
        transition="filter 0.3s"
        pointerEvents={isActive ? "auto" : "none"}
    >
        {children}
    </Box>
);

export default BlurSection;