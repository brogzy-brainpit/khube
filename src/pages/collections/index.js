import { PaginatedResourceSection } from '@/components/PaginatedResourceSection';
import { storefront } from '@/utils/queries';
import { getPaginationVariables } from '@shopify/hydrogen';
import Image from 'next/image';
import React from 'react'

export default function Collections({ collections }) {
    console.log(collections)
  return (
   <PaginatedResourceSection resourcesClassName={"flex gap-6"} connection={collections}>
  {({ node: collection }) => (
    <div key={collection.id} >
        <div className="relative h-[200px] w-[200px]">
         {collection.image && ( <Image
                        src={collection.image.url}
                        alt={collection.image.altText || collection.title}
                        fill
                        decoding="async"
                       sizes="(max-width:768px) 100vw,
               (max-width:1024px) 50vw,
               25vw"
              quality={100}
                        className="object-cover"
                      />)}
        </div>
      <h2 className='font-custom text-heading2'>{collection.title}</h2>
    </div>
  )}
</PaginatedResourceSection>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  const request = new Request(
    `http://${req.headers.host}${req.url}`
  );

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });
// console.log(paginationVariables)
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

export const COLLECTIONS_QUERY = `#graphql
fragment Collection on Collection {
  id
  title
  handle
  image {
    id
    url
    altText
    width
    height
  }
}

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