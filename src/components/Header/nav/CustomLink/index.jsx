import styles from './style.module.scss';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { slide, scale } from '../../animation';
import ScrambleText from '@/effects/ScrambleText';

export default function Index({data, isActive,isActiv,setIsActive, setSelectedIndicator}) {
  
    const { title, href, index} = data;
  
    return (
      <motion.div 
        className={styles.link} 
        onMouseEnter={() => {setSelectedIndicator(href)}} 
        custom={index} 
        variants={slide} 
        initial="initial" 
        animate="enter" 
        exit="exit"
        
      >
        <motion.div 
          variants={scale} 
          animate={isActive ? "open" : "closed"}
          className={'w-[.25em] h-[.25em] bg-brand-white rounded-[50%] absolute left-[-30px]'}>
           
        </motion.div>
        <Link onClick={()=>{setIsActive(!isActiv)}}
         className='font-custom text-footer leading-[.9] capitalize  text-brand-white'
          href={href}>
            <ScrambleText duration={.4} hoverEffect delay={0.4 + (index * 0.2)} text={title} />
            </Link>
      </motion.div>
    )
}