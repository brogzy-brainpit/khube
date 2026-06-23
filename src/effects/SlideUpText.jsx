import { useInView,motion } from 'framer-motion'
import React, { useRef } from 'react'

function SlideUpText({children,text,once=true,margin='0px',fontSize,initialDelay=0,delay=0.02,center=false,gap='10px',y="0%",className,preLoaderOut=true}) {
    const textRef3= useRef(null)
    const inView= useInView(textRef3,{once,margin})
    const parent={
      enter:{
        transition:{
          staggerChildren:delay,
          delayChildren:initialDelay
        }
      },
      //  initial:{
      //   transition:{
      //     staggerChildren:delay,
      //     delayChildren:initialDelay,
      //   }
      // }
    }
       const word={
      enter:{
        transition:{
          staggerChildren:0.03,
        }
      }
    }
  const slideUp = {
initial: { y: '100%' }, // px instead of "%"
enter: (index) => ({
  y: '0%',
  transition: {
    type: "spring",
    // stiffness: 120,
    // damping: 15,
    // mass:0.5
    stiffness: 120,
    damping: 14,
    mass:0.1
  },
}),
exit: { y: '100%' },
};


  return (
    <motion.p variants={parent} initial='initial' exit='initial' animate={inView && preLoaderOut ? "enter" : "initial"} ref={textRef3} style={{columnGap:gap}} className={` text-balance t-center flex-wrap m-0 flex ${center?'justify-center':''}  items-center`}>
        {text.split(" ").map((word,index)=>{
    return (
      <motion.span className='inline-block overflow-hidden' key={index} >
    {[...word].map((char,i)=>{
      return (
        <motion.span custom={i} className='inline-block'   variants={slideUp} key={i}>
          {char}
          </motion.span>
      )
    })}
{/* &nbsp; */}
  </motion.span>
    )
 })}
    </motion.p>
  )
}



export default SlideUpText