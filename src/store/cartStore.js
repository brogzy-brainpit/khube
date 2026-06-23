import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: async (product, user) => {
        // ADD TO LOCAL CART INSTANTLY
        alert("Added to cart!");
        console.log("Added to cart!");
        console.log(get().cart);
        set((state) => ({
          cart: [...state.cart, product],
        }));

        // IF USER IS LOGGED IN
        // if (user?.email) {
        //   try {
        //     await fetch("/api/cart/add", {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({
        //         email: user.email,
        //         product,
        //       }),
        //     });
        //   } catch (error) {
        //     console.log(error);
        //   }
        // }
      },

      removeFromCart: async (id, user) => {
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
        }));

        if (user?.email) {
          try {
            await fetch("/api/cart/remove", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                productId: id,
              }),
            });
          } catch (error) {
            console.log(error);
          }
        }
      },

      getTotalPrice: () => {
        const cart = get().cart;

        return cart.reduce((total, item) => {
          return total + item.price;
        }, 0);
      },

      getCartCount: () => {
        return get().cart.length;
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;