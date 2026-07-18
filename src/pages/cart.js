import {
  CartCheckoutButton,
  useCart,
} from "@shopify/hydrogen-react";
import Image from "next/image";
import ScaleOnExit from "@/effects/ScaleOnExit";
import Link from "next/link";

export default function CartPage() {
  const {
    lines,
    cost,
    totalQuantity,
    linesUpdate,
    linesRemove,
  } = useCart();

  return (
    <div className="min-h-screen bg-brand-white text-brand-black">
      {/* <ScaleOnExit> */}
        <div className="mx-auto max-w-7xl px-6 py-24">

          <h1 className="font-custom text-display mb-2">
            Your Cart
          </h1>

          <p className="mb-16 font-body text-gray-500">
            {totalQuantity || 0} item{totalQuantity === 1 ? "" : "s"} in your cart
          </p>

          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32">
              <h2 className="font-custom text-heading2 mb-4">
                Your cart is empty
              </h2>

              <p className="text-gray-500 mb-8">
                Looks like you haven't added anything yet.
              </p>

              <Link
                href="/collections"
                className="bg-brand-black text-brand-white px-8 py-4 rounded"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

              {/* LEFT */}

              <div className="lg:col-span-2 space-y-8">

                {lines.map((line) => {

                  const { id, quantity, merchandise } = line;

                  return (

                    <div
                      key={id}
                      className="flex gap-6 border-b pb-8"
                    >

                      <div className="relative h-40 w-40 overflow-hidden rounded-lg bg-gray-100">

                        {merchandise.image && (
                          <Image
                            src={merchandise.image.url}
                            alt={merchandise.image.altText || ""}
                            fill
                            className="object-cover"
                          />
                        )}

                      </div>

                      <div className="flex flex-1 flex-col justify-between">

                        <div>

                          <h3 className="font-custom text-heading4">
                            {merchandise.product.title}
                          </h3>

                          <p className="text-gray-500">
                            {merchandise.title}
                          </p>

                        </div>

                        <div className="flex items-center justify-between">

                          <div className="flex items-center border rounded">

                            <button
                              className="px-4 py-2"
                              onClick={() =>
                                quantity > 1
                                  ? linesUpdate([
                                      {
                                        id,
                                        quantity: quantity - 1,
                                      },
                                    ])
                                  : linesRemove([id])
                              }
                            >
                              −
                            </button>

                            <span className="px-5">
                              {quantity}
                            </span>

                            <button
                              className="px-4 py-2"
                              onClick={() =>
                                linesUpdate([
                                  {
                                    id,
                                    quantity: quantity + 1,
                                  },
                                ])
                              }
                            >
                              +
                            </button>

                          </div>

                          <div className="text-right">

                            <p className="font-semibold">

                              {line.cost.totalAmount.amount}{" "}
                              {line.cost.totalAmount.currencyCode}

                            </p>

                            <button
                              className="mt-2 text-sm underline"
                              onClick={() => linesRemove([id])}
                            >
                              Remove
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                })}

              </div>

              {/* RIGHT */}

              <aside className="lg:sticky lg:top-24 h-fit rounded-xl border p-8">

                <h2 className="font-custom text-heading3 mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4">

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {cost?.subtotalAmount?.amount}{" "}
                      {cost?.subtotalAmount?.currencyCode}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>

                </div>

                <div className="my-8 border-t" />

                <div className="flex justify-between font-semibold text-lg">

                  <span>Total</span>

                  <span>
                    {cost?.totalAmount?.amount}{" "}
                    {cost?.totalAmount?.currencyCode}
                  </span>

                </div>

                <CartCheckoutButton
                  className="mt-8 block w-full rounded bg-brand-black py-4 text-center text-brand-white"
                >
                  Checkout
                </CartCheckoutButton>

              </aside>

            </div>
          )}

        </div>
      {/* </ScaleOnExit> */}
    </div>
  );
}