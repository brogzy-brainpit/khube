import React, { useEffect } from 'react'
import {motion, useAnimation} from 'framer-motion'
import clsx from 'clsx'
import { customEase2 } from '../../data'

function ScaleOnExit({children,className,preLoaderOut=false,transitionKey}) {
  const controls = useAnimation();
useEffect(() => {
  controls.set("initial");
  controls.start("enter");
  //   controls.start("enter", {
  //   delay: transitionKey === 0 ? 3.8 : 2.2,
  //   duration: 2,
  //   ease: customEase2,
  // });
}, [transitionKey, controls]);

     const scaleParentDiv={
         initial:{
          scale:1.20,
             opacity:0.70,
         },
           enter:{
             scale:1,
             opacity:1,
             transition: {
              delay:transitionKey === 0 ? 3.85 : 2.25, // same duration as your preloader
               duration:2.6,
               ease:customEase2,
            },
          },
          exit:{
             scale:1.20,
             opacity:0,
             transition: {
               duration:2.6,
               ease:customEase2,
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