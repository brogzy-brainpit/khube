import ScaleOnExit from "@/effects/ScaleOnExit";
import GridColumn from "@/layout/GridColumn";
import Section from "@/layout/Section";
import { storefront } from "@/utils/queries";
import { PaginatedResourceSection } from "@/components/PaginatedResourceSection";
import { getPaginationVariables } from "@shopify/hydrogen";
import Image from "next/image";
import { LayoutGroup, motion, useAnimationControls } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCT_CARD_FRAGMENT } from "@/utils/fragments";
import NotFound from "@/components/NotFound";
import IsEmpty from "@/components/IsEmpty";

const revealImage1Variants = {
  initial: {
    y: 0,
    filter: "brightness(1) contrast(1) saturate(1)",
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  hover: {
    y: -100,
    filter: "brightness(1.8) contrast(1.2) saturate(1.2)",
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const revealImage2Variants = {
  initial: {
    clipPath: "inset(100% 0% 0% 0%)",
    scale: 1.2,
    filter: "brightness(4) contrast(2.4) saturate(1.8)",
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  hover: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    filter: "brightness(1) contrast(1) saturate(1)",
    transition: {
      delay: 0.08,
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};



export default function Products({ products }) {
    if (products.nodes.length === 0) {
  return (
    <IsEmpty
      backto=""
      title="products"
    />
  );
}

  return (
    <div className="bg-brand-accen text-brand-black">
      <ScaleOnExit
        preLoaderOut
        className="h-full w-full flex items-center justify-center"
      >
        <Section>
          <LayoutGroup>
            <PaginatedResourceSection
              connection={products}
              connectionKey="products"
              query={PRODUCTS_QUERY}
              variables={{
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
                  <ProductCard
                    node={node}
                    priority={index < 4}
                  />
                </motion.div>
              )}
            </PaginatedResourceSection>
          </LayoutGroup>
        </Section>
      </ScaleOnExit>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  const request = new Request(
    `http://${req.headers.host}${req.url}`
  );

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 2,
  });

  const { data } = await storefront(PRODUCTS_QUERY, {
    country: "US",
    ...paginationVariables,
  });

  return {
    props: {
      products: data.products,
    },
  };
}







const gql = String.raw;
const PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}

  query StoreProducts(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {

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
`;
