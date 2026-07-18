// components/AddToCartButton.jsx
import { 
  sendShopifyAnalytics, 
  AnalyticsEventName, 
  ShopifySalesChannel, 
  getClientBrowserParameters,AddToCartButton
} from '@shopify/hydrogen-react';

export default function AddToCartButton({ variant, productTitle, className }) {
  const handleAddToCart = () => {
    // 1. Run your headless cart mutation logic here...
    console.log("Added to cart:", variant.id);

    // 2. Fire the tracking action directly using component props
    sendShopifyAnalytics({
      eventName: AnalyticsEventName.ADD_TO_CART,
      payload: {
        ...getClientBrowserParameters(),
        shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
        currency: process.env.NEXT_PUBLIC_SHOPIFY_CURRENCY,
        acceptedLanguage: process.env.NEXT_PUBLIC_SHOPIFY_LANGUAGE,
        shopifySalesChannel: ShopifySalesChannel.headless,
        hasUserConsent: true,
        products: [{
          variantGid: variant.id,
          name: productTitle, // Uses the parent product title passed as a prop
          price: variant.price.amount,
          quantity: 1
        }]
      }
    });
  };

  return (
    <button onClick={handleAddToCart} className={className}>
      Add to Cart
    </button>
  );
}
