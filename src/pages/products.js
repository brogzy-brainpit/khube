import ScaleOnExit from '@/effects/ScaleOnExit'
import React from 'react'

function products() {
  return (

    <div className='text-display min-h-svh flex items-center justify-center bg-brand-accent text-brand-black'>
       <ScaleOnExit className={"h-full w-full"}>
        <h1>products page</h1>
       </ScaleOnExit>
      </div>
  )
}

export default products