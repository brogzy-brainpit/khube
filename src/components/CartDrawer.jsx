// components/CartDrawer.jsx
import { CartCheckoutButton, useCart } from '@shopify/hydrogen-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CartDrawer({ isOpen, onClose }) {
  // Pull live cart data and mutation functions directly from Shopify Context
  const { 
    lines, 
    cost, 
    checkoutUrl, 
    linesUpdate, 
    linesRemove 
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black"
      />

      {/* Slide-out Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-brand-white text-brand-black p-6 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="font-custom text-heading3 font-medium">Your Cart</h2>
          <button onClick={onClose} className="text-xl font-bold">✕</button>
        </div>

        {/* Cart Line Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {lines.length === 0 ? (
            <p className="text-center font-body py-8 text-gray-500">Your cart is empty.</p>
          ) : (
            lines.map((line) => {
              const { id, quantity, merchandise } = line;
              return (
                <div key={id} className="flex gap-4 border-b pb-4">
                  {/* Product Image */}
                  {merchandise.image && (
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      <Image 
                        src={merchandise.image.url} 
                        alt={merchandise.image.altText || merchandise.product.title} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="font-body font-semibold text-para">{merchandise.product.title}</h4>
                      <p className="text-sm text-gray-500">{merchandise.title}</p>
                    </div>

                    {/* Quantity Selector & Remove Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <button 
                          onClick={() => quantity > 1 ? linesUpdate([{ id, quantity: quantity - 1 }]) : linesRemove([id])}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-3 font-body">{quantity}</span>
                        <button 
                          onClick={() => linesUpdate([{ id, quantity: quantity + 1 }])}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-body font-medium">
                        {line.cost?.totalAmount?.amount} {line.cost?.totalAmount?.currencyCode}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Footer */}
        {lines.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between font-body text-para font-semibold">
              <span>Subtotal</span>
              <span>{cost?.subtotalAmount?.amount} {cost?.subtotalAmount?.currencyCode}</span>
            </div>
            
            {/* Native Shopify Secure Checkout Link */}
            {/* <a 
              href={checkoutUrl}
              className="block w-full text-center bg-brand-black text-brand-white py-3 rounded font-medium hover:opacity-90 transition"
            >
              Proceed to Checkout
            </a> */}
            <CartCheckoutButton
  className="block w-full text-center bg-brand-black text-brand-white py-3 rounded"
>
  Proceed to Checkout
</CartCheckoutButton>
          </div>
        )}
      </motion.div>
    </div>
  );
}
