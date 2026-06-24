import React, { useState, useLayoutEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const ScrambleText = ({
  className,
  hoverClass,
  addWidth=true,
  once=true,
  hoverEffect = false,
  delay = 0,
  duration = 1,
  text = "scramble component",
  margin = "0px",
  letters = "+ - + - + - + - + - + + - + - + - + - + - + + - + - + - + - + - +",
}) => {
  const [displayText, setDisplayText] = useState(text);

  const ref = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const isInView = useInView(ref, { once, margin });

  const runScramble = () => {
    clearInterval(intervalRef.current);

    let iteration = 0;
    let letterIndex = 0;

    const totalSteps = text.length * 2;
    const intervalDuration = (duration * 1000) / totalSteps;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, idx) =>
            idx < iteration
              ? text[idx]
              : letters[(letterIndex + idx) % letters.length]
              
          )
          .join("")
      );

      iteration += 1 / 2;
      letterIndex++;

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, intervalDuration);
  };

  useLayoutEffect(() => {
    if (isInView) {
      timeoutRef.current = setTimeout(() => {
        runScramble();
      }, delay*1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [isInView, text, delay, duration]);

  return (
    <motion.span
      ref={ref}
      style={{ width: addWidth?`${text.length * 1.2}ch`:`${text.length}ch` }}
      className={`
        ${className}
        ${hoverEffect ? hoverClass : ""}
        [word-spacing:3px]
        text-left
        whitespace-nowrap
        inline-block
        tracking-tight
        scramble-text
        overflow-hidden
      `}
      initial={{ opacity: 0, y: 0 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.2,delay, ease: "linear" }}
      onMouseEnter={
        hoverEffect
          ? () => {
              runScramble();
            }
          : undefined
      }
    >
      {displayText}
    </motion.span>
  );
};

export default ScrambleText;