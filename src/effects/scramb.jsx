import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
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
  // const [displayText, setDisplayText] = useState(text);
  const [displayText, setDisplayText] = useState(text);

  const ref = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const runId = useRef(0);

  const isInView = useInView(ref, { once, margin });

  const chars = useRef(text.split("")).current;

  // reset on text change
  useEffect(() => {
    runId.current += 1;
    setDisplayText(text);
  }, [text]);

  const runScramble = () => {
    runId.current += 1;
    const currentId = runId.current;

    cancelAnimationFrame(rafRef.current);

    let start = null;

    const animate = (timestamp) => {
      if (currentId !== runId.current) return;

      if (!start) start = timestamp;

      const progress = Math.min(
        (timestamp - start) / (duration * 1000),
        1
      );

      const revealedCount = Math.floor(progress * text.length);

      setDisplayText(
        chars
          .map((_, idx) =>
            idx < revealedCount
              ? text[idx]
              : letters[(idx + Math.floor(timestamp / 30)) % letters.length]
          )
          .join("")
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  useLayoutEffect(() => {
    if (isInView) {
      timeoutRef.current = setTimeout(runScramble, delay * 1000);
    }

    return () => {
      runId.current += 1;
      clearTimeout(timeoutRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isInView, delay, duration, text]);
  return (
 <span className={`${className} relative inline-block`}>
      
      {/* 🔒 LOCK LAYOUT (ghost text reserves space) */}
      <span className="invisible text-orange-400 tracking-tight whitespace-pre-wrap break-words">
        {text}
      </span>

    <motion.span
      ref={ref}
      className={`
          absolute top-0 left-0
       
        ${hoverEffect ? hoverClass : ""}
        scramble-text
        text-left
        whitespace-pre-wrap
        inline-block
        tracking-tight
        break-words
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
      </span>

  );
};

export default ScrambleText;