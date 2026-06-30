import { AnimatePresence } from "framer-motion";
import FeaturedProducts from "../components/FeaturedProducts";
import InfiniteCanvasDemo from "../components/InfiniteCanvas";
import Landing from "../components/Landing";
import ProductCard from "../components/TestStore";
import Preloader2 from "@/components/preloader/Preloader2";
import Preloader from "@/components/preloader/Preloader";
import { useEffect, useState } from "react";
import HeadBlend from "@/components/preloader/HeadBlend";
import Cta from "@/components/Cta";

export default function Home() {
  const [isLoading,setIsLoading]=useState(true)
   const [isLoading2,setIsLoading2]=useState(true)
   const [preLoaderOut,setPreLoaderOut]=useState(false)

  useEffect(()=>{

   const timer=  setTimeout(() => {
    setIsLoading(false)
    document.body.style.cursor="default"
    // window.scrollTo({top:0})
    setPreLoaderOut(true)
    // setTimeout(() => {
    //   setIsLoading2(false)
    // }, 1000);

    }, 3000);
    return ()=>clearTimeout(timer)
  },[])
  return (
    <main
      className={`h-full w-full text-black bg-brand-white `}
    >
       {/* <AnimatePresence  mode="wait" onExitComplete={()=>{setPreLoaderOut(true)}}> */}
       <AnimatePresence  mode="wait" >
    {isLoading &&  <Preloader2 key={'preloader'}/>}
     {/* <Preloader key={'preloader'}/> */}
    </AnimatePresence>
    {/* <AnimatePresence mode="wait">
  {isLoading2 ? (
    <Preloader key="pre" />
  ) : (
    <HeadBlend key="head" preLoaderOut={preLoaderOut} />
  )}
</AnimatePresence> */}

      <Landing preLoaderOut={preLoaderOut}/>
      <FeaturedProducts/>
      <InfiniteCanvasDemo/>
      {/* <ProductCard/> */}
     <Cta/>
     {/* <div className="h-[100vh] relative flex items-center justify-center w-full bg-red-200"/> */}
    </main>
  );
}
