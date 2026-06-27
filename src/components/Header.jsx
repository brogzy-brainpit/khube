import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import Image from 'next/image'
import CartIcon from '@/icons/CartIcon'
import SearchIcon from '@/icons/SearchIcon'
import UserIcon from '@/icons/UserIcon'
import ScrambleText from '@/effects/ScrambleText'
import ScrambleTextPara from '@/effects/ScrambleTextPara'


function Header({preLoaderOut}) {
    const [isScrolled, setIsScrolled]=useState(false)
    const [isScrollingUp, setIsScrollingUp]=useState(false)
    const [lastScrollY, setLastScrollY]=useState(0)
  const [isOpen,setIsOpen]= useState(false)

    
  const Links = [
    { title: "All Products", url: "products" },
    { title: "Featured", url: "featured" },
    { title: "New Arrivals", url: "new-arrivals" },
  ];

    useEffect(()=>{

          const root= document.documentElement
          root.style.setProperty("--anouncement-height", isScrolled?"0px":"40px");
          root.style.setProperty("--header-height", isScrolled?"64px":"80px");
          const handleScroll=()=>{
           const currentScrollY= window.scrollY;
           setIsScrollingUp(currentScrollY<lastScrollY);
           setLastScrollY(currentScrollY)
            setIsScrolled(currentScrollY>400)
          }
          window.addEventListener("scroll",handleScroll,{passive:true,})
          return ()=> window.removeEventListener("scroll",handleScroll )
    
    },[lastScrollY,isScrolled])
    const showNav={
      initial:{
        y:'-100%'
      },
       enter:{
        y:'0%',
      transition:{duration:0.4, delay:2,ease:[0.76, 0, 0.24, 1]},

      },
       exit:{
        y:'-100%',
      transition:{duration:0.4, ease:[0.76, 0, 0.24, 1]},

      },
    }
  return (
    <>
      <AnimatePresence mode='wait'>
    {isOpen && 
    <motion.div initial={{opacity:0}} exit={{opacity:0}} animate={{opacity:isOpen?1:0}} className='lg:hidden z-[2] fixed top-0 right-0 w-full h-svh backdrop-blur-lg bgred-600'>
    <div className='px-5 pt-[12em] w-[80%] h-svh bg-red-200'>
  <motion.div
  className="flex flex-col gap-2 mix-blend-difference"
  initial="initial"
  exit="exit"
  animate="animate"
  variants={{
    animate: {
      transition: {
        staggerChildren: 0.1, // delay between each link
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.15, // delay between each link
      }
    }
  }}
>
    {Links.map(({ title, url },i) => (
              <motion.div
              key={title}
  variants={{
    initial: { y: 30, opacity: 0 },
    exit: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
  }}
>
  <Link
    scroll={false}
    href={`/${url}`}
    className="mix-blend-difference cursor-pointer text-heading1 text-stroke font-custom text-links capitalize"
  >
    {title}
  </Link>
</motion.div>


            ))}
   </motion.div>
  </div>
</motion.div>
} </AnimatePresence>

    <div className={` --header-height fixed top-0 bgbrand-white/30 w-full z-40 transition-transform duration-500 ease-in-out ${!isScrollingUp && isScrolled?'-translate-y-full':'translate-y-0'}`}>
  <motion.header variants={showNav} initial='initial' exit='exit' animate={preLoaderOut?'enter':'initial'} className={` transition-all duration-500  ease-in-out border-b ${isScrolled?"backdrop-blur-lg shadow-lg border-transparent max-h-[60px":"bg-transparent border-transparent"}`}>
<div className='container mx-auto w-full '>
<div className={`block w-full text-center relative transition-all duration-300 ease-in-out px-4 ${isScrolled?"py-4":"py-[2.2em] md:py-[2em]"}`}>
<div className='flex justify-between  items-center relative w-full'>
 {/* <div className='w-[10em'>
 </div> */}
 <ul className= " hidden flex-1 bg-blue800 md:flex md:flex-row md:gap-6 mx-aut">
            {Links.map(({ title, url }, i) => (
              <Link scroll={false}
                key={i}
                className="cursor-pointer font-body text-brand-white text-links capitalize"
                href={`${url}`}
              >
            
               <ScrambleTextPara hoverEffect
                          text={title}
                        
                          duration={.4}
                     letters='▚ ▜ ▞ ▃ ▄ ▛ ▟ ▘▅ ▖▙ ▄ ▞ ▚ ▆ ▜ ▘▖ ' 
                    lette='♫ ♚ ♠ ♬ ♛ ♪ ♜ ♠ ♫ ♝ ♪ ♞ ♫ ♟ ♠ ♞ ♛ ♠ ♡ ♚ ♣ ♤ ♥ ♦ ♫ ♬ ♪ ♩'
                   lett="♚ ♛ ♜ ∱ ∬ ∯ ♝ ♞ ♟ ♠ ♡ ♣ ♤ ♥ ♦ ♫ ♬ ♪ ♩ ☯ ☠ ☢ ☣"
                    className={' tracking-tight text-left w-[10em] font-custom'}/>  
              </Link>

            ))}
          </ul>
<div className='flex gap-4 flex-1 bgpink-800 items-center justify-center'>
<Link className='text-brand-white mix-blend-difference text-heading1 leading-[1] bgred-200 font-custom2' href={'/'}>
  KHUBE
 </Link>
    </div>
 <div className='bg-orange800 hidden lg:flex flex-1 gap-6 items-center justify-end'>
    <CartIcon/>
    <SearchIcon/>
    <UserIcon/>
 </div>
 {/* menu */}
<div className='f gap-2 flex-1 bg-emerald-900 items-center justify-center lg:hidden block'>
  {/* <Button link='#book-a-call' label={"book a call"} className='hidden lg:block'/> */}
<Menu isOpen={isOpen} setIsOpen={setIsOpen}/>
</div>
</div>

</div>
</div>
  </motion.header>
    </div>
  </>
  )
}


const Menu=({isOpen,setIsOpen})=>{
  return (
<div onClick={()=>{setIsOpen(!isOpen)}} className='lg:hidden cursor-pointer bg-brand-accent p- rounded-full h-[4em] w-[4em] flex justify-center items-center'>
  <div className={`flex pointer-events-none justify-center items-center flex-col burger w-full ${isOpen?'activeBurger':''}`}>

  </div>
 
      </div>
  )
}

export default Header