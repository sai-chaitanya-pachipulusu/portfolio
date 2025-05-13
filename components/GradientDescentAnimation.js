import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Box, Text, VStack, HStack, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormControl, FormLabel, Button, Collapse, IconButton, Flex, Spacer, ButtonGroup, Tooltip } from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Plane, Box as DreiBox, Environment, useHelper, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/router';

// Add different cost function options
const costFunctions = {
  paraboloid: {
    name: "Paraboloid (x² + z²)",
    fn: (x, y) => x * x + y * y,
    gradient: (x, y) => ({ dx: 2 * x, dy: 2 * y }),
    minimum: [0, 0]
  },
  bowl: {
    name: "Bowl (|x| + |z|)",
    fn: (x, y) => Math.abs(x) + Math.abs(y),
    gradient: (x, y) => ({ 
      dx: x === 0 ? 0 : Math.sign(x), 
      dy: y === 0 ? 0 : Math.sign(y) 
    }),
    minimum: [0, 0]
  },
  wave: {
    name: "Wave (x² + sin(z))",
    fn: (x, y) => x * x + Math.sin(y) + 2,
    gradient: (x, y) => ({ dx: 2 * x, dy: Math.cos(y) }),
    minimum: [0, -Math.PI/2]
  }
};

const gridSize = 80; // Number of segments in the grid for the surface
const gridBound = 10; // Grid extends from -gridBound to +gridBound

function CostSurface({ costFn }) {
  const pointsRef = useRef();
  
  useFrame((state) => {
    // Animate points
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
      // Pulse the points
      pointsRef.current.material.size = 0.15 + Math.sin(t * 0.5) * 0.05;
    }
  });

  // Create a denser grid of points for the surface
  const particles = useMemo(() => {
    const points = [];
    const colors = [];
    const density = 50; // Increased point density
    const step = (gridBound * 2) / density;
    
    // Create a grid of points
    for (let i = 0; i <= density; i++) {
      for (let j = 0; j <= density; j++) {
        const x = -gridBound + i * step;
        const z = -gridBound + j * step;
        const y = costFn(x, z) * 0.1; // Calculate height (y) using cost function
        
        // Skip some points near the outer edges for a fading effect
        const distanceFromCenter = Math.sqrt(x * x + z * z);
        if (distanceFromCenter > gridBound * 0.95 && Math.random() > 0.7) continue;
        
        points.push(new THREE.Vector3(x, y, z));
        
        // Color based on height (cost value)
        // Blue at bottom (low cost) to cyan/teal at top (high cost)
        const normalizedHeight = Math.min(1, y / (costFn(gridBound, gridBound) * 0.1));
        const color = new THREE.Color();
        if (normalizedHeight < 0.3) {
          // Blue to cyan
          color.setRGB(0, 0.5 + normalizedHeight * 1.5, 1);
        } else {
          // Cyan to teal/white
          color.setRGB(normalizedHeight * 0.8, 0.9, 1 - normalizedHeight * 0.2);
        }
        colors.push(color.r, color.g, color.b);
      }
    }
    
    return { positions: points, colors: colors };
  }, [costFn]);

  // Create buffer geometry from points with colors
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(particles.positions);
    
    // Add colors to the geometry
    const colorAttribute = new THREE.Float32BufferAttribute(particles.colors, 3);
    geo.setAttribute('color', colorAttribute);
    
    return geo;
  }, [particles]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.1} 
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MovingCube({ position }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
      groupRef.current.rotation.z = t * 0.3;
    }
  });

  // Generate points to form cube corners and edges
  const cubePoints = useMemo(() => {
    const points = [];
    const size = 0.3; // Reduced from 0.5 to make the cube smaller
    
    // Corner points
    const corners = [
      [-size, -size, -size], [size, -size, -size], 
      [-size, size, -size], [size, size, -size],
      [-size, -size, size], [size, -size, size], 
      [-size, size, size], [size, size, size]
    ];
    
    // Add corners
    corners.forEach(corner => {
      points.push(new THREE.Vector3(corner[0], corner[1], corner[2]));
    });
    
    // Add edge points (more detailed)
    const edgeRes = 4; // Points per edge
    for (let i = 0; i < edgeRes; i++) {
      const t = (i + 1) / (edgeRes + 1);
      
      // X edges
      for (let j = 0; j < 4; j++) {
        const start = corners[j*2];
        const end = corners[j*2+1];
        points.push(new THREE.Vector3(
          start[0] + (end[0] - start[0]) * t, 
          start[1], 
          start[2]
        ));
      }
      
      // Y edges
      for (let j = 0; j < 4; j++) {
        const idx = j % 2 + Math.floor(j/2) * 4;
        const start = corners[idx];
        const end = corners[idx+2];
        points.push(new THREE.Vector3(
          start[0], 
          start[1] + (end[1] - start[1]) * t, 
          start[2]
        ));
      }
      
      // Z edges
      for (let j = 0; j < 4; j++) {
        const start = corners[j];
        const end = corners[j+4];
        points.push(new THREE.Vector3(
          start[0], 
          start[1], 
          start[2] + (end[2] - start[2]) * t
        ));
      }
    }
    
    return points;
  }, []);
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(cubePoints);
  }, [cubePoints]);
  
  return (
    <group ref={groupRef} position={position}>
      <points geometry={geometry}>
        <pointsMaterial 
          size={0.08} // Reduced from 0.15 to make points smaller 
          color="#ffcc00" 
          transparent
          opacity={0.9}
          sizeAttenuation={true}
        />
      </points>
      <pointLight color="#ffaa00" intensity={0.8} distance={3} />
      
      {/* Add vertical line to ground for better positioning reference */}
      <line>
        <bufferGeometry 
          attach="geometry" 
          onUpdate={self => {
            const points = [
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, -position.y, 0)
            ];
            self.setFromPoints(points);
          }}
        />
        <lineBasicMaterial color="#ffcc00" transparent opacity={0.3} />
      </line>
    </group>
  );
}

function PathLine({ points }) {
    const lineRef = useRef();
    
    useFrame((state) => {
      if (lineRef.current) {
        // Subtle pulsing effect for the path
        const t = state.clock.getElapsedTime();
        lineRef.current.material.opacity = 0.7 + Math.sin(t * 3) * 0.3;
      }
    });
    
    const geometry = useMemo(() => {
        // Use points directly without remapping axes
        const g = new THREE.BufferGeometry().setFromPoints(points);
        return g;
    }, [points]);

    return (
        <line ref={lineRef} geometry={geometry}>
            <lineBasicMaterial color="#00ff88" linewidth={3} transparent={true} />
        </line>
    );
}

function SceneSetup() {
  const dirLightRef = useRef();
  
  return (
    <>
      <fog attach="fog" args={['#000', 15, 35]} />
      <ambientLight intensity={0.3} />
      <directionalLight
        ref={dirLightRef}
        position={[10, 20, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 10, -5]} intensity={1.5} color="#4466ff" />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ff44aa" />
      <Stars radius={100} depth={50} count={2000} factor={4} fade={true} />
    </>
  );
}

function GridPoints() {
  // Create a grid of dots for reference
  const gridRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gridRef.current) {
      // Subtle pulsing of grid points
      gridRef.current.material.size = 0.08 + Math.sin(t * 0.2) * 0.02;
    }
  });
  
  const gridPoints = useMemo(() => {
    const points = [];
    const count = 20; // Grid density
    const size = gridBound * 2;
    const step = size / count;
    
    for (let i = 0; i <= count; i++) {
      for (let j = 0; j <= count; j++) {
        const x = -gridBound + i * step;
        const z = -gridBound + j * step;
        points.push(new THREE.Vector3(x, 0, z));
      }
    }
    return points;
  }, []);
  
  const gridGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(gridPoints);
  }, [gridPoints]);
  
  return (
    <points ref={gridRef} geometry={gridGeometry}>
      <pointsMaterial 
        size={0.06} 
        color="#666666" 
        transparent
        opacity={0.5}
      />
    </points>
  );
}

// Add backdrop dots for a data visualization effect
function BackdropPoints() {
  const pointsRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.03;
      pointsRef.current.rotation.z = t * 0.02;
    }
  });
  
  const particles = useMemo(() => {
    const points = [];
    const count = 300;
    const radius = 40;
    
    for (let i = 0; i < count; i++) {
      // Create points in a spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = radius * Math.random();
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(particles);
  }, [particles]);
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.2} 
        color="#335577" 
        transparent
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Add visualization for target point
function TargetPoint({ position }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      <pointLight color="#ff0000" intensity={1} distance={5} />
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.7} />
      </mesh>
      <mesh scale={1.2}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ff3333" wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Add vertical line to ground for better reference */}
      <line>
        <bufferGeometry 
          attach="geometry" 
          onUpdate={self => {
            const points = [
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, -position.y, 0)
            ];
            self.setFromPoints(points);
          }}
        />
        <lineBasicMaterial color="#ff0000" transparent opacity={0.3} />
      </line>
    </group>
  );
}

// Add contour lines for better surface understanding
function ContourLines({ visible, costFn }) {
  const linesRef = useRef();
  
  const contourLines = useMemo(() => {
    const lines = [];
    const contourLevels = 8; // Number of contour levels
    const maxHeight = costFn(gridBound, gridBound) * 0.1;
    const contourStep = maxHeight / contourLevels;
    
    // For each contour level
    for (let c = 1; c <= contourLevels; c++) {
      const targetHeight = c * contourStep;
      const segments = 60; // Number of segments per contour
      
      for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / segments) {
        // Find radius where cost function equals targetHeight
        // This simplified approach works well for symmetric functions
        const radius = Math.sqrt(targetHeight / 0.1);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Skip if out of bounds
        if (Math.abs(x) > gridBound || Math.abs(z) > gridBound) continue;
        
        lines.push(new THREE.Vector3(x, targetHeight, z));
      }
    }
    return lines;
  }, [costFn]);
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(contourLines);
  }, [contourLines]);

  if (!visible) return null;
  
  return (
    <points ref={linesRef} geometry={geometry}>
      <pointsMaterial 
        size={0.04} 
        color="#ffffff" 
        transparent
        opacity={0.3}
      />
    </points>
  );
}

// Add markers for previous positions to show path more clearly
function PathMarkers({ points }) {
  const markersRef = useRef();
  
  // Only show a subset of markers for clarity
  const visiblePoints = useMemo(() => {
    const result = [];
    // Show every 5th point, or fewer points if the path is short
    const skipFactor = points.length < 30 ? 2 : 5;
    
    for (let i = 0; i < points.length; i += skipFactor) {
      result.push(points[i]);
    }
    return result;
  }, [points]);
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(visiblePoints);
  }, [visiblePoints]);
  
  return (
    <points ref={markersRef} geometry={geometry}>
      <pointsMaterial 
        size={0.15} 
        color="#00ff88" 
        transparent
        opacity={0.8}
      />
    </points>
  );
}

// Grid with axis labels for better orientation
function EnhancedGrid() {
  const gridRef = useRef();
  
  // Create grid points
  const gridPoints = useMemo(() => {
    const points = [];
    const colors = [];
    const count = 20; // Grid density
    const size = gridBound * 2;
    const step = size / count;
    
    for (let i = 0; i <= count; i++) {
      for (let j = 0; j <= count; j++) {
        const x = -gridBound + i * step;
        const z = -gridBound + j * step;
        // Grid is at y=0 (ground level)
        points.push(new THREE.Vector3(x, 0, z));
        
        // Highlight axis lines with different color
        if (Math.abs(x) < 0.1 || Math.abs(z) < 0.1) {
          colors.push(0.8, 0.8, 0.8); // White for axes
        } else {
          colors.push(0.4, 0.4, 0.4); // Gray for regular grid
        }
      }
    }
    
    return { positions: points, colors: colors };
  }, []);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(gridPoints.positions);
    
    // Add colors
    const colorAttribute = new THREE.Float32BufferAttribute(gridPoints.colors, 3);
    geo.setAttribute('color', colorAttribute);
    
    return geo;
  }, [gridPoints]);
  
  return (
    <points ref={gridRef} geometry={geometry}>
      <pointsMaterial 
        size={0.06} 
        vertexColors
        transparent
        opacity={0.7}
      />
    </points>
  );
}

// Add a gradient vector to show direction at current position
function GradientVector({ position, vector, learningRate }) {
  const arrowRef = useRef();
  
  // Calculate normalized vector direction and scale by learning rate
  const arrowDirection = useMemo(() => {
    const length = Math.sqrt(vector.dx * vector.dx + vector.dy * vector.dy);
    if (length < 0.001) return { x: 0, y: 0, z: 0 };
    
    const scale = 2 * learningRate; // Scale factor to make vector visible
    return {
      x: -vector.dx * scale / length, // Negative because we move against gradient
      y: 0, // No vertical component in standard gradient descent
      z: -vector.dy * scale / length  // Negative because we move against gradient
    };
  }, [vector, learningRate]);
  
  return (
    <group position={position}>
      <arrowHelper 
        ref={arrowRef}
        args={[
          new THREE.Vector3(arrowDirection.x, arrowDirection.y, arrowDirection.z), 
          new THREE.Vector3(0, 0, 0),
          Math.max(0.5, Math.sqrt(arrowDirection.x * arrowDirection.x + arrowDirection.z * arrowDirection.z)),
          0.2,
          "#ffff00",
          0.15
        ]}
      />
    </group>
  );
}

const GradientDescentAnimation = () => {
  const [initialX, setInitialX] = useState(12);
  const [initialY, setInitialY] = useState(12); // This is 'z' in the context of the plane
  const [learningRate, setLearningRate] = useState(0.01);
  const [maxGridRange, setMaxGridRange] = useState(15); // Defines the grid boundary
  
  // Visual customization options
  const [showContourLines, setShowContourLines] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showBackdrop, setShowBackdrop] = useState(true);
  const [showGradientVector, setShowGradientVector] = useState(true);
  const [selectedFunction, setSelectedFunction] = useState("paraboloid");
  
  // Current cost function and gradient based on selection
  const costFunction = useMemo(() => costFunctions[selectedFunction].fn, [selectedFunction]);
  const gradient = useMemo(() => costFunctions[selectedFunction].gradient, [selectedFunction]);
  
  // Get minimum position based on selected function
  const minimumPosition = useMemo(() => {
    const [minX, minZ] = costFunctions[selectedFunction].minimum;
    const minY = costFunction(minX, minZ) * 0.1; // Height from cost function
    return { x: minX, y: minY, z: minZ };
  }, [selectedFunction, costFunction]);
  
  const [currentPos, setCurrentPos] = useState({ 
    x: initialX, 
    y: costFunction(initialX, initialY) * 0.1, 
    z: initialY 
  });
  const [path, setPath] = useState([{ 
    x: initialX, 
    y: costFunction(initialX, initialY) * 0.1, 
    z: initialY 
  }]);
  const [animating, setAnimating] = useState(false);
  
  const animationFrameRef = useRef();
  const [currentSimX, setCurrentSimX] = useState(initialX);
  const [currentSimY, setCurrentSimY] = useState(initialY); // This is sim Y (depth)
  const [currentCost, setCurrentCost] = useState(costFunction(initialX, initialY));

  const router = useRouter();

  // Add state for parameter info toggle
  const [showParamInfo, setShowParamInfo] = useState(false);

  const startAnimation = () => {
    let simX = parseFloat(initialX);
    let simZ = parseFloat(initialY); // This is now Z (depth)
    
    const newPath = []; // Start with an empty path, first point added in stepDescent
    setAnimating(true);

    let iteration = 0;
    const maxIterations = 1000; // Increased from 300 to 1000 to allow more steps with small learning rates

    function stepDescent() {
      if (iteration >= maxIterations) {
        setAnimating(false);
        return;
      }

      // Update current values for display before calculating next step
      const costVal = costFunction(simX, simZ);
      setCurrentSimX(simX);
      setCurrentSimY(simZ); // Now represents Z
      setCurrentCost(costVal);
      
      // Add current point to path for drawing with y as height
      const heightY = costVal * 0.1;
      newPath.push({ x: simX, y: heightY, z: simZ }); 
      setCurrentPos({ x: simX, y: heightY, z: simZ });
      setPath([...newPath]);

      const { dx, dy } = gradient(simX, simZ);
      const nextX = simX - learningRate * dx;
      const nextZ = simZ - learningRate * dy; // Now updating Z
      
      // Calculate gradient magnitude
      const gradientMagnitude = Math.sqrt(dx * dx + dy * dy);
      
      // Modified stopping condition:
      // 1. Gradient is nearly zero (very flat)
      // 2. Very close to known minimum
      // 3. No minimum distance from the target - allow it to get to actual minimum
      //if (gradientMagnitude < 0.001 || 
      //    (Math.abs(simX - minimumPosition.x) < 0.05 && 
      //     Math.abs(simZ - minimumPosition.z) < 0.05)) {
              // Modified stopping condition to ensure the algorithm reaches the minimum
      // Only stop if we're extremely close to the minimum or gradient is essentially zero
      if ((Math.abs(simX - minimumPosition.x) < 0.01 && 
           Math.abs(simZ - minimumPosition.z) < 0.01) || 
          gradientMagnitude < 0.0001) { // Reduced threshold from 0.001 to 0.0001
        setAnimating(false);
        // Final update for display
        const finalCost = costFunction(simX, simZ);
        setCurrentSimX(simX);
        setCurrentSimY(simZ);
        setCurrentCost(finalCost);
        return;
      }

      simX = nextX;
      simZ = nextZ;
      
      iteration++;
      animationFrameRef.current = requestAnimationFrame(stepDescent);
    }
    stepDescent();
  };

  const resetAnimation = () => {
    cancelAnimationFrame(animationFrameRef.current);
    setAnimating(false);
    const newX = parseFloat(initialX);
    const newZ = parseFloat(initialY); // This is now Z
    const newCost = costFunction(newX, newZ);
    const heightY = newCost * 0.1;
    setCurrentPos({ x: newX, y: heightY, z: newZ }); // y is height
    setPath([{ x: newX, y: heightY, z: newZ }]);
    setCurrentSimX(newX);
    setCurrentSimY(newZ);
    setCurrentCost(newCost);
  };
  
  useEffect(() => {
    // Update currentPos and path if initialX or initialY (z) change while not animating
    if (!animating) {
        const newX = parseFloat(initialX);
        const newZ = parseFloat(initialY); // This is now Z
        const newCost = costFunction(newX, newZ);
        const heightY = newCost * 0.1;
        setCurrentPos({ x: newX, y: heightY, z: newZ }); // y is height
        setPath([{ x: newX, y: heightY, z: newZ }]);
        setCurrentSimX(newX);
        setCurrentSimY(newZ);
        setCurrentCost(newCost);
    }
  }, [initialX, initialY, animating, costFunction]);

  // Calculate current gradient vector for visualization
  const currentGradient = useMemo(() => {
    return gradient(currentSimX, currentSimY);
  }, [currentSimX, currentSimY, gradient]);

  return (
    <VStack spacing={4} alignItems="center" color="white" p={0} borderRadius="md" bg="transparent" w="full">
      <Box w="100%" h={{ base: "500px", md: "850px" }} bg="transparent" borderRadius="md" position="relative">
        {/* Navigation buttons */}
        <Box position="absolute" top="10px" left="10px" zIndex="10" display="flex" gap="2">
          <IconButton
            aria-label="Go back"
            icon={<Box>←</Box>}
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={() => router.back()}
            title="Go back to previous page"
          />
          <IconButton
            aria-label="Go home"
            icon={<Box>⌂</Box>}
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={() => router.push('/')}
            title="Go to home page"
          />
        </Box>
        
        <Canvas camera={{ position: [10, 15, 15], fov: 45 }} shadows style={{ background: 'black' }}>
          <SceneSetup />
          {showBackdrop && <BackdropPoints />}
          <CostSurface costFn={costFunction} />
          <ContourLines visible={showContourLines} costFn={costFunction} />
          <MovingCube position={[currentPos.x, currentPos.y, currentPos.z]} />           
          {path.length > 1 && (
            <>
              <PathLine points={path} />
              <PathMarkers points={path} />
            </>
          )}
          {showGradientVector && (
            <GradientVector 
              position={currentPos} 
              vector={currentGradient} 
              learningRate={learningRate} 
            />
          )}
          <TargetPoint position={minimumPosition} />
          {showGrid && <EnhancedGrid />}
          <OrbitControls 
            minDistance={5}
            maxDistance={30}
            enableDamping
            dampingFactor={0.05}
          />
          <Environment preset="night" />
        </Canvas>
      </Box>
      
      {/* Additional visualization legend */}
      <HStack spacing={8} justifyContent="center" w="full" px={4} pt={2} pb={0}>
        <HStack spacing={2}>
          <Box w="10px" h="10px" bg="#00ff88" borderRadius="full" />
          <Text fontSize="xs">Path</Text>
        </HStack>
        <HStack spacing={2}>
          <Box w="10px" h="10px" bg="#ffcc00" borderRadius="full" />
          <Text fontSize="xs">Current Position</Text>
        </HStack>
        <HStack spacing={2}>
          <Box w="10px" h="10px" bg="#ff0000" borderRadius="full" />
          <Text fontSize="xs">Target Minimum</Text>
        </HStack>
        <HStack spacing={2}>
          <Box w="10px" h="10px" bg="#ffff00" borderRadius="full" />
          <Text fontSize="xs">Gradient Direction</Text>
        </HStack>
      </HStack>
      
      {/* Function selection and visual toggles */}
      <HStack spacing={4} justifyContent="center" w="full" flexWrap="wrap">
        <Box>
          <FormControl id="function-select" size="sm">
            <FormLabel fontSize="xs">Function:</FormLabel>
            <select
              value={selectedFunction}
              onChange={(e) => {
                setSelectedFunction(e.target.value);
                resetAnimation(); // Reset when changing function
              }}
              style={{
                background: "rgba(0,0,0,0.3)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "4px",
                padding: "2px 4px",
                fontSize: "11px",
                width: "auto",
                height: "22px"
              }}
            >
              {Object.keys(costFunctions).map(key => (
                <option key={key} value={key}>
                  {costFunctions[key].name}
                </option>
              ))}
            </select>
          </FormControl>
        </Box>
        
        <HStack alignItems="center" spacing={1}>
          <Text>Range:</Text>
          <NumberInput 
            size="xs" 
            value={maxGridRange} 
            onChange={(_, val) => {
              if (val >= 5 && val <= 50) setMaxGridRange(val);
            }}
            min={5} 
            max={50}
            w="60px"
          >
            <NumberInputField padding="0 0.5rem" height="22px" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
        
        <HStack spacing={2}>
          <FormControl display="flex" alignItems="center" size="xs">
            <FormLabel htmlFor="show-contours" mb="0" fontSize="xs" mr={1}>
              Contours
            </FormLabel>
            <input
              id="show-contours"
              type="checkbox"
              checked={showContourLines}
              onChange={() => setShowContourLines(!showContourLines)}
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center" size="xs">
            <FormLabel htmlFor="show-grid" mb="0" fontSize="xs" mr={1}>
              Grid
            </FormLabel>
            <input
              id="show-grid"
              type="checkbox"
              checked={showGrid}
              onChange={() => setShowGrid(!showGrid)}
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center" size="xs">
            <FormLabel htmlFor="show-vector" mb="0" fontSize="xs" mr={1}>
              Vector
            </FormLabel>
            <input
              id="show-vector"
              type="checkbox"
              checked={showGradientVector}
              onChange={() => setShowGradientVector(!showGradientVector)}
            />
          </FormControl>
        </HStack>
      </HStack>
      
      <Flex direction={{ base: "column", md: "row" }} w="full" px={3} pb={1} pt={0} alignItems="center" justify="center">
        <HStack spacing={3} justify="center" mb={{ base: 2, md: 0 }}>
          <FormControl id="x-start" w="auto">
            <FormLabel fontSize="xs" mb={0}>X:</FormLabel>
            <NumberInput size="xs" value={initialX} onChange={(valStr, valNum) => setInitialX(valNum)} min={-maxGridRange} max={maxGridRange} step={0.5} isDisabled={animating} w="90px">
              <NumberInputField height="22px" /> 
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl id="z-start" w="auto"> 
            <FormLabel fontSize="xs" mb={0}>Z:</FormLabel>
            <NumberInput size="xs" value={initialY} onChange={(valStr, valNum) => setInitialY(valNum)} min={-maxGridRange} max={maxGridRange} step={0.5} isDisabled={animating} w="90px">
              <NumberInputField height="22px" /> 
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <FormControl id="learning-rate" w="auto">
            <FormLabel fontSize="xs" mb={0}>Rate:</FormLabel>
            <NumberInput size="xs" value={learningRate} onChange={(valStr, valNum) => setLearningRate(valNum)} min={0.001} max={1} step={0.01} precision={3} isDisabled={animating} w="90px">
              <NumberInputField height="22px" /> 
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </HStack>
        
        <Spacer display={{ base: "none", md: "block" }} />
        
        <HStack justify="center" spacing={4}>
          <Button onClick={startAnimation} disabled={animating} colorScheme="teal" size="xs">Start</Button>
          <Button onClick={resetAnimation} colorScheme="red" size="xs">Reset</Button>
          <Text fontSize="xs" color="cyan.300" display={{ base: "none", md: "block" }}>
            Cost: {currentCost.toFixed(2)}
          </Text>
        </HStack>
      </Flex>
      
      {/* Parameter info toggle */}
      <Box w="full" textAlign="center" mt={0}>
        <Button 
          variant="link" 
          size="xs" 
          onClick={() => setShowParamInfo(!showParamInfo)}
          color="gray.400"
          _hover={{ color: "white" }}
          rightIcon={<Text fontSize="10px">{showParamInfo ? "▲" : "▼"}</Text>}
        >
          {showParamInfo ? "Hide" : "Show"} Variable Ranges & Effects
        </Button>
        
        <Collapse in={showParamInfo} animateOpacity>
          <Box 
            mt={2} 
            fontSize="xs" 
            bg="rgba(0,0,0,0.3)" 
            p={3} 
            borderRadius="md" 
            maxW="800px" 
            mx="auto"
            textAlign="left"
            border="1px solid rgba(255,255,255,0.1)"
          >
            <HStack spacing={4} mb={2} flexWrap="wrap" justifyContent="space-between">
              <VStack align="start" spacing={1} flex="1" minW={{ base: "100%", md: "200px" }}>
                <Text fontWeight="bold" color="cyan.300">X & Z (Start Point)</Text>
                <Text fontSize="10px">±1-5: Quick convergence</Text>
                <Text fontSize="10px">±5-15: Good visualization</Text>
                <Text fontSize="10px">±15-50: Extended paths</Text>
              </VStack>
              
              <VStack align="start" spacing={1} flex="1" minW={{ base: "100%", md: "200px" }}>
                <Text fontWeight="bold" color="cyan.300">Learning Rate</Text>
                <Text fontSize="10px">0.001-0.1: Smooth, many steps</Text>
                <Text fontSize="10px">0.1-0.3: Balanced approach</Text>
                <Text fontSize="10px">0.3-1.0: Risk of overshooting</Text>
              </VStack>
              
              <VStack align="start" spacing={1} flex="1" minW={{ base: "100%", md: "200px" }}>
                <Text fontWeight="bold" color="cyan.300">Functions</Text>
                <Text fontSize="10px">Paraboloid: Smooth bowl, predictable</Text>
                <Text fontSize="10px">Bowl: Diamond shape, sharp edges</Text>
                <Text fontSize="10px">Wave: Multiple local minima</Text>
              </VStack>
            </HStack>
            
            <Text fontSize="10px" fontStyle="italic" mt={1} color="gray.400">
              Try: X=8, Z=8, Rate=0.1 for standard descent | X=5, Z=5, Rate=0.8 for overshooting | X=5, Z=0, Rate=0.1, Wave for local minima
            </Text>
          </Box>
        </Collapse>
      </Box>
      
      <Text fontSize="xs" color="cyan.300" display={{ base: "block", md: "none" }} pb={1}>
        X: {currentSimX.toFixed(2)}, Z: {currentSimY.toFixed(2)}, Cost: {currentCost.toFixed(2)}
      </Text>
    </VStack>
  );
};

export default GradientDescentAnimation; 