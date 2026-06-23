import { useEffect, useState } from 'react'
import {useSpring} from 'framer-motion'

function useMouse({start={x:0,y:0},stiffness=150,damping=20,mass:mass=0.1}) {
    // const [mousePosition,setMousePosition]=useState({x:0,y:0})
    const x=useSpring(start.x,{stiffness,damping,mass})
    const y=useSpring(start.y,{stiffness,damping,mass})


    const move=(e)=>{
        x.set(e.clientX)
        y.set(e.clientY)
        // setMousePosition({
        //     x:e.clientX,
        //     y:e.clientY,
        // })
    }
    useEffect(()=>{
window.addEventListener('mousemove',move);
return ()=>window.removeEventListener('mousemove',move)
    },[])
  return {x,y}
}

export default useMouse