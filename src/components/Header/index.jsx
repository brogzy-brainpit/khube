'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion,AnimatePresence } from 'framer-motion';
import Nav from './nav';
import Rounded from '@/effects/RoundedButton';
import { customEase2 } from '../../../data';

export default function Index({ preLoaderOut, isLoading }) {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);

  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname]);
  return (
    <>
      <motion.div
        className="fixed right-0 z-[4] scale-100"
        initial={{ scale: 0 }}
        animate={{ scale: preLoaderOut?1:0 }}
        transition={{ delay:1.4,duration: 1, ease:customEase2 }}
      >
        <Rounded
          onClick={() => setIsActive(!isActive)}
          className="relative m-5 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-brand-secondary"
        >
          <div className="relative z-[1] w-full">

            {/* Top line */}
            <span
              className={`absolute left-1/2 h-[1px] w-[40%] -translate-x-1/2 bg-white transition-all duration-300 ${
                isActive
                  ? '-translate-y-0 rotate-45'
                  : '-translate-y-[5px]'
              }`}
            />

            {/* Bottom line */}
            <span
              className={`absolute left-1/2 h-[1px] w-[40%] -translate-x-1/2 bg-white transition-all duration-300 ${
                isActive
                  ? 'translate-y-0 -rotate-45'
                  : 'translate-y-[5px]'
              }`}
            />
          </div>
        </Rounded>
      </motion.div>

      <AnimatePresence mode="wait">
        {isActive && (
          <Nav
            setIsActive={setIsActive}
            isActive={isActive}
          />
        )}
      </AnimatePresence>
    </>
  );
}