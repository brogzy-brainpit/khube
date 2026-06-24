import React, { useState } from 'react'
import styles from './style.module.scss';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { menuSlide } from '../animation';
import Link from './Link';
import Curve from './Curve';
import Footer from './Footer';
import Magnetic from '@/effects/Magnetic';
// import DarkModeToggle from '../../DarkModeToggle';

const navItems = [
    { title: "All Products", href: "products" },
    { title: "Featured", href: "featured" },
    { title: "New Arrivals", href: "new-arrivals" },
  ];


export default function Index({setIsActive,isActive}) {

  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
const animateLine = {
  initial: {width: 0},
  enter: {width: "100%", transition: {delay:.4,duration: .4, ease: "easeInOut"}},
  exit: {width: 0, transition: {delay:.2,duration: .6, ease: "easeInOut"}}
}
  return (
    <motion.div 
      variants={menuSlide} 
      initial="initial" 
      animate="enter" 
      exit="exit" 

      className={`${styles.menu} w-full max-w-full z-[3] h-[100vh] fixed right-0 top-0 text-brand-white dark:text-brand-white-dark duration-500 transition-colors bg-brand-secondary/80 backdrop-blur-md`}
      >
       <div className={`${styles.body} py-[60px] px-4 container mx-auto`}>
            <div onMouseLeave={() => {setSelectedIndicator(pathname)}} className={styles.nav}>
               
                    <div className='relative flex justify-between items-center uppercase text-[13px] font-custom-condensed mb-[30px] pb-[10px]  text-brand-white dark:text-brand-white-dark duration-500 transition-colors'>
                        <p className='text-brand-white font-custom2'>Navigation</p>
                            <Magnetic>
                            <div>
                            {/* <DarkModeToggle/> */}
                            darkmode
                            </div>  
                            </Magnetic>
                            <motion.div variants={animateLine} initial="initial" animate="enter" exit="initial" className='absolute -translate-y-1/2 -bottom-[0%] w-full bg-brand-white h-[.1em]'/>
                    </div>
                    {
                      navItems.map( (data, index) => {
                        return <Link setIsActive={setIsActive} isActiv={isActive}
                        key={index} 
                        
                        data={{...data, index}} 
                        isActive={selectedIndicator == data.href} 
                        setSelectedIndicator={setSelectedIndicator}>fff
                        </Link>
                      })
                    }
            </div>
            <Footer />
        </div>
        <Curve />
    </motion.div>
  )
}