import React, { useRef, useEffect } from "react";
import { useAnimate,motion} from "framer-motion";

function Preloader() {
  // const text = "david alaba";
  const text = [
  { letter: "c", id: "d" },
  { letter: "o", id: "a" },
  { letter: "a", id: "v" },
  { letter: "c", id: "i" },
  { letter: "h", id: "d-2" },

  // 👇 SPACE OBJECT
  { letter: " ", id: "space" },

  { letter: "d", id: "a-2" },
  { letter: "a", id: "l" },
  { letter: "v", id: "a-3" },
  { letter: "i", id: "b" },
  { letter: "d", id: "a-4" },
];

  const [scope, animate] = useAnimate();
  const ease = [0.9, 0, 0.1, 1];
useEffect(() => {

  const runAnimation = async () => {
    // guard: make sure scope exists
    if (!scope || !scope.current) return;

    // NodeList -> array
    const letters = Array.from(scope.current.querySelectorAll(".letter"));
    // const letters = scope.current.querySelectorAll(".letter");
    if (!letters.length) return;
console.log(letters)
    // 1) initial state
    letters.forEach((el, index) => {
      el.style.transform = `translateY(${index % 2 === 0 ? "150%" : "-150%"})`;
      el.style.opacity = "0";
    });

    // small delay so browser paints initial state
    await new Promise((r) => setTimeout(r, 40));

    // 2) animate IN (this is scoped to scope.current)
    await animate(
      ".letter",
      { y: "0%", opacity: 1 },
      { duration: 0.8, ease, delay: (i) => i * 0.03 }
    );

    // pause after intro
    await new Promise((r) => setTimeout(r, 4400));

    // 3) fly out middle letters (run them in parallel, awaited)
    const middle = letters.slice(1, -1);
    // Promise.all(
      middle.map((el, i) =>
        animate(
          el,
          { y: i % 2 === 0 ? 200 : -200, opacity: 1 },
          { duration: 0.4, ease, delay: i * 0.04 }
        )
      )
    // );

    // 4) collapse first + last to center
    const first = letters[0];
    const last = letters[letters.length - 1];

    // Remove overflow AFTER we prepared to measure (so we can measure visual boxes)
    first.parentElement.classList.remove("overflow-hidden");
    last.parentElement.classList.remove("overflow-hidden");

    // measure centers
    const vpWidth = window.innerWidth;
    const centerX = vpWidth / 2;

    const rect1 = first.getBoundingClientRect();
    const rect2 = last.getBoundingClientRect();

    const targetX1 = centerX - rect1.left - rect1.width ;
    const targetX2 = centerX - rect2.left;

    // animate first & last to the center simultaneously
    await Promise.all([
      animate(first, { x: targetX1 }, { duration: 0.8, ease,delay:.4 }),
      animate(last, { x: targetX2 }, { duration: 0.8, ease ,delay:.4}),
    ]);
   
    // await animate(scope.current, { y: -320, scale: .5 }, { duration: 0.8, ease });
  };

  runAnimation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
// useEffect(() => {
//   let frame;
//   const handleResize = () => {
//     if (frame) cancelAnimationFrame(frame);
//     frame = requestAnimationFrame(() => {
//       if (!scope?.current) return;
//       const letters = Array.from(scope.current.querySelectorAll(".letter"));
//       const first = letters[0];
//       const last = letters[letters.length - 1];

//       // Reset transforms temporarily to get original bounding
//       first.style.transform = "none";
//       last.style.transform = "none";

//       const vpWidth = window.innerWidth;
//       const centerX = vpWidth / 2;
//       const rect1 = first.getBoundingClientRect();
//       const rect2 = last.getBoundingClientRect();

//       // const targetX1 = centerX - (rect1.left + rect1.width / 2);
//       // const targetX2 = centerX - (rect2.left + rect2.width / 2);
//       const targetX1 = centerX - rect1.left - rect1.width ;
//     const targetX2 = centerX - rect2.left;

//     animate(scope.current, { y: -320, scale: 1 }, { duration: 0.5, ease });
//       animate(first, { x: targetX1 }, { duration: 0, ease });
//       animate(last, { x: targetX2 }, { duration: 0, ease });
//     });
//   };

//   window.addEventListener("resize", handleResize);
//   return () => window.removeEventListener("resize", handleResize);
// }, [scope, animate]);


  return (
    <div className="fixed pointer-events-none w-full h-full mix-blenddifference bg-purple600 !z-preloader-top flex flex-col items-center justify-center">
      <style>{`
        .letter {
          display: inline-block;
          transform: translateY(200%);
          opacity: 0;
           will-change: transform, opacity;
        }
      `}</style>
      <div
        ref={scope}
        className=" -translate-y-1/2 top-[60%] lg:top-[68%] absolute  flex flex-wrap header"
      >
        
          <span  className=" word-wrapper mr-2 flex  bgslate-600">
{text.map(({id,letter},i)=>{
  return (
    
              <span className={` ${i === 4 ? "mr-[2rem]" : ""} overflow-hidden flex bgred-600 uppercas`}>
             <span
              className="letter uppercas leading[1.2] bgred-600 "
              

              >
                   <motion.span
              // initial={{y:-150}} 
              // exit={{y:-1}} 
              
              className="lg:text-[6rem] text-[3.8em] uppercas leading-[1.2] font-custom2 text-white font-bold "
               layoutId={id}
  transition={{
    duration:.2,
    layout: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  }}>
                {letter}
              </motion.span>
             </span>
           
              
              </span>
  )
})}
</span>
      </div>
     

    </div>
  );
}

export default Preloader;










