'use client'

import React, { useRef, useEffect,useState } from 'react'
import Core from 'smooothy'
import SlideUpText from '@/effects/SlideUpText';
import Image from 'next/image';
import {motion, useTransform} from 'framer-motion';
import useMouse from '@/hooks/useMouse';
import Section from '@/layout/Section';
import GridColumn from '@/layout/GridColumn';
import { title } from 'framer-motion/client';


const slidesData = [
  { url:"/images/red1.jpg",price: 19.99,title:"luxury hausa attire hat", username: "@john_doe", color: '#FFFF00' },
  { url: "/images/red2.jpg", price: 24.99, title: "Elegant Evening Gown", username: "@jane_smith", color: '#55DB9C' },
  { url:"/images/red3.jpg", price: 29.99, title: "Stylish Casual Shirt", username: "@mike_wilson", color: '#E9CCFF' },
  { url:"/images/red5.jpg", price: 39.99, title: "Designer Handbag", username: "@alex_brown", color: '#FFFFFF' },
  { url:"/images/red9.jpg" , price: 44.99, title: "Luxury Watch", username: "@emma_davis", color: '#4DA2FF' },
  { url: "/images/red6.jpg", price: 49.99, title: "Premium Sneakers", username: "@chris_taylor", color: '#E9CCFF' },
  { url:"/images/red7.jpg", price: 54.99, title: "Comfortable Running Shoes", username: "@lisa_martin", color: '#FB4903' },
  { url:"/images/red8.jpg", price: 59.99, title: "Classic Leather Jacket", username: "@david_lee", color: '#55DB9C' },
  { url: "/images/red4.png", price: 64.99, title: "baggy pants", username: "@amy_chen", color: '#FFB347' },
  { url: "/images/red10.jpg", price: 64.99, title: "luxury balenciaga", username: "@amy_chen", color: '#FFB347' },
  { url: "/images/red11.jpg", price: 99.99, title: "Elegant Formal Shoes", username: "@amy_chen", color: '#FFB347' },
  { url: "/images/red1.jpg", price: 34.99, title: "Trendy Sunglasses", username: "@sarah_jones", color: '#FB4903' },
];

const Swiper = () => {
  const [scale,setScale]=useState(false)
 const {x,y}=useMouse({start:{x:480,y:300},stiffness:140,damping:18,mass:0.1})
const newX= useTransform(x,x=>x-50)
const newY= useTransform(y,x=>x-50)
  const wrapperRef = useRef(null);

  useEffect(()=>{
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const slides = [...wrapper.children];

    const preventSelect = (e) => e.preventDefault();
    wrapper.addEventListener('selectstart', preventSelect);
    wrapper.style.userSelect = 'none';
    wrapper.style.webkitUserSelect = 'none';
    wrapper.style.touchAction = 'pan-y';


    const slider = new Core(wrapper, {
      infinite: false,
      snap: false,
      variableWidth: true,
      lerpFactor: 0.02,
      speedDecay: 0.97,
      bounceLimit: 0,
      setOffset: ({ itemWidth, totalWidth}) =>{
        const gap = window.innerWidth * 0.02;
        const lastSlideOffset = (slidesData.length -1) * (itemWidth + gap);
        return totalWidth - lastSlideOffset;
      },
      onUpdate: (instance)=>{
        const vwOffset = window.innerWidth * .1

        slides.forEach((slide, i)=>{
          const slideWidth = slide.offsetWidth;
          const slideLeft = slide.offsetLeft + instance.current;
          const bgColor = slidesData[i].color;

          const isLast = i === slidesData.length -1;

          if (slideLeft < 0 && !isLast){
            const ratio = Math.min(1, Math.abs(slideLeft) / slideWidth);
            //  background-color: ${bgColor};
            // border: 2px solid rgba(0,0,0,0.6);
            slide.style.cssText = `
              
              
              transform-origin: left 80%;
              transform: translateX(${instance.current + Math.abs(slideLeft) + ratio * vwOffset}px) rotate(${-15 * ratio}deg) scale(${1 - ratio * 0.4});
              position: relative;
              z-index: ${i + 1};
            `
          } else {
//  background-color: ${bgColor};
         slide.style.cssText = `
             
              transform: translateX(${instance.current}px);
              z-index: ${i + 1};
            `
          }
        })
      }
    })

    let animId;
    let wasDragging = false;
    let momentum = 0;
    const MOMENTUM_MULTIPLIER = 10;
    const MOMENTUM_DECAY = 0.96;

    function animate (){
      slider.update();

      if (slider.isDragging) {
        wasDragging = true;
        momentum = 0;
      } else if (wasDragging) {
        momentum = slider.speed * MOMENTUM_MULTIPLIER;
        wasDragging = false;
        
      }
      if ( Math.abs(momentum) > .5) {
        slider.target += momentum;
        momentum *= MOMENTUM_DECAY;
        slider.target = Math.max(slider.maxScroll, Math.min(0,slider.target));
      }

      animId = requestAnimationFrame(animate);
    }

    animate();

    return ()=>{
      cancelAnimationFrame(animId);
      wrapper.removeEventListener('selectstart', preventSelect);
      slider.destroy();
    }
  }, [])


  return (
    <div>
        <GridColumn>

      <div onMouseEnter={()=>{setScale(true)}} onMouseLeave={()=>{setScale(false)}} className='col-span-full lg:col-start-1 lgcol-span-4 h-full overflow-clip relative'>
        <motion.div  animate={{scale:scale?1:0}} style={{x:newX,y:newY,scale:0}} className='z-10 font-body pointer-events-none bg-brand-white text-brand-black font-medium capitalize mixblend-difference fixed flex items-center justify-center top-0 left-0 h-[80px] w-[80px] rounded-full overflow-hidden '>
{/* <img src={"https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68384fb014875f192dfcef4b_cursor-drag.svg"}  className="w-[120px] h-[120px] object-cover"/> */}
drag
      </motion.div>
        <div ref={wrapperRef} className="cursor[url('https://cdn.prod.website-files.com/683703490bc01e1b8c052e06/68384fb014875f192dfcef4b_cursor-drag.svg'),_grab] flex h-full items-center will-change-transform">
          {slidesData.map((slide, index) => {
            return  <div key={index} className={` bg-brand-white w-[40vw] md:w-[20em] lg:w-[20em] shrink-0 pointer-events-none overflow-hidden   rounded-[.2vw] flex flex-col justify-between ${index < slidesData.length -1 ? 'mr-[1vw]' : ''}`}>
                <div className=' h-[30vh]  md:h-[20em] w-full  lg:h-[28em]  rounded-sm'>
                <Image height={800} width={800} className='object-cover h-full w-full' src={slide.url}/>
                </div>
                 <div className="flex justify-between items-center mt-4">
                  <h4 className='text-para text-brand-black font-body capitalize'>{slide.title}</h4>
                  <h4 className='text-para text-brand-black font-bold font-body capitalize'>
                    <sup>$</sup>
                    <span>
                      {slide.price.toFixed(2)}
                      </span>
                      </h4>
                 </div>
                </div>
          })}
        </div>
      </div>
        </GridColumn>
    </div>
  )
}

export default Swiper