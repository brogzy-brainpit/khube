// components/CustomAddToCart.jsx
import { 
  sendShopifyAnalytics, 
  AnalyticsEventName, 
  ShopifySalesChannel, 
  getClientBrowserParameters,
  AddToCartButton as ShopifyButton,
  useCart,
  useShopifyCookies
} from '@shopify/hydrogen-react';
import { useEffect } from 'react';

export default function CustomAddToCartButton({ variant, productTitle, className, onComplete }) {
  const { status, lines, error } = useCart();
   const {}=useShopifyCookies({ hasUserConsent: true });

  useEffect(() => {
    console.log('Cart status:', status);
    console.log('Cart lines:', lines);
    console.log('Cart error:', error);
  }, [status, lines, error]);

  const handleAddToCartAnalytics = () => {
    sendShopifyAnalytics({
      eventName: AnalyticsEventName.ADD_TO_CART,
      payload: {
        ...getClientBrowserParameters(),
        shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
        currency: process.env.NEXT_PUBLIC_SHOPIFY_CURRENCY,
        acceptedLanguage: process.env.NEXT_PUBLIC_SHOPIFY_LANGUAGE,
        shopifySalesChannel: ShopifySalesChannel.headless,
        hasUserConsent: true,
        analyticsAllowed: true,
        marketingAllowed: true,
        products: [{
          variantGid: variant.id,
          name: productTitle,
          price: variant.price.amount,
          quantity: 1
        }]
      }
    });

    if (onComplete) onComplete();
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
