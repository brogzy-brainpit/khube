import React, { useRef } from 'react'
import {motion} from 'framer-motion'

function PageTransition() {
    const svgRef=useRef(null)
          const columns={
      initial:{}
  ,
       enter:{
        transition: {
          // duration:1.2,
          // delayChildren:2, // 👈 wait before starting
          staggerChildren:.035,  
              // 👈 delay between items
        },
      },
      exit:{
         transition: {
          staggerDirection:-1,
          // delayChildren:0.7, // 👈 wait before starting
          staggerChildren:.035,  
          // staggerChildren:0.1,  
        },
      },
    }
   
    const oneColumn={
      initial:(i)=>({
        scaleX: 1,
        transformOrigin:'right',
  
      }),
       enter:(i)=>({
        // y:0,
        // opacity:1,
        // clipPath:'inset(0 0 0 0)',
            scaleX: 0,
            transformOrigin:'right',
            transition:{
              duration:.6
            }
      }),
      exit:(i)=>({
             scaleX: 1,
             transformOrigin:'right',
             transition:{
              duration:.4
            }
      }),
    }
    const as=[1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]
  return (
    <div className='fixed top left-0 w-full h-full bg-purple600 z-preloader pointer-events-none'>
       <motion.div className='flex gap-0 w-full h-full' ref={svgRef}
        variants={columns} initial='initial' exit='exit' animate={'enter'}>
   {as.map((_, index) => {
    return (
      <motion.div key={index} className='w-[10%] bg-white h-full origin-righ ' variants={oneColumn}>
        {/* dd */}
      </motion.div>
    )
   })}
</motion.div>
     </div>
  )
}

export default PageTransition