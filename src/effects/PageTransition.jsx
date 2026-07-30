import React, { useRef } from 'react'
import {motion} from 'framer-motion'
import LogoIntro from '@/components/LogoIntro'

function PageTransition({title}) {
    const svgRef=useRef(null)
          const columns={
      initial:{}
  ,
       enter:{
        transition: {
          // duration:1.2,
          delayChildren:2, // 👈 wait before starting
          staggerChildren:.035,  
              // 👈 delay between items
        },
      },
      exit:{
         transition: {
          staggerDirection:-1,
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
            scaleX: 0,
            transformOrigin:'right',
            transition:{
              duration:.28,
            }
      }),
      exit:(i)=>({
             scaleX: 1,
             transformOrigin:'right',
             transition:{
              duration:.28
            }
      }),
    }
    const as=[1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]
  return (
    <div className='fixed top left-0 w-full h-full bg-purple600 z-[9998] pointer-events-none'>
       <motion.div 
            className="w-full h-full bgred-500 flex items-center justify-center absolute left-0 top-0">
            <div className='relative   flex items-center justify-center h-full w-full'>
        <motion.h2 className='flex gap-3 capitalize text-brand-white  font-custom text-heading2  items-center justify-center'
        animate={{
          opacity:[0,1,1,0],
          y:[20,0,0,-20]
        }}
        initial={{y:20,opacity:0}}
        transition={{
          duration:1.6,
          times:[.02,.2,.9,1]
        }}
        >
        <span className='w-5 h-5 bg-brand-white  rounded-full'>&nbsp;</span>
      {title} 
        <span className='w-5 h-5 bg-brand-white  rounded-full'>&nbsp;</span>
        
     
       </motion.h2>
       {/* {preLoaderOut &&
       } */}
         {/* <SlideUpText   text= {getTitle(pageName)} preLoaderOut={preLoaderOut}/> */}
        </div>
            {/* <LogoIntro  width={300} height={60}/> */}
            </motion.div>
       <motion.div className='flex gap-0 w-full h-full' ref={svgRef}
        variants={columns} initial='initial' exit='exit' animate={'enter'}>
   {as.map((_, index) => {
    return (
      <motion.div key={index} className='w-[10%] bg-brand-black h-full origin-righ ' variants={oneColumn}>
        {/* dd */}
      </motion.div>
    )
   })}
</motion.div>
     </div>
  )
}

export default PageTransition