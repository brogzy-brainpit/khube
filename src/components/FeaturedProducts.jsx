import ScrambleText from '@/effects/ScrambleText';
import GridColumn from '@/layout/GridColumn';
import Section from '@/layout/Section';
import useCartStore from '@/store/cartStore';
import React from 'react'
import Swiper from './Swiper';
import ScrambleTextPara from '@/effects/ScrambleTextPara';

function FeaturedProducts() {
    
      const cart = useCartStore((state) => state.cart);
  return (
   <div className=" py-12">
    <Section >
    <GridColumn className={' gap-[0em] lg:gap-[1.5em]'}>
         <div className=' col-span-full md:col-span-6 lg:col-span-12 bgpurple-500 '>
        <h2 className='text-heading2 text-left uppercase text-brand-black font-custom'>
              <ScrambleText
               hoverEffect={false}
              once={false}
              text='Featured Products'
         letters='▚ ▜ ▞ ▛ ▟ ▘▅ ▖▙ ▞ ▚ ▆ ▜ '
        letter='♫ ♟ ♚ ♠ ♬ ♛ ♪ ♜ ♠ ♫ ♝ ♪ ♞ ♫ ♟ ♠ ♞ ♛ ♠ ♡ ♚ ♣ ♤ ♥ ♦ ♫ ♬ ♪ ♩'
       l='☯ ☠ ☢ ☣'
        className={'text-neutral-800 tracking-tighter  font-custom'}/>          
      
            {/* Featured Products */}
            </h2>
    </div>
     <div className='col-span-5 mt-[6em] mb-[4em] col-start-2 lg:col-start-8 lg:my-10  md:col-span-6 lg:col-span-5 bgorange-500'>
        <p className='text-para leading-[1.2] w-full text-left text-brand-black font-custom'>
              <ScrambleTextPara
              duration={1.4}
              text="Premium Hausa caps, rooted in culture, blending elegance and modern style, crafted from rich local fabrics with refined craftsmanship, offering a comfortable fit, timeless design, and subtle luxury, finished with clean detailing and a bold classy presence that speaks confidence and irresistible appeal."
         letters='▚ ▜ ▞ ▃ ▛ ▟ ▘▅ ▖▙ ▄ ▞ ▚ ▆ ▜' 
        className={'text-neutral-800 tracking-tighter  font-custom'}/>          
      
            {/* Featured Products */}
            </p>
    </div>
         <div className=' col-span-full  '>
       <Swiper/>
    </div>
    </GridColumn>
   </Section>
   </div>
  )
}

export default FeaturedProducts