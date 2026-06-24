import React from 'react'

function Section({className,children,container=true,padding=true}) {
  return (
    <section className={` ${className} ${container?'container mx-auto':''}  ${padding?'px-5 pt-[6em] pb-[2em] lg:pt-[10em] lg:pb-[8em] ':''}`}>
      {children}
    </section>
  )
}

export default Section