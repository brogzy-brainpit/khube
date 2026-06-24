import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence,motion, useInView } from "framer-motion";
import { useRouter } from "next/router";
import {DM_Sans} from "next/font/google";

import "../styles/mostHave.css";
import "../styles/globals.css";

// import Footer from "@/components/Footer";
import localFont from "next/font/local";
import Script from "next/script";
// import SlideUpText from '@/effects/SlideUpText';
// import Header from '@/components/Header';
import Head from 'next/head';
// import Header from './components/Header';
import SmoothScroll from '@/providers/Lenis';
import Header from './components/Header/index';
import { customEase1 } from '../../data';

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

// import local fonts froom ./fontdirectory
const custom = localFont({
  src: "./fonts/HelveticaNeueMedium.otf",
  variable: "--font-custom",
  weight: "100 200 300 400 500 600 700 800 900",
});
const custo2 = localFont({
  src: "./fonts/Morganite.ttf",
  variable: "--font-custom2",
  weight: "100 200 300 400 500 600 700 800 900",
});

const custom2 = localFont({
  src: "./fonts/NewSpirit.otf",
  variable: "--font-custom2",
  weight: "100 200 300 400 500 600 700 800 900",
});
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
// console.log(router.pathname)
const [pageName,setPageName]= useState(router.pathname)
   const [preLoaderOut,setPreLoaderOut]=useState(false)

   const routeTitles= {
    '/':'welcome',
    '/about':'about us',
    '/contact':'contact',
    '/faqs':'FAQS',
    '/gallery':'Gallery [portfolio]',
    '/blog':'blog',
    
   }
   const getTitle= (route)=>{
    return routeTitles[route] || 'page'
   }
  useEffect(() => {
    setPreLoaderOut(true)

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const handleRouteChange=(url)=>{
      setPageName(url)
    }
    router.events.on('routeChangeStart',handleRouteChange)
    return ()=>{
    router.events.off('routeChangeStart',handleRouteChange)

    }
    // setPageName(router.pathname.replace('/',''))
  }, [router.events]);
   const svgRef=useRef(null)
    const inView= useInView(svgRef,{once:false})
      const columns={
      initial:{}
  ,
       enter:{
        transition: {
          // duration:1.2,
          // delayChildren:2, // 👈 wait before starting
          staggerChildren:.05,  
              // 👈 delay between items
        },
      },
      exit:{
         transition: {
          staggerDirection:-1,
          // delayChildren:0.7, // 👈 wait before starting
          staggerChildren:.05,  
          // staggerChildren:0.1,  
        },
      },
    }
    const scaleParentDiv={
     initial:{
      scale:.9,
      opacity:1
     },
       enter:{
         scale:1,
         opacity:1,
        transition: {
          duration:.4
        },
      },
      exit:{
         scale:1.2,
         opacity:0.4,
         transition: {
          delay:.3,
           duration:.3,
           ease:"easeInOut",
          //  ease:customEase1,
           scale:{
            delay:0,
            duration:.6 ,
          ease:"easeInOut",
          // ease:customEase1,
         }
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
              duration:.6
            }
      }),
    }
    const as=[1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]
  return (
    <SmoothScroll>
    <AnimatePresence
      mode="wait"
      // onExitComplete={() =>setPreLoaderOut(true)}
    >
         <div
        key={router.asPath}
        className={`overflow-hidden ${Sans.variable} ${custom.variable} ${custom2.variable}`}

      >
                   <div className='fixed top left-0 w-full h-full bg-purple600 z-preloader pointer-events-none'>
       <motion.div className='flex gap-0 w-full h-full' ref={svgRef}
        variants={columns} initial='initial' exit='exit' animate={'enter'}>
   {as.map(()=>{
    return (
      <motion.div className='w-[10%] bg-white h-full origin-righ ' variants={oneColumn}>
        {/* dd */}
      </motion.div>
    )
   })}
</motion.div>
     </div>

         <motion.div
         className='overflow-hidden'
         variants={scaleParentDiv} 
         initial='initial'
          exit='exit' 
          animate={'enter'}
          >
             <Header preLoaderOut={true}/>
        <Component {...pageProps} />     
        {/* <Footer /> */}
          </motion.div>


      </div>
    </AnimatePresence>
    </SmoothScroll>
  );
}
