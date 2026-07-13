import ScaleOnExit from "@/effects/ScaleOnExit";
import GridColumn from "@/layout/GridColumn";
import Section from "@/layout/Section";
import { storefront } from "@/utils/queries";
import { PaginatedResourceSection } from "@/components/PaginatedResourceSection";
import { getPaginationVariables } from "@shopify/hydrogen";
import Image from "next/image";
import { LayoutGroup, motion, useAnimationControls } from "framer-motion";
import Link from "next/link";

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

function ProductCard({ node, priority }) {
  const controls = useAnimationControls();

  const image = node.images.edges[0]?.node;
  const image2 = node.images.edges[1]?.node;

  return (
    <motion.div
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("initial")}
      className="col-span-1"
    >
      <Link href={`/products/${node.handle}`}>
        <div className="relative group w-full aspect-[5/7] overflow-hidden">
          {image && (
            <motion.div
              animate={controls}
              initial="initial"
              variants={revealImage1Variants}
              className="relative w-full h-full"
              style={{
                willChange: "transform, filter",
                originX: 0.5,
                originY: 0.5,
              }}
            >
              <Image
                src={image.url}
                alt={image.altText || node.title}
                fill
                priority={priority}
                decoding="async"
                quality={100}
                sizes="
                  (max-width:768px) 100vw,
                  (max-width:1024px) 50vw,
                  25vw
                "
                className="object-cover"
              />
            </motion.div>
          )}

          {image2 && (
            <motion.div
              initial="initial"
              animate={controls}
              variants={revealImage2Variants}
              className="absolute inset-0"
              style={{
                willChange: "transform, clip-path",
                originX: 0.5,
                originY: 0.5,
              }}
            >
              <Image
                src={image2.url}
                alt={image2.altText || node.title}
                fill
                quality={70}
                decoding="async"
                sizes="
                  (max-width:768px) 100vw,
                  (max-width:1024px) 50vw,
                  25vw
                "
                className="object-cover"
              />
            </motion.div>
          )}
        </div>

        <p className="text-para leading-[1] mt-[.8em] mb-[.5em] font-custom">
          {node.title}
        </p>

        <p className="text-para font-body">
          {node.priceRange.minVariantPrice.amount}{" "}
          {node.priceRange.minVariantPrice.currencyCode}
        </p>
      </Link>
    </motion.div>
  );
}

export default function Products({ products }) {
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
              resourcesClassName="grid grid-cols-12"
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
        id
        title
        handle
        tags

        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }

        images(first: 2) {
          edges {
            node {
              url
              altText
            }
          }
        }
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