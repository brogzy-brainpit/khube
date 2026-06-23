import ScrambleText from '@/effects/ScrambleText';
import Section from '@/layout/Section';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react'

const Scene = dynamic(() => import("@/3D/Scene"), {
  ssr: false,
});
function Landing() {
  return (
    <div className='h-svh w-full relative  bg-emerald-100 fle items-center justify-center'>
        <img src="/images/red1.jpg" alt="Landing" className='h-full w-full absolute object-cover scale-[1] object-[center_18%]' />
        <Image fill src="/images/red1.jpg" alt="Landing" className='h-full w-full absolute object-cover scale-[1] object-[center_18%]' />
<Scene image="/images/red1.jpg" className='absolute top-0 left-0 w-full h-full' />
      <Section className={"relative h-full w-full"}>

<div className='absolute inset-0 flex items-end pb-6'>

 <h1 className='text-display leading-[1] relative text-left uppercase'>
              <ScrambleText
              addWidth={false}
              delay={2}
              text='LESS NOISE'
         letters='▚ ▜ ▞ ▃ ▄ ▛ ▟ ▘▅ ▖▙ ▄ ▞ ▚ ▆ ▜ ▘▖ ' 
        className={' text-green-50  font-custom2 tracking-[.012em]'}/> 
         <ScrambleText
              addWidth={false}
              delay={2}
              text='MORE STYLE'
         letters='▚ ▜ ▞ ▃ ▄ ▛ ▟ ▘▅ ▖▙ ▄ ▞ ▚ ▆ ▜ ▘▖ ' 
        className={' text-green-50  font-custom2 tracking-[.012em]'}/> 
        </h1>
</div>
      </Section>
    </div>
  )
}

export default Landing