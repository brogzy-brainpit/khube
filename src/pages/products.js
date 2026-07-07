import ScaleOnExit from "@/effects/ScaleOnExit";
import GridColumn from "@/layout/GridColumn";
import Section from "@/layout/Section";
import { storefront } from "@/utils/queries";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
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
  // ease: [0.76, 0, 0.24, 1]
},
},
}
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
  delay: .08,
  duration: .9,
  ease: [0.22, 1, 0.36, 1],
  // ease: [0.76, 0, 0.24, 1]
},
},
};

function ProductCard({ node,priority }) {
  const controls = useAnimationControls();

  const image = node.images.edges[0]?.node;
  const image2 = node.images.edges[1]?.node;

  return (
    <motion.div
      className="col-span-3 md:col-span-4 lg:col-span-3"
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("initial")}
    >
      <Link href={`/products/${node.handle}`}>
      <div className="relative group w-full aspect-[5/7] overflow-hidden">
        {image && (
          <motion.div
          animate={controls}
           initial="initial"
            variants={revealImage1Variants}
             className="relative w-full h-full"
              style={{ willChange: "transform, filter",originX: 0.5, originY: 0.5 }}
             >
              <Image
                src={image.url}
                alt={image.altText || node.title}
                fill
                priority={priority}
                decoding="async"
               sizes="(max-width:768px) 100vw,
       (max-width:1024px) 50vw,
       25vw"
      quality={100}
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
      sizes="(max-width:768px) 100vw,
       (max-width:1024px) 50vw,
       25vw"
      quality={70}
      decoding="async"
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700,900))}`}
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
          <GridColumn>
            {products.edges.map(({ node }, index) => (
              <ProductCard key={node.handle} node={node} priority={index < 4} />
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