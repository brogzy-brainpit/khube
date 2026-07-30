// import AddToCartButton from '@/components/AddToCart';
import ShopifyProductView from '@/Analytics/ShopifyProductView';
import CustomAddToCartButton from '@/components/CustomAddToCart';
import ScaleOnExit from '@/effects/ScaleOnExit';
import ScrambleText from '@/effects/ScrambleText';
import ScrambleTextPara from '@/effects/ScrambleTextPara';
import useProduct from '@/hooks/useProduct';
import GridColumn from '@/layout/GridColumn';
import Section from '@/layout/Section';
import { storefront } from '@/utils/queries';
import { ProductProvider } from '@shopify/hydrogen-react';
import Image from 'next/image';
import React from 'react'

function ProductContent({ product,openCart,transitionKey }) {
 const {
  selectedVariant,
  selectedOptions,
  selectOption,
  isOptionAvailable,
  currentImage,
} = useProduct(product);
console.log(product);
console.log(product.variants.edges);
const title = product.title;
const price = selectedVariant.price.amount;
const currency = selectedVariant.price.currencyCode;
// const price = product.priceRange.minVariantPrice.amount;
// const currency = product.priceRange.minVariantPrice.currencyCode;
const description = product.description;
const image = selectedVariant.image || product.images.edges[0]?.node;
  const image2 = product.images.edges[1]?.node;
 return (

    <div className='bg-brand-white text-brand-black'>
       <ScaleOnExit preLoaderOut className={"h-full w-full flex items-center justify-center"} transitionKey={transitionKey}>
          <ShopifyProductView
          data={{
            products: [
              {
                title: title,
                price: price, // Triggers automatically with the active variant price
                variantId: selectedVariant?.id || '', // e.g. "gid://shopify/ProductVariant/..."
                quantity: 1,
              },
            ],
          }}
        />
          <Section>
            <GridColumn>
              <div className='lg:col-span-5 col-span-4 bg-red400'>
                <div className='h-full w-full aspect-[5/6] relative'>
                <Image 
                src={currentImage.url}
                alt={currentImage.altText || title}
                priority
                 className='object-cover'
                    fill 
                     quality={90}
                sizes="
                  (max-width:768px) 100vw,
                  (max-width:1024px) 50vw,
                  45vw
                " />
                </div>
              </div>
              <div className='lg:col-span-1 col-span-2 bg-purple400'>
                <div className='w-full h-full flex flex-col  items-start justify-start gap-4'>
                  {product.images.edges.map(({node},index)=>{
                    return (
                       <div key={node.url} className="relative w-full aspect-square">
    <Image
      src={node.url}
      alt={node.altText || ""}
      width={200}
      height={200}
      priority={index < 2}
      quality={80}
      className="object-cover"
    />
  </div>
                    )
                  })}

                </div>
              </div>

              <div className='col-span-6 bg-purple400'>
<h2 className="font-custom text-heading1 md:text-heading2 lg:text-heading2 mt-6 mb-0 lg:mb-6 font-medium">
    <ScrambleText className={"leading-[1]"} delay={1.2} text={title}/>
</h2>
<p className="font-body text-para mb-6 font-normal">
    <ScrambleTextPara delay={1.8} duration={1.4} text={description}/>
</p>
 {selectedVariant.availableForSale ? (
                // <AddToCartButton 
                //   variant={selectedVariant} // Passes the updated variant state automatically
                //   productTitle={title}       // Passes the main product title
                //   className="..."            // Pass your layout styling classes here
                // />
                <CustomAddToCartButton 
  variant={selectedVariant}
  productTitle={title}
  onComplete={openCart} // Automatically opens the drawer on click!
   className="px-6 py-3 bg-black text-white rounded font-medium"
/>
              ) : (
                <button disabled className="cursor-not-allowed opacity-60 ...">
                  Sold Out
                </button>
              )}
  <div className="mt-8">

  {product.options.map((option) => (

    <div key={option.name} className="mb-6">

      <h4 className="mb-2 font-semibold">
        {option.name}
      </h4>

      <div className="flex gap-3">

      {option.values.map((value) => {

const available =
isOptionAvailable(option.name, value);

const active =
selectedOptions[option.name] === value;

return (

<button

key={value}

disabled={!available}

onClick={() =>
selectOption(option.name, value)
}

className={`
px-4
py-2
rounded-full
border
transition

${active
? "bg-black text-white border-black"
: ""}

${!available
? "opacity-40 cursor-not-allowed"
: ""}
`}

>

{value}

</button>

)

})}

      </div>

    </div>

  ))}

</div>

<p>{price} {currency}</p>

              </div>
            </GridColumn>

          </Section>
       </ScaleOnExit>
      </div>
  )
}
const gql = String.raw;
export async function getStaticPaths() {
  const { data } = await storefront(`
    {
      products(first: 20) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `);

  return {
    paths: data.products.edges.map(({ node }) => ({
      params: { handle: node.handle },
    })),
    fallback: "blocking",
  };
}
export async function getStaticProps({ params }) {
  const { data } = await storefront(singleProductQuery, {
    handle: params.handle,
  });

  if (!data.product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: data.product,
    },
    revalidate: 3600, // after an hour 3600.
  };
}

const singleProductQuery = gql`
  query SingleProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description

      options {
        name
        values
      }

      variants(first: 250) {
        edges {
          node {
            id
            title
            availableForSale

            image {
              url
              altText
            }

            price {
              amount
              currencyCode
            }

            compareAtPrice {
              amount
              currencyCode
            }

            selectedOptions {
              name
              value
            }
          }
        }
      }

      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
    }
  }
`;
// export default Product

export default function ProductPage({ product,openCart,transitionKey }) {
  // 2. Wrap your entire rendering logic inside ProductProvider
  console.log('openCart received:', typeof openCart); // should log "function"
  // ...
  return (
    <ProductProvider data={product}>
      <ProductContent product={product} openCart={openCart} transitionKey={transitionKey} />
    </ProductProvider>
  );
}