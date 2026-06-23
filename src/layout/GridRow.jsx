import React from 'react'

function GridRow({children,className=''}) {
  return (
  <div className={`${className} min-h-full grid grid-rows-2`}>
    {children}
  </div>
  )
}

export default GridRow