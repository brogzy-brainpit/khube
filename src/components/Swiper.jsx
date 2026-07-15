'use client'

import React, { useRef, useEffect, useState } from 'react'
import Core from 'smooothy'
import Image from 'next/image'
import { motion, useTransform } from 'framer-motion'
import useMouse from '@/hooks/useMouse'
import GridColumn from '@/layout/GridColumn'

const Swiper = ({ products = [] }) => {
  const [scale, setScale] = useState(false)

  const { x, y } = useMouse({
    start: { x: 480, y: 300 },
    stiffness: 140,
    damping: 18,
    mass: 0.1,
  })

  const newX = useTransform(x, (x) => x - 50)
  const newY = useTransform(y, (y) => y - 50)

  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!products.length) return

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const slides = [...wrapper.children]

    const preventSelect = (e) => e.preventDefault()

    wrapper.addEventListener('selectstart', preventSelect)
    wrapper.style.userSelect = 'none'
    wrapper.style.webkitUserSelect = 'none'
    wrapper.style.touchAction = 'pan-y'

    const slider = new Core(wrapper, {
      infinite: false,
      snap: false,
      variableWidth: true,
      lerpFactor: 0.02,
      speedDecay: 0.97,
      bounceLimit: 0,

      setOffset: ({ itemWidth, totalWidth }) => {
        const gap = window.innerWidth * 0.02
        const lastSlideOffset =
          (products.length - 1) * (itemWidth + gap)

        return totalWidth - lastSlideOffset
      },

      onUpdate: (instance) => {
        const vwOffset = window.innerWidth * 0.1

        slides.forEach((slide, i) => {
          const slideWidth = slide.offsetWidth
          const slideLeft = slide.offsetLeft + instance.current

          const isLast = i === products.length - 1

          if (slideLeft < 0 && !isLast) {
            const ratio = Math.min(
              1,
              Math.abs(slideLeft) / slideWidth
            )

            slide.style.cssText = `
              transform-origin: left 80%;
              transform: translateX(${instance.current + Math.abs(slideLeft) + ratio * vwOffset}px)
              rotate(${-15 * ratio}deg)
              scale(${1 - ratio * 0.4});
              position: relative;
              z-index: ${i + 1};
            `
          } else {
            slide.style.cssText = `
              transform: translateX(${instance.current}px);
              z-index: ${i + 1};
            `
          }
        })
      },
    })

    let animId
    let wasDragging = false
    let momentum = 0

    const MOMENTUM_MULTIPLIER = 10
    const MOMENTUM_DECAY = 0.96

    function animate() {
      slider.update()

      if (slider.isDragging) {
        wasDragging = true
        momentum = 0
      } else if (wasDragging) {
        momentum = slider.speed * MOMENTUM_MULTIPLIER
        wasDragging = false
      }

      if (Math.abs(momentum) > 0.5) {
        slider.target += momentum
        momentum *= MOMENTUM_DECAY

        slider.target = Math.max(
          slider.maxScroll,
          Math.min(0, slider.target)
        )
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      wrapper.removeEventListener('selectstart', preventSelect)
      slider.destroy()
    }
  }, [products])

  return (
    <div>
      <GridColumn>
        <div
          onMouseEnter={() => setScale(true)}
          onMouseLeave={() => setScale(false)}
          className="col-span-full lg:col-start-1 lgcol-span-4 h-full overflow-clip relative"
        >
          <motion.div
            animate={{ scale: scale ? 1 : 0 }}
            style={{ x: newX, y: newY, scale: 0 }}
            className="z-10 font-body pointer-events-none bg-brand-white text-brand-black font-medium capitalize fixed flex items-center justify-center top-0 left-0 h-[80px] w-[80px] rounded-full overflow-hidden"
          >
            drag
          </motion.div>

          <div
            ref={wrapperRef}
            className="cursor-[url('https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68384fb014875f192dfcef4b_cursor-drag.svg'),_grab] flex h-full items-center will-change-transform"
          >
            {products.map((product, index) => {
              const image = product.images.edges[0]?.node
              const price =
                product.priceRange?.minVariantPrice

              return (
                <div
                  key={product.id}
                  className={`bg-brand-white w-[54vw] md:w-[20em] lg:w-[20em] shrink-0 pointer-events-none overflow-hidden rounded-[.2vw] flex flex-col justify-between ${
                    index < products.length - 1 ? 'mr-[1vw]' : ''
                  }`}
                >
                  <div className="h-[40vh] md:h-[20em] w-full lg:h-[28em] rounded-sm">
                    {image && (
                      <Image
                        src={image.url}
                        alt={image.altText || product.title}
                        width={800}
                        height={800}
                        className="object-cover h-full w-full"
                      />
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <h4 className="text-para text-brand-black font-body capitalize">
                      {product.title}
                    </h4>

                    <h4 className="text-para text-brand-black font-bold font-body capitalize">
                      <sup>{price?.currencyCode}</sup>

                      <span>
                        {Number(price?.amount).toFixed(2)}
                      </span>
                    </h4>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </GridColumn>
    </div>
  )
}

export default Swiper