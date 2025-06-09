import { Button, Icon, Tooltip } from '@chakra-ui/react';
import { FaDownload } from 'react-icons/fa';

const FloatingResumeButton = () => {
  return (
    <Tooltip 
      label="Download Resume" 
      placement="left" 
      hasArrow
      bg="gray.800"
      color="white"
    >
      <Button
        as="a"
        href="/resume.pdf"
        download="Sai_Chaitanya_Pachipulusu_Resume.pdf"
        position="fixed"
        top="50%"
        right="20px"
        transform="translateY(-50%)"
        zIndex={999}
        size="lg"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        borderRadius="full"
        width="60px"
        height="60px"
        minW="60px"
        _hover={{
          transform: 'translateY(-50%) scale(1.1)',
          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
        }}
        _active={{
          transform: 'translateY(-50%) scale(0.95)',
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        boxShadow="0 8px 32px rgba(102, 126, 234, 0.4)"
      >
        <Icon as={FaDownload} boxSize={5} />
      </Button>
    </Tooltip>
  );
};

export default FloatingResumeButton; 