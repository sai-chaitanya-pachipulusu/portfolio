import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim'; // loads tsparticles-slim

const ConstellationBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadSlim(engine);
  }, []);

//   const particlesLoaded = useCallback(async (container) => {
//     await console.log(container);
//   }, []);

  const options = {
    background: {
      color: "#000000", // Changed to pure black
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab", // Change mode for interaction: grab, bubble, repulse
        },
        // onClick: { enable: true, mode: "push" }, // Optional: push particles on click
      },
      modes: {
        grab: {
            distance: 150, // Increase distance for grab effect
            links: { // Use links instead of link_lines
               opacity: 0.3,
               color: "#ffffff" // Faint white lines
            }
         },
        bubble: {
          distance: 200,
          size: 40,
          duration: 2,
          opacity: 0.8,
        },
        repulse: {
            distance: 100
        },
        push: {
            quantity: 4 // Use quantity instead of particles_nb
        }
      },
    },
    particles: {
      color: {
        value: "#ffffff", // White particles
      },
      links: { // Corrected property name: links, not link
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.15, // Very faint lines
        width: 1,
      },
       collisions: { // Optional: prevent overlap
           enable: true,
       },
      move: {
        direction: "none",
        enable: true,
        outModes: { // Use outModes instead of out_mode
           default: "bounce" // Keep particles within bounds
        },
        random: true, // More random movement
        speed: 0.5, // Slow movement
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 1200, // Adjust area to control density (higher means sparser)
        },
        value: 50, // Reduced number of particles
      },
      opacity: {
        value: {min: 0.1, max: 0.5}, // Varying opacity
         animation: { // Optional: fading effect
             enable: true,
             speed: 1,
             minimumValue: 0.1, // Use minimumValue instead of opacity_min
             sync: false
         }
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 }, // Small particles
        animation: { // Optional: pulsing effect
             enable: true,
             speed: 2,
             minimumValue: 0.5, // Use minimumValue instead of size_min
             sync: false
         }
      },
    },
    detectRetina: true,
  };

  return (
      <Particles
        id="tsparticles"
        init={particlesInit}
        //loaded={particlesLoaded} // Optional loaded callback
        options={options}
        style={{
            position: 'fixed', // Ensure it covers the whole viewport
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1 // Place it behind all other content
        }}
      />
  );
};

export default ConstellationBackground; 