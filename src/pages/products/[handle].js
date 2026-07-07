import ScaleOnExit from '@/effects/ScaleOnExit';
import ScrambleText from '@/effects/ScrambleText';
import ScrambleTextPara from '@/effects/ScrambleTextPara';
import GridColumn from '@/layout/GridColumn';
import Section from '@/layout/Section';
import { storefront } from '@/utils/queries';
import Image from 'next/image';
import React from 'react'

function Product({ product }) {
console.log(product)
const title = product.title;
const price = product.priceRange.minVariantPrice.amount;
const currency = product.priceRange.minVariantPrice.currencyCode;
const description = product.description;
const image = product.images.edges[0]?.node;
  const image2 = product.images.edges[1]?.node;
 return (

    <div className='bg-brand-white text-brand-black'>
       <ScaleOnExit preLoaderOut className={"h-full w-full flex items-center justify-center"}>
          <Section>
            <GridColumn>
              <div className='lg:col-span-5 col-span-4 bg-red400'>
                <div className='h-full w-full aspect-[5/6] relative pb-[66px]'>
                <Image alt={image.altText || title} className='object-cover h-full w-full'  src={image.url} fill  />
                </div>
              </div>
              <div className='lg:col-span-1 col-span-2 bg-purple400'>
                <div className='w-full h-full flex flex-col  items-start justify-start gap-4'>
                  {product.images.edges.map(({node})=>{
                    return (
                       <div key={node.url} className="relative w-full aspect-square">
    <Image
      src={node.url}
      alt={node.altText || ""}
      fill
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

              </div>
            </GridColumn>

          </Section>
       </ScaleOnExit>
      </div>
  )
}
const gql = String.raw;

export async function getStaticPaths() {
  const { data } = await storefront(gql`
{
  products(first: 6) {
    edges {
      node {
        handle
      }
    }
  }
}
`);
    const paths = data.products.edges.map(({ node }) => ({
        params: { handle: node.handle },
      }));
    return {
      paths,
      fallback: false,
    };
  }
export async function getStaticProps({ params }) {
  const { data } = await storefront(singleProductQuery,{ handle: params.handle });
  return {
    props: {
      product: data.product,
    },
  };
}
const singleProductQuery = gql`
  query SingleProduct($handle: String!) {
  product(handle: $handle) {
    title
    description
    updatedAt
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
`;
export default Product