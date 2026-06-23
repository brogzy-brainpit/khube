
import React, { useState, useLayoutEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const ScrambleText = ({className,scrambleSpeed=42,hoverClass, hoverEffect=false,text='scramble component',letters = '+ - + - + - + - + - + + - + - + - + - + - + + - + - + - + - + - +' }) => {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false});
  const intervalRef = useRef(null);

const runScramble = () => {
    clearInterval(intervalRef.current);
  
    let iteration = 0;
    let letterIndex = 0; // pointer for cycling through letters
  
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, idx) =>
            idx < iteration
              ? text[idx]
              : letters[(letterIndex + idx) % letters.length] // ordered scramble
          )
          .join("")
      );
  
      // iteration += 1 ;
      iteration += 1 / 2;
      letterIndex++; // move forward through scramble source
  
      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, scrambleSpeed); // adjust speed here
  };
  
  
  

  // Run on viewport enter
  useLayoutEffect(() => {
    if (isInView ) {
      runScramble();
    }
    // Clean up interval on unmount
    return () => clearInterval(intervalRef.current);
  }, [isInView, text,scrambleSpeed]);

  return (
 <motion.span
    className={`${className} ${hoverEffect?hoverClass:null} [word-spacing:3px] cursor-pointe flex-nowrap  inline-block tracking-tight scramble-text overflow-hidden`} 
      ref={ref}
      initial={{ opacity: 0, y: 0 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onMouseEnter={hoverEffect?() => {
        runScramble();
      }:()=>{return;}}
      whileHover={hoverEffect?{ scale: 1.05, color: "#121212" }:""}
    >
      {displayText}
    </motion.span>
  );
};

export default ScrambleText;
