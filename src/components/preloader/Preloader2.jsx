import React from "react";
import { motion } from "framer-motion";

function Preloader2() {
  // [0.76, 0, 0.24, 1]
  const ease=[0.9, 0, 0.1, 1];
  const text= 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur sed eos maiores facilis provident? Lorem ipsum dolor.'
  const slideUpParent = {
    initial: {},
    enter: {
      transition: {
        staggerChildren: 0.01,
        delayChildren: 0.4,

      },
    },
    exit: {
      transition: {
        staggerChildren: 0.01,
      },
    },
  };
   const slideUp = {
    initial: { y: 30,opacity:0 },
    enter: { y: 0,opacity:1,
       transition:{
        duration:0.8,
        ease,
      }},
    exit: { y: 30,opacity:0 ,
       transition:{
        duration:0.4,
      
        ease,
      }},
  };
   const ParentImg = {
    initial: {
      clipPath: 'inset(0 0 0 0)'
 },
    enter: {
      clipPath: 'inset(0 0 0 0)',
      transition: {
        staggerChildren: 0.9,
        delayChildren: 0.4,
      },
    },
    exit:{
       clipPath: 'inset(0 0 100% 0)',
        transition:{
        duration:0.8,
        ease,
      }
       },
  };

  const Img = {
    initial: {
       clipPath: 'inset(100% 0 0 0)',
       scale:2
       },
    enter: {
      clipPath: 'inset(0 0 0 0)',
      scale:1,
      transition:{
        duration:0.8,
        ease,
      }
 },
 exit: {
      clipPath: 'inset(0 0 0 0)',
      scale:2,
       transition:{
        duration:0.8,
        ease,
      }
 },
  };
  const wrapper={
    initial:{},
    initial:{},
    exit:{
        clipPath: 'inset(0 0 100% 0)',
      // scale:2,
       transition:{
        delay:0.5,
        duration:1.8,
        ease,
      }
    },
  }
  const [out,setOut]=React.useState(false)
// const imgs=["/images/service01.png",
//   "/images/service02.png",
//   "/images/service03.png",
//   "/images/service04.png",
//   "/images/service05.png"
// ]
const imgs=[
  "/images/red1.jpg",
  "/images/red2.jpg",
  "/images/red3.jpg",
  "/images/red8.jpg",
  "/images/red5.jpg"
]
  return (
    <motion.div variants={wrapper} initial='initial' animate='enter' exit='exit' className=" fixed  top-0 left-0 w-full h-full bg-neutral-800 z-preloader flex flex-col items-center justify-center">
     <motion.div initial={{scaleX:0,transformOrigin:'right'}} animate={{scaleX:out?0:1,transformOrigin:out?'right':'left'}} onAnimationComplete={()=>{setOut(true)}} transition={{duration:3,delay:.2,ease:'easeOut'}} className='bg-white h-[.5em] w-full absolute top-0 left-0'>

     </motion.div>
      <motion.div 
      variants={ParentImg}
  initial="initial"
  exit="exit"
  animate="enter"
      className=" absolute top-[45%] left-[50%] -translate-y-1/2 -translate-x-1/2 bg-red600 w-[24em] h-[25em]">
       {imgs.map((url, i)=>{
        return (
           <motion.div key={i} variants={Img} className='absolute w-full h-full'>
          <motion.img 
            src={url}
            className=" w-full object-cover h-full absolute"
          />
        </motion.div>
        )
       })}
      </motion.div>

      <motion.div
  variants={slideUpParent}
  initial="initial"
  exit="exit"
  animate="enter"
  className="mx-auto flex flex-wrap text-balance max-w-[94%] lg:max-w-[38em] justify-center absolute bottom-[1em] lg:bottom-[1em] -translate-y-[50%]"
>
  {
    text.split(" ").map((word, index) => (
      <span key={index} className="overflow-hidden mr-2 inline-block">
        <motion.span
          variants={slideUp}
          className="inline-block text-white text-para leading-[.9] font-body"
        >
          {word}
        </motion.span>
      </span>
    ))
  }
</motion.div>

    </motion.div>
  );
}

export default Preloader2;
