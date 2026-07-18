// components/ShopifyPageAnalytics.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  sendShopifyAnalytics, 
  AnalyticsEventName, 
  getClientBrowserParameters, 
  ShopifySalesChannel 
} from '@shopify/hydrogen-react';

export default function ShopifyPageAnalytics() {
  const router = useRouter();

  useEffect(() => {
    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload: {
        ...getClientBrowserParameters(),
        shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
        currency: process.env.NEXT_PUBLIC_SHOPIFY_CURRENCY,
        acceptedLanguage: process.env.NEXT_PUBLIC_SHOPIFY_LANGUAGE,
        shopifySalesChannel: ShopifySalesChannel.headless,
        hasUserConsent: true,
        canonicalUrl: window.location.origin + router.asPath,
      },
    });
  }, [router.asPath]); // Fires cleanly on every route swap

  return null;
}
