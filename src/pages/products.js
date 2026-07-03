import ScaleOnExit from "@/effects/ScaleOnExit";
import GridColumn from "@/layout/GridColumn";
import Section from "@/layout/Section";
import { storefront } from "@/utils/queries";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";

const revealVariants = {
  initial: {
    clipPath: "inset(100% 0% 0% 0%)",
    scale: 1.3,
    transition: {
      duration: 1,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  hover: {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

function ProductCard({ node }) {
  const controls = useAnimationControls();

  const image = node.images.edges[0]?.node;
  const image2 = node.images.edges[1]?.node;

  return (
    <motion.div
      className="col-span-3 md:col-span-4 lg:col-span-3"
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("initial")}
    >
      <div className="relative group w-full aspect-[5/7] overflow-hidden">
        {image && (
          <Image
            src={image.url}
            alt={image.altText || node.title}
            fill
            className="object-cover"
          />
        )}

        {image2 && (
          <motion.div
            animate={controls}
            initial="initial"
            variants={revealVariants}
            className="
absolute inset-0 isa
transition-all duration-700
brightness-[4]
contrast-150
group-hover:brightness-100
group-hover:contrast-100
"
          >
            <Image
              src={image2.url}
              alt={image2.altText || node.title}
              fill
              className="object-cover"
            />
          </motion.div>
        )}
      </div>

      <h2 className="text-heading4 leading-[1] mt-[.8em] mb-[.5em] font-custom font-medium">
        {node.title}
      </h2>

      <p className="text-para font-body">
        {node.priceRange.minVariantPrice.amount}{" "}
        {node.priceRange.minVariantPrice.currencyCode}
      </p>
    </motion.div>
  );
}

export default function Products({ products }) {
  return (
    <div className="bg-brand-accent text-brand-black">
      <ScaleOnExit
        preLoaderOut
        className="h-full w-full flex items-center justify-center"
      >
        <Section>
          <GridColumn>
            {products.edges.map(({ node }) => (
              <ProductCard key={node.handle} node={node} />
            ))}
          </GridColumn>
        </Section>
      </ScaleOnExit>
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await storefront(productsQuery);

  return {
    props: {
      products: data.products,
    },
  };
}

const gql = String.raw;

const productsQuery = gql`
  query Products {
    products(first: 20) {
      edges {
        node {
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
      }
    }
  }
`;