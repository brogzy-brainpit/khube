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
    // Do nothing if offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return;
    }

    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload: {
        ...getClientBrowserParameters(),
        shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
        currency: process.env.NEXT_PUBLIC_SHOPIFY_CURRENCY,
        acceptedLanguage: process.env.NEXT_PUBLIC_SHOPIFY_LANGUAGE,
        shopifySalesChannel: ShopifySalesChannel.headless,
        hasUserConsent: true,
        analyticsAllowed: true,
        marketingAllowed: true,
        canonicalUrl: window.location.origin + router.asPath,
      },
    }).catch((error) => {
      console.warn('Shopify analytics failed:', error);
    });
  }, [router.asPath]);

  return null;
}