import useCartStore from "@/store/cartStore";

export default function ProductCard({ product, user }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button onClick={() => addToCart(product, user)}>
      Add To Cart
    </button>
  );
}