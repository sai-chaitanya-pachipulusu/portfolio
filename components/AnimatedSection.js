import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';

const AnimatedSection = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start invisible and slightly down
      whileInView={{ opacity: 1, y: 0 }} // Animate to visible and original position
      viewport={{ once: true, amount: 0.2 }} // Trigger once when 20% is visible
      transition={{ 
          duration: 0.5, // Animation duration
          delay: delay, // Optional delay
          ease: "easeOut" // Animation easing
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection; 