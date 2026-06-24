import styles from './style.module.scss';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { slide, scale } from '../../animation';

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
          className={'w-[10px] h-[10px] bg-brand-text rounded-[50%] absolute left-[-30px]'}>
        </motion.div>
        <Link onClick={()=>{setIsActive(!isActiv)}}
         className='font-custom-condensed text-footer leading-[1.1]  text-brand-text dartext-brand-text-dark duration-500 transition-colors'
          href={href}>
            {title}</Link>
      </motion.div>
    )
}