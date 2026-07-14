import Link from 'next/link'
import React from 'react'

function IsEmpty({title,backto=''}) {
  return (
    <div className='h-svh flex items-center justify-center gap-6 flex-col'>
        <h2 className='text-display font-custom leading-[1]'>404</h2>
        <h2 className='text-heading2 font-body leading-[1] capitalize'>{title} is empty</h2>
             <Link href={`/${backto}`} className='font-body text-para underline'>back {backto}</Link>
    

    </div>
  )
}

export default IsEmpty