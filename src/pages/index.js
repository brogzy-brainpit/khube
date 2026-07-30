import { AnimatePresence } from "framer-motion";
import FeaturedProducts from "../components/FeaturedProducts";
import InfiniteCanvasDemo from "../components/InfiniteCanvas";
import Landing from "../components/Landing";
// import ProductCard from "../components/TestStore";
import Preloader2 from "@/components/preloader/Preloader2";
import Preloader from "@/components/preloader/Preloader";
import { useEffect, useState } from "react";
import HeadBlend from "@/components/preloader/HeadBlend";
import Cta from "@/components/Cta";
import PaintRevealCanvas from "@/components/PaintRevealCanvas";
import PaintReveal from "@/components/PaintReveal";
import { storefront } from "@/utils/queries";
import { PRODUCT_CARD_FRAGMENT } from "@/utils/fragments";

export default function Home({ SingleCollection,preLoaderOut,isLoading,transitionKey }) {
  useEffect(()=>{
   const timer=  setTimeout(() => {
    // setIsLoading(false)
    document.body.style.cursor="default"
    // window.scrollTo({top:0})
    // setPreLoaderOut(true)
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
       {/* <AnimatePresence  mode="wait" >
    {isLoading &&  <Preloader2 key={'preloader'}/>}
    </AnimatePresence> */}
     {/* <Preloader key={'preloader'}/> */}
    {/* <AnimatePresence mode="wait">
  {isLoading2 ? (
    <Preloader key="pre" />
  ) : (
    <HeadBlend key="head" preLoaderOut={preLoaderOut} />
  )}
</AnimatePresence> */}

      <Landing preLoaderOut={preLoaderOut} transitionKey={transitionKey}/>
      {SingleCollection && (
  <FeaturedProducts collection={SingleCollection} />
)}
        <PaintReveal/>
      <InfiniteCanvasDemo/>
      {/* <ProductCard/> */}
     <Cta/>
     {/* <div className="h-[100vh] relative flex items-center justify-center w-full bg-red-200"/> */}
    </main>
  );
}

export async function getStaticProps() {
  const response = await storefront(HOME_QUERY);

  // console.log(JSON.stringify(response, null, 2));

  return {
    props: {
      SingleCollection: response.data?.featured?? null,
      
    },
    revalidate: 60,
  };
}


const gql = String.raw;

const HOME_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}

  query HomeProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {

    featured: collection(handle: "jallabiya") {
      id
      handle
      title
      description

      products(first: 10) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
`;