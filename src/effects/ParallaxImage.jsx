import clsx from 'clsx'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import React, { useRef } from 'react'

function ParallaxImage({src,y='-70px',className,initialScale=1.4,targetScale=1.2}) {
      const track=useRef(null)
     const {scrollYProgress}= useScroll({target:track,offset:['start end','end .4']})

   const imageY= useSpring(useTransform(scrollYProgress,[0,1],['20%', '0%']),{stiffness:150,damping:20,mass:.1})
    const imageScale= useSpring(useTransform(scrollYProgress,[0,1],[initialScale, targetScale]),{stiffness:150,damping:20,mass:.1})
   
   const MotionImage=motion(Image)
  return (
      <div ref={track} className='w-full h-full  relativ '>
    <MotionImage style={{y:imageY,scale:imageScale}}
             className={clsx(`${className || ''} object-cover w-full h-full`)} 
             src={src} 
             fill={true}/>

             </div>
  )
}

export default ParallaxImage