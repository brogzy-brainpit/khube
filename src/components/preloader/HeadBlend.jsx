
import Link from 'next/link'
import React, { useState } from 'react'
import {motion} from 'framer-motion'
import Magnetic from '@/effects/Magnetic'
import Logo from '../Logo'



function HeadBlend() {
  const ease = [0.9, 0, 0.1, 1];

const [MenuAktiv,setMenuAktiv]=useState(false)

  return (
        <div className={`transition-all pointer-events-none bg-red800 mix-blend-difference duration-300 p-4 fixed  w-full h-ful  z-preloader  bgred-700`}>
<div className=' bg-slate-5 relative w-full flex h-ful justify-center items-center py-4 container mx-auto p-'>
<div layout className='bg-red600 h-ful self-start pt-2 pointer-events-auto cursor-pointer' >
  <Magnetic>
 <Link href={'/'} className="flex" >
<Logo />
</Link>
  </Magnetic>

  </div>

 {/* <Magnetic> */}
       
  
 {/* </Magnetic> */}
  </div>
 


</div>
  )
}


export default HeadBlend