import ParallaxImage from '@/effects/ParallaxImage'
import ScrambleText from '@/effects/ScrambleText'
import ScrambleTextPara from '@/effects/ScrambleTextPara'
import GridColumn from '@/layout/GridColumn'
import Section from '@/layout/Section'
import React from 'react'

function Cta() {
  return (
  <div className="h-svh lg:h-[120svh] relative  flex items-center justify-center w-full ">
        <div className='w-full h-full absolute top-0 left-0 pb-[66.66% rounded-t-[1.5em] lg:rounded-t-[2em] shadow-xl shadow-black/30 overflow-clip'>
           <ParallaxImage initialScale={1.5} targetScale={1.15} className={"aspect-[4/6] object-[50%_100%]"} 
            src={'/images/shoe.png'} />
           <div className='w-full bg-black/45 h-full absolute top-0 left-0'/>
           </div>
           <Section padding={false} className='px-5 w-full h-full'  >
            <GridColumn gridLines className='w-full h-full relative flex items-center justify-center'>
    <div className='relative col-span-full col-start-1 md:col-span-full lg:col-span-8 lg:col-start-3 w-full h-full flex items-center justify-center'>
        <h1 className='text-display leading-[1] font-custom font-bold text-brand-white'>
            <ScrambleTextPara once={false}  duration={.8} className={"text-center leading-[1] capitalize"} text={"experience the better moments!"} />
        </h1>
    </div>

            </GridColumn>
           </Section>
      </div>
  )
}

export default Cta