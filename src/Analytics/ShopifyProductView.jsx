// components/ShopifyProductView.jsx
import { useEffect } from 'react';
import { sendShopifyAnalytics, AnalyticsEventName, ShopifySalesChannel, getClientBrowserParameters } from '@shopify/hydrogen-react';

export default function ShopifyProductView({ data }) {
  useEffect(() => {
    if (!data || !data.products || data.products.length === 0) return;

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PRODUCT_VIEW,
      payload: {
        ...getClientBrowserParameters(),
        shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
        currency: process.env.NEXT_PUBLIC_SHOPIFY_CURRENCY,
        acceptedLanguage: process.env.NEXT_PUBLIC_SHOPIFY_LANGUAGE,
        shopifySalesChannel: ShopifySalesChannel.headless,
        hasUserConsent: true, // Tie this value to your global privacy banner
        analyticsAllowed: true, // Tie this value to your global privacy banner
        marketingAllowed: true, // Tie this value to your global privacy banner
        products: data.products.map(p => ({
          variantGid: p.variantId,
          name: p.title,
          price: p.price,
          quantity: p.quantity || 1
        }))
      }
    });
  }, [data]); // Dispatches safely whenever data props mutate

  return null; // Stays visually hidden in your UI layout
}
