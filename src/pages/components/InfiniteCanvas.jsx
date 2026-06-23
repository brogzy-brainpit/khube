"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import React, {
  useState,
  useRef,
  useEffect,
  Children,
  cloneElement,
  useCallback,
  useMemo,
} from "react";
import useMouse from "@/hooks/useMouse";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export function Card({ className = "", children, x = 0, y = 0 }) {
  return (
    <div className={className} data-x={x} data-y={y}>
      {children}
    </div>
  );
}

export function InfiniteCanvas({
  className = "",
  children,
  cardWidth = 280,
  cardHeight = 220,
  spacing = 30,
  showControls = true,
  showZoom = true,
  showStatus = true,
  showInstructions = true,
}) {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);

  const canvasRef = useRef(null);

  // MOTION VALUES
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // SPRING
  const springX = useSpring(x, {
    stiffness: 100,
    damping: 25,
  });

  const springY = useSpring(y, {
    stiffness: 100,
    damping: 25,
  });

  const cellWidth = cardWidth + spacing;
  const cellHeight = cardHeight + spacing;

  const childArray = useMemo(() => Children.toArray(children), [children]);
  const childCount = childArray.length;

  const getVisibleCards = useCallback(
    (posX, posY, zoomLevel, canvas) => {
      const vw = canvas ? canvas.offsetWidth : window.innerWidth;
      const vh = canvas ? canvas.offsetHeight : window.innerHeight;

      const buffer = Math.ceil(3 / zoomLevel);

      const startCol =
        Math.floor((-posX / zoomLevel - vw / 2) / cellWidth) - buffer;

      const endCol =
        Math.ceil((-posX / zoomLevel + vw / 2) / cellWidth) + buffer;

      const startRow =
        Math.floor((-posY / zoomLevel - vh / 2) / cellHeight) - buffer;

      const endRow =
        Math.ceil((-posY / zoomLevel + vh / 2) / cellHeight) + buffer;

      const cards = [];

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const index = Math.abs(col * 7 + row * 13) % childCount;

          cards.push({
            id: `${col}-${row}`,
            x: col * cellWidth + spacing / 2,
            y: row * cellHeight + spacing / 2,
            childIndex: index,
          });
        }
      }

      return cards;
    },
    [childCount, cellWidth, cellHeight, spacing]
  );

  useEffect(() => {
    const update = () => {
      setVisibleCards(
        getVisibleCards(
          x.get(),
          y.get(),
          zoom,
          canvasRef.current
        )
      );
    };

    update();

    const unsubX = x.on("change", update);
    const unsubY = y.on("change", update);

    return () => {
      unsubX();
      unsubY();
    };
  }, [zoom, getVisibleCards]);

  const handleMouseDown = (e) => {
    if (!isActive) return;

    setIsDragging(true);

    setDragStart({
      x: e.clientX - x.get(),
      y: e.clientY - y.get(),
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isActive) return;

    x.set(e.clientX - dragStart.x);
    y.set(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (!isActive) return;

    e.preventDefault();

    setZoom((prev) =>
      Math.max(
        0.5,
        Math.min(100, prev - e.deltaY * 0.0008)
      )
    );
  };

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative overflow-hidden select-none",
        className
      )}
      style={{
        cursor: isActive
          ? isDragging
            ? "grabbing"
            : "grab"
          : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* WORLD */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          scale: zoom,
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
        }}
      >
        {visibleCards.map((card) => {
          const child = childArray[card.childIndex];

          return (
            <div
              key={card.id}
              className="absolute"
              style={{
                transform: `translate(${card.x}px, ${card.y}px)`,
                width: cardWidth,
                height: cardHeight,
              }}
            >
              {React.isValidElement(child)
                ? cloneElement(child, {
                    x: card.x,
                    y: card.y,
                  })
                : child}
            </div>
          );
        })}
      </motion.div>

      {showInstructions && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-2 bg-black/40 text-white rounded-full">
          Drag • Scroll to zoom
        </div>
      )}

      {showZoom && (
        <div className="absolute top-4 right-4 text-xs px-3 py-1 bg-black/40 text-white rounded-full">
          {Math.round(zoom * 100)}%
        </div>
      )}

      {showControls && (
        <button
          className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 text-xs bg-black/40 text-white rounded-full"
          onClick={() => setIsActive((v) => !v)}
        >
          {isActive ? "Disable" : "Enable"}
        </button>
      )}
    </div>
  );
}

export default function InfiniteCanvasDemo() {
   const [scale,setScale]=useState(false)
   const {x,y}=useMouse({start:{x:480,y:300},stiffness:140,damping:18,mass:0.1})
  const newX= useTransform(x,x=>x-50)
  const newY= useTransform(y,x=>x-50)
  return (
    <div onMouseEnter={()=>{setScale(true)}} onMouseLeave={()=>{setScale(false)}} className="relative h-sv h-[300px] w-full">
<motion.div  animate={{scale:scale?1:0}} style={{x:newX,y:newY,scale:0}} className='z-preloader font-body pointer-events-none  text-brand-black font-medium capitalize mixblend-difference fixed flex flex-col gap-4 items-center justify-center top-0 left-0 h-[120px] w-[120px] '>

<div className=" bg-brand-white rounded-2xl top-0 left-0 w-full h-[20px] flex items-center justify-center">
  drag
</div>
<div className=" bg-brand-accent font-body text-para text-brand-white flex items-center justify-center text-center rounded-full top-0 left-0 size-[90px]">
  view product
</div>

          </motion.div>
    <InfiniteCanvas
      cardWidth={170}
      cardHeight={220}
      spacing={40}
      className="h-[500px] -svh bg-white w-full"
    > 
      <Card className="bg-emerald-400 p-2 overflow-hidden shadow">
        <Link draggable={false} href="/">
          <img
            draggable={false}
            src="/images/red6.jpg"
            className="w-full h-full"
            alt=""
          />
        </Link>
      </Card>

      <Card className="bg-emerald-400 p-2 overflow-hidden shadow">
        <img
          draggable={false}
          src="/images/red2.jpg"
          className="w-full h-full"
          alt=""
        />
      </Card>

      <Card className="bg-emerald-400 p-2 overflow-hidden shadow">
        <img
          draggable={false}
          src="/images/red3.jpg"
          className="w-full h-full"
          alt=""
        />
      </Card>
    </InfiniteCanvas>
    </div>
  );
}