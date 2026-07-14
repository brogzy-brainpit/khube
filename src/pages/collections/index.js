import { PaginatedResourceSection } from "@/components/PaginatedResourceSection";
import { storefront } from "@/utils/queries";
import { getPaginationVariables } from "@shopify/hydrogen";
import Image from "next/image";
import { LayoutGroup, motion } from "framer-motion";
import React from "react";
import ScrambleText from "@/effects/ScrambleText";
import Link from "next/link";
import IsEmpty from "@/components/IsEmpty";
import { COLLECTION_CARD_FRAGMENT } from "@/utils/fragments";
import Section from "@/layout/Section";
import { SingleCollection } from "@/components/SingleCollection";

export default function Collections({ collections }) {
      if (collections.nodes.length === 0) {
  return (
    <IsEmpty
      backto=""
      title="products"
    />
  );
}
  return (
    <LayoutGroup>
        <Section>
      <PaginatedResourceSection
        connection={collections}
        connectionKey="collections"
        query={COLLECTIONS_QUERY}
        variables={{
          country: "US",
        }}
        pageBy={2}
        resourcesClassName="grid grid-cols-6 lg:grid-cols-12 gap-[1.25em] lg:gap-[1.5em]"
      >
        {({ node: collection, isNew, direction,index }) => (
            <SingleCollection direction={direction} index={index} collection={collection} key={collection.id}  isNew={isNew}/>
        )}
      </PaginatedResourceSection>
        </Section>
    </LayoutGroup>
  );
}

export async function getServerSideProps(context) {
  const { req,res } = context;
 // Cache on the CDN (e.g. Vercel)
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=600"
  );
  const request = new Request(
    `http://${req.headers.host}${req.url}`
  );

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 2,
  });

  const { data } = await storefront(COLLECTIONS_QUERY, {
    country: "US",
    ...paginationVariables,
  });

  return {
    props: {
      collections: data.collections,
    },
  };
}

const COLLECTIONS_QUERY = `#graphql
${COLLECTION_CARD_FRAGMENT}

query StoreCollections(
  $country: CountryCode
  $endCursor: String
  $first: Int
  $language: LanguageCode
  $last: Int
  $startCursor: String
) @inContext(country: $country, language: $language) {
  collections(
    first: $first
    last: $last
    before: $startCursor
    after: $endCursor
  ) {
    nodes {
      ...Collection
    }

    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
`;