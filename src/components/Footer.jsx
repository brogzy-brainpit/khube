import ScrambleText from '@/effects/ScrambleText'
import GridColumn from '@/layout/GridColumn'
import Section from '@/layout/Section'
import { Facebook, Instagram } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { accentColor } from '../../data'
import Logo from './Logo'

function Footer() {
  return (
    <div className='bg-brand-black min-hsvh'>
      <Section padding={false} className={'h-full px-[.625rem] pt-20 pb-5 lg:pt-10 lg:pb-4 '}>
       <GridColumn className='bg-brand-white py-10 px-[.625rem] h-full rounded-3xl '>
        
         <div className="col-span-3 flex gap-2 flex-col">
          <h2 className='font-body w-fit text-para uppercase text-brand-black font-bold mb-2 py-[5px]'> Company</h2>
          <Link href={'/'} className='font-body text-para capitalize text-brand-black'>
          <ScrambleText delay={.2}  once={false} colorBlock={accentColor} text={'About'} trigger={true}/>
          </Link>
          <Link href={'/'} className='font-body text-para capitalize text-brand-black'><ScrambleText delay={.4} once={false} colorBlock={accentColor} text={'Projects'} trigger={true}/></Link>
          <Link href={'/'} className='font-body text-para capitalize text-brand-black'> <ScrambleText delay={.6} once={false} colorBlock={accentColor} text={'Gallery'} trigger={true}/></Link>
          <Link href={'/'} className='font-body text-para capitalize text-brand-black'> <ScrambleText delay={.8} once={false} colorBlock={accentColor} text={'privacy policy'} trigger={true}/></Link>
        </div>
          <div className="col-span-3 flex gap-2 flex-col">
          <h2 className='font-body w-fit text-para uppercase text-brand-black font-bold mb-2 py-[5px]'>Links</h2>
          <Link href={'/'} className='font-body text-para capitalize text-brand-black'><ScrambleText delay={.2} once={false} colorBlock={accentColor} text={'Products'} trigger={true}/></Link>
          <Link href={'/'} className='font-body text-para capitalize text-brand-black'><ScrambleText delay={.4} once={false} colorBlock={accentColor} text={'Collections'} trigger={true}/></Link>
          <Link href={'/'} className='font-body text-para capitalize text-brand-black'> <ScrambleText delay={.6} once={false} colorBlock={accentColor} text={'About us'} trigger={true}/></Link>
          <Link href={'/'} className='font-body text-para capitalize text-brand-black'> <ScrambleText delay={.8} once={false} colorBlock={accentColor} text={'New Arrivals'} trigger={true}/></Link>
        </div>
        
        <div className="col-span-3 py-6 flex  flex-col lg:justify-end b-red-600">
          <h2 className='font-body w-fit text-para uppercase bg-brand-black text-brand-white px-[5px]'>visit us</h2>
          <h2 className='font-body text-para text-brand-black py-1'>123, Street, PA</h2>
          <h2 className='font-body text-para text-brand-black py-1'>456 State, Miami, FL</h2>
        </div>
        <div className="col-span-3 py-6 flex flex-col lg:justify-end">
          <div className='flex gap-2'>
            <Facebook className='text-brand-black '/>
            <Instagram/>
          </div>
          <h2 className='font-body text-para text-brand-black p-2'>email@domain.com</h2>
        </div>
        <div className="col-span-3 py-6 flex flex-col lg:justify-end">
          
          <h2 className='font-body text-para uppercase text-brand-black p-2'><sup>&copy;</sup> Allright reserved</h2>
        </div>
        <div className="col-span-3 lg:col-start-10 py-6 flex flex-col lg:tems-end lg:justify-end">
        
          <h2 className='font-body text-para capitalize text-brand-black p-2'>site by <Link className='underline capitalize' target='_blank' href={'https://www.instagram.com/memet_lab'}>memet</Link></h2>
        </div>
       </GridColumn>
<Logo fill='#000000' width={"100%"} className={'w-full'}/>
      </Section>



    </div>
  )
}

export default Footer