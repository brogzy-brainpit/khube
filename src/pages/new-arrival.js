import ScaleOnExit from '@/effects/ScaleOnExit'
import React from 'react'

function newArrival() {
  return (

    <div className='text-display min-h-svh flex items-center justify-center bg-brand-accent text-brand-black'>
       <ScaleOnExit className={"h-full w-full flex items-center justify-center"}>
        <h1>new-arrival page</h1>
       </ScaleOnExit>
      </div>
  )
}

export default newArrival