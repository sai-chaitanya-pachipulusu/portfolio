import React from "react";
import { useEffect, useRef, useState } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Track mouse movement
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Create particles
    const particlesArray = [];
    const particleCount = 80;
    const baseColors = ['#3182CE', '#00B5D8', '#319795', '#805AD5', '#D53F8C', '#ED64A6', '#48BB78', '#ECC94B'];
    const mouseRadius = 150;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2;
        this.baseSize = this.size;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.color = baseColors[Math.floor(Math.random() * baseColors.length)];
        this.baseColor = this.color;
        this.type = Math.random() > 0.7 ? 'square' : 'circle';
        this.opacity = Math.random() * 0.5 + 0.5;
      }
      
      update(mouseX, mouseY) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
        
        // React to mouse position
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius) {
            // Particles grow and brighten near the mouse
            const ratio = 1 - (distance / mouseRadius);
            this.size = this.baseSize + (ratio * 6);
            
            // Color transition based on mouse proximity
            const hue = Math.floor((ratio * 180) + 180); // Hue from 180-360
            this.opacity = Math.min(1, this.opacity + (ratio * 0.5));
            this.color = `hsl(${hue}, 100%, 70%)`;
            
            // Add slight movement away from cursor
            const angle = Math.atan2(dy, dx);
            const pushFactor = 0.2 * ratio;
            this.x += Math.cos(angle) * pushFactor;
            this.y += Math.sin(angle) * pushFactor;
          } else {
            // Return to original size and color when away from mouse
            this.size = this.baseSize;
            this.color = this.baseColor;
            this.opacity = Math.max(0.5, this.opacity - 0.01);
          }
        }
      }
      
      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        if (this.type === 'square') {
          ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }
    
    const init = () => {
      // Clear any existing particles
      particlesArray.length = 0;
      
      // Create new particles
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    const drawLines = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Draw lines between nodes that are close to each other
          if (distance < 180) {
            ctx.lineWidth = 0.5 * (1 - distance / 180);
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    let animationFrame;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fill background with black
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(mousePosition.x, mousePosition.y);
        particlesArray[i].draw();
      }
      
      // Draw connecting lines
      drawLines();
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default ParticleBackground;