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
import SmoothScroll, { lenis } from '@/providers/Lenis';
import Header from '../components/Header/index';
import { customEase1 } from '../../data';
import PageTransition from '@/effects/PageTransition';
import Footer from '@/components/Footer';
import ShopifyPageAnalytics from '@/Analytics/ShopifyPageAnalytics';
import { CartProvider, ShopifyProvider, useCart, useShopifyCookies } from '@shopify/hydrogen-react';
import CartDrawer from '@/components/CartDrawer';
import { useShop } from "@shopify/hydrogen-react";
import Preloader2 from '@/components/preloader/Preloader2';

function ShopDebug() {
  // console.log("SHOP", useShop());
  return null;
}
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

    useShopifyCookies({ hasUserConsent: true }); // ← global, runs on every page

// console.log(router.pathname)
const [pageName,setPageName]= useState(router.pathname)

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
    // setPreLoaderOut(true)

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const handleRouteChange=(url)=>{
      setPageName(url)
     
    }
    router.events.on("routeChangeComplete", () => {
    setTransitionKey(prev => prev + 1);
});
    router.events.on('routeChangeStart',handleRouteChange)
    
    return ()=>{
      router.events.off("routeChangeComplete", () => {
    setTransitionKey(prev => prev + 1);
});
    router.events.off('routeChangeStart',handleRouteChange)

    }
    // setPageName(router.pathname.replace('/',''))
  }, [router.events]);
  // Create a global toggle for the cart panel state
  const [isCartOpen, setIsCartOpen] = useState(false);
const [preLoaderOut, setPreLoaderOut] = useState(false);
const [transitionKey, setTransitionKey] = useState(0);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
        (true);
        setPreLoaderOut(true);
    }, 3000);

    return () => clearTimeout(timer);
}, []);
  
  // Extend pageProps so pages can easily toggle the cart open
  const extendedPageProps = {
    ...pageProps,
    openCart: () => setIsCartOpen(true),
    isLoading,
    preLoaderOut,
    transitionKey,
};
 function CartDebug() {
  const { status } = useCart();
  console.log('CartDebug status:', status); // Should NOT be uninitialized
  return null;
}
  return (
    // ✅ Fix
       <ShopifyProvider
      storeDomain={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}
      storefrontToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}
      storefrontApiVersion="2025-01"
      countryIsoCode="US"
      languageIsoCode="EN"
    >
<CartProvider
  onCreate={() => console.log("Creating cart...")}
  onCreateComplete={() => console.log("Cart created!")}
  onLineAdd={() => console.log("Adding line...")}
  onLineAddComplete={() => console.log("Line added!")}
>

  {/* <Script
  id="shopify-privacy"
  strategy="beforeInteractive"
>
  {`
    window.Shopify = window.Shopify || {};
    window.Shopify.customerPrivacy = {
      setTrackingConsent: function(consent, callback) {
        window.Shopify.customerPrivacy.currentVisitorConsent = consent;
        callback && callback();
      },
      currentVisitorConsent: {
        analytics: true,
        marketing: false,
        preferences: true,
        sale_of_data: false,
      },
    };

    window.Shopify.customerPrivacy.setTrackingConsent(
      {
        analytics: true,
        marketing: false,
        preferences: true,
        sale_of_data: false,
      },
      function() {
        console.log('Shopify tracking consent granted');
      }
    );
  `}
</Script> */}
<ShopDebug/>
<CartDebug /> 
    <SmoothScroll>
    <AnimatePresence
     onExitComplete={() => {
    lenis?.scrollTo(0, {
      immediate: true,
    });
  }}
      mode="wait"
      // onExitComplete={() =>setPreLoaderOut(true)}
    >
         <div
        key={router.asPath}
        className={`overflow-hidden ${Sans.variable} ${custom.variable} ${custom2.variable}`}

      >
         <AnimatePresence  mode="wait" >
    {isLoading &&  <Preloader2 key={'preloader'}/>}
     {/* <Preloader key={'preloader'}/> */}
    </AnimatePresence>
     <PageTransition
    title={pageName.replaceAll('/','') || 'welcome'}
    // title={getTitle(pageName)}
/>
<ShopifyPageAnalytics/>
        <Header preLoaderOut={preLoaderOut} openCart={() => setIsCartOpen(true)} />
        <Component {...extendedPageProps} />  
        {/* Mount your cart drawer globally inside AnimatePresence for smooth slide transitions */}
        <AnimatePresence>
          {isCartOpen && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
        </AnimatePresence>   
        <Footer />


      </div>
    </AnimatePresence>
    </SmoothScroll>
</CartProvider>
    </ShopifyProvider>
  );
}
