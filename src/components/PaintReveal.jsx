import React from 'react'
import PaintRevealCanvas from './PaintRevealCanvas'

function PaintReveal() {
  return (
     <div className="flex relativ w-full h-screen items-center justify-center">
          <div className="absolute flex flex-col text-[5.5vw] uppercase w-[80vw] items-start leading-tight">
      <p>Olivier Larose</p>
      <p className="self-end">Front End Developer</p>
      <p>Based in Montreal</p>
      <p className="self-end">Portfolio@2024</p>
    </div>
          <PaintRevealCanvas/>
        </div>
  )
}

export default PaintReveal