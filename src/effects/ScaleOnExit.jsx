import React from 'react'
import {motion} from 'framer-motion'
import clsx from 'clsx'

function ScaleOnExit({children,className}) {
     const scaleParentDiv={
         initial:{
          scale:1.30,
             opacity:0.4,
         },
           enter:{
             scale:1,
             opacity:1,
             transition: {
               duration:.8,
               ease:"easeInOut",
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
             initial='initial'
              exit='exit' 
              animate={'enter'}
              >
                {children}
              </motion.div>
  )
}

export default ScaleOnExit