import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';

const ExperimentaaalHubPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define nodes - ML at center bottom, Gradient Descent above
  const nodes = [
    { id: 'ML', label: 'ML', x: 50, y: 70, color: 'white' },
    { id: 'GradientDescent', label: 'Gradient Descent', x: 50, y: 30, color: 'white' }
  ];

  // Calculate control points for a curved path from ML to GradientDescent
  const path = {
    from: nodes[0],
    to: nodes[1],
    // Control point for curve - adjust for desired curve shape
    cpx: 50, // Same x as both nodes for a vertical symmetric curve
    cpy: 50  // Midpoint y
  };

  const handleNodeClick = (nodeId) => {
    if (nodeId === 'GradientDescent') {
      router.push('/experimentaaal/gradient-descent');
    }
  };

  if (!isClient) {
    return <Box minH="100vh" bg="black" />;
  }

  // Calculate actual pixel size relative to SVG viewBox - 14px on a typical screen
  const convertToSvgFontSize = (pixelSize) => {
    // This approximates 14px on a 1080p screen with our 100x100 viewBox
    // 14px / (1080px / 100) ≈ 1.3
    return pixelSize / 10;
  };

  const fontSize = convertToSvgFontSize(14);

  return (
    <Box 
      minH="100vh" 
      bg="black" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      position="relative" 
      overflow="hidden"
    >
      {/* Back button */}
      <Tooltip label="Back to Home" placement="right">
        <IconButton
          icon={<FaArrowLeft />}
          aria-label="Back to home"
          position="fixed"
          top="20px"
          left="20px"
          zIndex={10}
          onClick={() => router.push('/')}
          colorScheme="teal"
          size="md"
          variant="ghost"
          borderRadius="full"
        />
      </Tooltip>
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', left: 0, top: 0 }}
      >
        {/* Curved path connecting ML to Gradient Descent */}
        <path 
          d={`M ${path.from.x} ${path.from.y} Q ${path.cpx} ${path.cpy} ${path.to.x} ${path.to.y}`}
          stroke="rgba(255, 255, 255, 0.3)" 
          strokeWidth="0.3"
          fill="none"
        />

        {/* Moving particle on the curved path */}
        <circle r="0.4" fill="rgba(150, 220, 255, 0.75)">
          <animateMotion
            path={`M ${path.from.x} ${path.from.y} Q ${path.cpx} ${path.cpy} ${path.to.x} ${path.to.y}`}
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Node texts */}
        {nodes.map((node) => (
          <g key={node.id}>
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={hoveredNode === node.id ? 'cyan' : node.color}
              fontSize={fontSize}
              fontWeight="normal" // Changed from bold to normal for a more subtle look
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node.id)}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </Box>
  );
};

export default ExperimentaaalHubPage; 