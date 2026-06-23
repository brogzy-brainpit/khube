"use client";
import React, { useEffect } from "react";
import Lenis from "lenis";


function SmoothScroll({ children }) {
  useEffect(() => {
    
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
   
    };
  }, []);

  return <div className="scroll-container">{children}</div>;
}

export default SmoothScroll;
