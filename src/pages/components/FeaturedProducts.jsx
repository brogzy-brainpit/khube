import ScrambleText from '@/effects/ScrambleText';
import GridColumn from '@/layout/GridColumn';
import Section from '@/layout/Section';
import useCartStore from '@/store/cartStore';
import React from 'react'
import Swiper from './Swiper';

function FeaturedProducts() {
    
      const cart = useCartStore((state) => state.cart);
  return (
   <div className="min-h-screen">
    <Section>
    <GridColumn >
         <div className=' col-span-full md:col-span-6 lg:col-span-12 '>
        <h2 className='text-heading2 text-left uppercase  text-brand-black font-custom mt mb-6'>
              <ScrambleText
              text='Featured Products'
         letters='▚ ▜ ▞ ▃ ▄ ▛ ▟ ▘▅ ▖▙ ▄ ▞ ▚ ▆ ▜ ▘▖ ' 
        letter='♫ ♟ ♚ ♠ ♬ ♛ ♪ ♜ ♠ ♫ ♝ ♪ ♞ ♫ ♟ ♠ ♞ ♛ ♠ ♡ ♚ ♣ ♤ ♥ ♦ ♫ ♬ ♪ ♩'
       l='☯ ☠ ☢ ☣'
        className={'text-neutral-800 tracking-tighter  font-custom'}/>          
      
            {/* Featured Products */}
            </h2>
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