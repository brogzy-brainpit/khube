// components/CustomAddToCart.jsx
import { 
  sendShopifyAnalytics, 
  AnalyticsEventName, 
  ShopifySalesChannel, 
  getClientBrowserParameters,
  AddToCartButton as ShopifyButton,
  useCart
} from '@shopify/hydrogen-react';
import { useEffect } from 'react';

export default function CustomAddToCartButton({ variant, productTitle, className, onComplete }) {
  const { status, lines, error } = useCart();

useEffect(() => {
  console.log('Cart status:', status);
  console.log('Cart lines:', lines);
  console.log('Cart error:', error);
}, [status, lines, error]);

  const handleAddToCartAnalytics = () => {
    // 1. Run tracking analytics
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
          name: productTitle,
          price: variant.price.amount,
          quantity: 1
        }]
      }
    }).then(() => {
      console.log('Add to Cart analytics sent successfully.');
    }).catch((error) => {
      console.error('Error sending Add to Cart analytics:', error);
    });

    // 2. Open the deck drawer interface (Ensures it triggers every single click)
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <ShopifyButton 
      variantId={variant.id}
      quantity={1}
      onClick={handleAddToCartAnalytics} 
      className={className}
    >
      Add to Cart
    </ShopifyButton>
  );
}
