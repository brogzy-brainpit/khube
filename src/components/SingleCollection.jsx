import {motion} from "framer-motion"
import ScrambleText from "@/effects/ScrambleText"
import Image from "next/image"
import Link from "next/link"


export const SingleCollection=({collection,isNew,index,direction})=>{
    return (
        
         <motion.div
            key={collection.id}
            layout
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
            className="relative col-span-full md:col-span-4 lg:col-span-4 "
          >
            <Link className="h-full w-full relative" href={`/collections/${collection.handle}`}>
            <div className="relative w-full aspect-[7/5] spect-square overflow-hidden">
              {collection.image && (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  fill
                  loading={index < 8 ? 'eager' : undefined}
                  decoding="async"
                  quality={85}
                    sizes="
                  (max-width:768px) 100vw,
                  (max-width:1024px) 50vw,
                  25vw
                "
                className="object-cover w-full h-full"
                />
              )}
            </div>

            <h2 className="font-custom text-heading2 mt-3">
              {/* {collection.title} */}
              <ScrambleText text={collection.title}/>
            </h2>
            </Link>
          </motion.div>
       
    )
}
