import React from 'react'
import { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';
import Magnetic from '../Magnetic';

export default function Index({children, backgroundColor="#1c2218", ...attributes}) {

  const circle = useRef(null);
  let timeline = useRef(null);
  let timeoutId = null;
  useEffect( () => {
    timeline.current = gsap.timeline({paused: true})
    timeline.current
      .to(circle.current, {top: "-25%", width: "150%", duration: 0.4, ease: "power3.in"}, "enter")
      .to(circle.current, {top: "-150%", width: "125%", duration: 0.25}, "exit")
  }, [])
  
  const manageMouseEnter = () => {
    if(timeoutId) clearTimeout(timeoutId)
    timeline.current.tweenFromTo('enter', 'exit');
  }

  const manageMouseLeave = () => {
    timeoutId = setTimeout( () => {
      timeline.current.play();
    }, 300)
  }

  return (
    <Magnetic>
      <div className={`${styles.roundedButton} bg-brand-text  -rotate-45 flex justify-center items-center h-[35px] w-[35px] rounded-full `} style={{overflow: "hidden",backgroundColor}} onMouseEnter={() => {manageMouseEnter()}} onMouseLeave={() => {manageMouseLeave()}} {...attributes}>
          {
            children
          }
        <div ref={circle} className={`${styles.circle}  bg-brand-secondary `}></div>
      </div>
    </Magnetic>
  )
}
