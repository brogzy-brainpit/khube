// components/CustomAddToCart.jsx
import {
  sendShopifyAnalytics,
  AnalyticsEventName,
  ShopifySalesChannel,
  getClientBrowserParameters,
  AddToCartButton as ShopifyButton,
  useCart,
  useShopifyCookies,
} from '@shopify/hydrogen-react';
import { useEffect, useRef } from 'react';

export default function CustomAddToCartButton({
  variant,
  productTitle,
  className,
  onComplete,
}) {
  const { status, lines, error } = useCart();

  // Initializes Shopify analytics cookies (_shopify_y, _shopify_s)
  useShopifyCookies({ hasUserConsent: true });

  // Track whether this button triggered the add-to-cart action
  const shouldTrack = useRef(false);
  const previousLineCount = useRef(lines.length);

  useEffect(() => {
    // Only send analytics after the cart returns to idle
    // and the number of lines has increased
    if (
      shouldTrack.current &&
      status === 'idle' &&
      lines.length > previousLineCount.current
    ) {
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
          products: [
            {
              variantGid: variant.id,
              name: productTitle,
              price: variant.price.amount,
              quantity: 1,
            },
          ],
        },
      });

      shouldTrack.current = false;

      if (onComplete) onComplete();
    }

    previousLineCount.current = lines.length;
  }, [status, lines, variant, productTitle, onComplete]);

  return (
    <ShopifyButton
      variantId={variant.id}
      quantity={1}
      className={className}
      onClick={() => {
        shouldTrack.current = true;
      }}
    >
      Add to Cart
    </ShopifyButton>
  );
}