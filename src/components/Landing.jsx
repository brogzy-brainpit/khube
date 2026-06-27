import ScaleOnExit from '@/effects/ScaleOnExit';
import ScrambleText from '@/effects/ScrambleText';
import ScrambleTextPara from '@/effects/ScrambleTextPara';
import Section from '@/layout/Section';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react'

const Scene = dynamic(() => import("@/3D/Scene"), {
  ssr: false,
});
function Landing({preLoaderOut}) {
  return (
    <div className='h-svh w-full relative  bg-emerald-100 fle items-center justify-center'>
      <ScaleOnExit preLoaderOut={preLoaderOut} className={"h-full w-full"}>

        <img src="/images/red1.jpg" alt="Landing" className='h-full w-full absolute object-cover scale-[1] object-[center_18%]' />
        <Image fill src="/images/red1.jpg" alt="Landing" className='h-full w-full absolute object-cover scale-[1] object-[center_18%]' />
{/* <Scene image="/images/red1.jpg" className='absolute top-0 left-0 w-full h-full' /> */}
      <Section className={"relative h-full w-full"}>

<div className='h-full flex items-end pb-[12em] lg:pb-[4em]'>

 <h1 className=' flex flex-col leading-[1] relative text-left uppercase'>
              <ScrambleText
              addWidth={false}
              delay={2}

              tet='No NOISE'
               text='No NOISE'
         letter='▚ ▜ ▞ ▃ ▄ ▛ ▟ ▘▅ ▖▙ ▄ ▞ ▚ ▆ ▜ ▘▖ ' 
        className={' text-green-50 text-heading3 mb-6  font-custom tracking-[.012em]'}/> 
         <ScrambleTextPara
              addWidth={false}
              delay={2}
              tex='MORE STYLE'
              text='just vibes'
         letter='▚ ▜ ▞ ▃ ▄ ▛ ▟ ▘▅ ▖▙ ▄ ▞ ▚ ▆ ▜ ▘▖ ' 
        className={' text-green-50 text-display  font-custom tracking-[.012em]'}/> 
        </h1>
</div>
      </Section>
      </ScaleOnExit>
    </div>
  )
}

export default Landing