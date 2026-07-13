import React, { useEffect } from "react";
import Lenis from "lenis";

export let lenis = null;

function SmoothScroll({ children }) {
  useEffect(() => {
    lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;