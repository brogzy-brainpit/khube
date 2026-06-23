import FeaturedProducts from "./components/FeaturedProducts";
import InfiniteCanvasDemo from "./components/InfiniteCanvas";
import Landing from "./components/Landing";
import ProductCard from "./components/TestStore";

export default function Home() {
  return (
    <main
      className={`h-full w-full text-black `}
    >
      <Landing/>
      <FeaturedProducts/>
      <InfiniteCanvasDemo/>
      {/* <ProductCard/> */}
      {/* <div className="h-[700vh] w-full bg-red-200">

      </div> */}
    </main>
  );
}
