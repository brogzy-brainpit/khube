import FeaturedProducts from "../components/FeaturedProducts";
import InfiniteCanvasDemo from "../components/InfiniteCanvas";
import Landing from "../components/Landing";
import ProductCard from "../components/TestStore";

export default function Home() {
  return (
    <main
      className={`h-full w-full text-black `}
    >
      <Landing/>
      <FeaturedProducts/>
      <InfiniteCanvasDemo/>
      <div className="h-[100vh] flex items-center justify-center w-full bg-red-200">
        <h1>Home Page</h1>
      </div>
      {/* <ProductCard/> */}
    </main>
  );
}
