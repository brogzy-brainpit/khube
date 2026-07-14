import React from 'react'
import {motion} from 'framer-motion'

export function OnPaginationAnimation({children,node,direction,isNew}) {
  return (
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
                    </motion.div>
  )
}

export default OnPaginationAnimation