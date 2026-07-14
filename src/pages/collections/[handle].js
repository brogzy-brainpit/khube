import {motion} from "framer-motion";
import ScaleOnExit from "@/effects/ScaleOnExit";
import ScrambleText from "@/effects/ScrambleText";
import ScrambleTextPara from "@/effects/ScrambleTextPara";
import GridColumn from "@/layout/GridColumn";
import Section from "@/layout/Section";
import { PaginatedResourceSection } from "@/components/PaginatedResourceSection";
import { storefront } from "@/utils/queries";
import { getPaginationVariables } from "@shopify/hydrogen";
import Image from "next/image";
import React from "react";
import { PRODUCT_CARD_FRAGMENT } from "@/utils/fragments";

import { ProductCard } from "@/components/ProductCard";
import NotFound from "@/components/NotFound";


function Collection({ collection }) {
  if (!collection) return <NotFound backto="collections" title='collection'/>;

  return (
    <div className="bg-brand-white text-brand-black">
      <ScaleOnExit
        preLoaderOut
        className="h-full w-full flex items-center justify-center"
      >
        <Section>
          <GridColumn>
            <div className="col-span-3 lg:col-span-6 bg-green600">
            {collection.image && (
                <div className="relative aspect-[7/5] w-full h-full">
                  <Image
                    src={collection.image.url}
                    alt={collection.image.altText || collection.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              </div>

            <div className="col-span-3 lg:col-span-6 bg-red600 ">
              <h1 className="font-custom text-heading1 font-medium">
                <ScrambleText
                  text={collection.title}
                  delay={1.2}
                  className="leading-[1]"
                />
              </h1>
              {collection.description && (
                <p className="mt- font-body text-para">
                  <ScrambleTextPara
                    text={collection.description}
                    delay={1.8}
                    duration={1.4}
                  />
                </p>
              )}
            </div>

            <div className="col-span-full mt-16">
              <PaginatedResourceSection
                connection={collection.products}
                connectionKey="collection.products"
                query={COLLECTION_QUERY}
                variables={{
                  handle: collection.handle,
                  country: "US",
                }}
                pageBy={2}
                resourcesClassName="grid grid-cols-6 lg:grid-cols-12 gap-[1.25em] lg:gap-[1.5em]"
              >
                {({ node, index, isNew, direction }) => (
                  <motion.div
                  key={node.id}
                  layout
                  className="col-span-3 md:col-span-4 lg:col-span-3"
                  initial={
                    isNew
                      ? {
                          opacity: 0,
                          y: direction === "next" ? 70 : -70,
                          scale: 0.96,
                          filter: "blur(10px)",
                        }
                      : false
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    layout: {
                      duration: 0.6,
                    },
                  }}
                >
                   <ProductCard node={node} />
                   
                  </motion.div>
                )}
              </PaginatedResourceSection>
            </div>

          </GridColumn>
        </Section>
      </ScaleOnExit>
    </div>
  );
}

const gql = String.raw;



export async function getServerSideProps(context) {
  const { params, req } = context;

  const request = new Request(
    `http://${req.headers.host}${req.url}`
  );

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 2,
  });

  const { data } = await storefront(COLLECTION_QUERY, {
    handle: params.handle,
    country: "US",
    ...paginationVariables,
  });

  return {
    props: {
      collection: data.collection,
    },
  };
}


const COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}

  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {

    collection(handle: $handle) {
      id
      handle
      title
      description

      image {
        url
        altText
        width
        height
      }

      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
      ) {

        nodes {
          ...ProductCard
        }

        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export default Collection;