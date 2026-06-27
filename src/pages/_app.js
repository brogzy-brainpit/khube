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
import Header from '../components/Header/index';
import { customEase1 } from '../../data';
import PageTransition from '@/effects/PageTransition';
import Footer from '@/components/Footer';

const Sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

// import local fonts froom ./fontdirectory
const custom = localFont({
  src: "./fonts/neuehaasgrottextmd.otf",
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
     <PageTransition/>

        <Header preLoaderOut={true}/>
        <Component {...pageProps} />     
        <Footer />


      </div>
    </AnimatePresence>
    </SmoothScroll>
  );
}
