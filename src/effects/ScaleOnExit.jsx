import React, { useEffect } from 'react'
import {motion, useAnimation} from 'framer-motion'
import clsx from 'clsx'
import { customEase1 } from '../../data'

function ScaleOnExit({children,className,preLoaderOut=false}) {
  const controls = useAnimation();
  useEffect(() => {

    if (phase === "revealing") {
        controls.start("enter");
    }

}, [phase]);
     const scaleParentDiv={
         initial:{
          scale:1.30,
             opacity:0.5,
         },
           enter:{
             scale:1,
             opacity:1,
             transition: {
              delay:2,
               duration:2,
              //  ease:"easeOut",
                   ease:customEase1,
            },
          },
          exit:{
             scale:1.30,
             opacity:0.4,
             transition: {
              delay:.3,
               duration:.5,
               ease:"easeInOut",
              //  ease:customEase1,
               scale:{
                delay:0,
                duration:.8 ,
              ease:"easeInOut",
              // ease:customEase1,
             }
            },
          },
        }
  return (
     <motion.div
             className={clsx(`${className} overflow-hidden`)}
             variants={scaleParentDiv} 
               animate={controls}
             initial='initial'
              exit='exit' 
              >
                {children}
              </motion.div>
  )
}

export default ScaleOnExit