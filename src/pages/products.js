import ScaleOnExit from '@/effects/ScaleOnExit'
import GridColumn from '@/layout/GridColumn'
import Section from '@/layout/Section'
import { storefront } from '@/utils/queries'
import Image from 'next/image'
import React from 'react'

export default function products({products}) {
  // console.log(products)
  return (

    <div className='bg-brand-accent text-brand-black'>
       <ScaleOnExit preLoaderOut className={"h-full w-full flex items-center justify-center"}>
          <Section>
            <GridColumn>
             {products.edges.map(({ node }) => {
  const image = node.images.edges[0]?.node;

  return (
    <div className='col-span-3 md:col-span-4 lg:col-span-3' key={node.handle}>
      {image && (
        <Image className='aspect-[5/7]'
          src={image.transformedSrc}
          alt={image.altText || node.title}
          width={350}
          height={350}
        />
      )}
      <h2 className='text-heading4 leading-[1] mt-[.8em] mb-[.5em] font-custom font-bold'>{node.title}</h2>
      <p className='text-para font-body font-bold'>
        {node.priceRange.minVariantPrice.amount}{" "}
        {node.priceRange.minVariantPrice.currencyCode}
      </p>

    </div>
  );
})}  
            </GridColumn>

          </Section>
       </ScaleOnExit>
      </div>
  )
}

    
  
export async function getStaticProps() {
  const { data } = await storefront(productsQuery);

  return {
    props: {
      products: data.products,
    },
  };
}
// export async function getStaticProps() {
//   const response = await storefront(productsQuery);

//   console.log(response);

//   return {
//     props: {
//       products: response.data.products,
//     },
//   };
// }
 const gql = String.raw
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
        images(first: 1) {
          edges {
            node {
              transformedSrc
              altText
            }
          }
        }
      }
    }
  }
}`