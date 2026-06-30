"use client";

import React, {
  useState,
  useRef,
  useEffect,
  Children,
  cloneElement,
  useCallback,
  useMemo,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import useMouse from "@/hooks/useMouse";
import Link from "next/link";
import Image from "next/image";

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
  showInstructions = true,
}) {
  const [zoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);

  const canvasRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

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

  const childArray = useMemo(
    () => Children.toArray(children),
    [children]
  );

  const childCount = childArray.length;

  const getVisibleCards = useCallback(
    (posX, posY, zoomLevel, canvas) => {
      const vw = canvas?.offsetWidth || window.innerWidth;
      const vh = canvas?.offsetHeight || window.innerHeight;

      const buffer = Math.ceil(3 / zoomLevel);

      const startCol =
        Math.floor((-posX / zoomLevel - vw / 2) / cellWidth) -
        buffer;

      const endCol =
        Math.ceil((-posX / zoomLevel + vw / 2) / cellWidth) +
        buffer;

      const startRow =
        Math.floor((-posY / zoomLevel - vh / 2) / cellHeight) -
        buffer;

      const endRow =
        Math.ceil((-posY / zoomLevel + vh / 2) / cellHeight) +
        buffer;

      const cards = [];

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          cards.push({
            id: `${col}-${row}`,
            x: col * cellWidth + spacing / 2,
            y: row * cellHeight + spacing / 2,
            childIndex:
              Math.abs(col * 7 + row * 13) % childCount,
          });
        }
      }

      return cards;
    },
    [childCount, cellWidth, cellHeight, spacing]
  );

 useEffect(() => {
  let frame = null;

  const update = () => {
    if (frame) return;

    frame = requestAnimationFrame(() => {
      frame = null;

      setVisibleCards(
        getVisibleCards(
          x.get(),
          y.get(),
          zoom,
          canvasRef.current
        )
      );
    });
  };

  update();

  const unsubX = x.on("change", update);
  const unsubY = y.on("change", update);

  return () => {
    unsubX();
    unsubY();

    if (frame) {
      cancelAnimationFrame(frame);
    }
  };
}, [zoom, getVisibleCards]);
  // ---------- FIXED DRAG ----------

  const handlePointerDown = (e) => {
    if (!isActive) return;

    setDragStart({
      startX: e.clientX,
      startY: e.clientY,
      offsetX: x.get(),
      offsetY: y.get(),
      pointerId: e.pointerId,
    });

    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
  if (!dragStart || !isActive) return;

  const speed =
    e.pointerType === "touch"
      ? 1.8
      : 1;

  const dx =
    (e.clientX - dragStart.startX) *
    speed;

  const dy =
    (e.clientY - dragStart.startY) *
    speed;

  if (!isDragging) {
    if (Math.hypot(dx, dy) < 8) return;

    setIsDragging(true);

    e.currentTarget.setPointerCapture?.(
      dragStart.pointerId
    );
  }

  x.set(dragStart.offsetX + dx);
  y.set(dragStart.offsetY + dy);
};

  const handlePointerUp = () => {
    setDragStart(null);
    setIsDragging(false);
  };

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative overflow-hidden select-none",
        className
      )}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "pan-x pan-y",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
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
          onClick={() => setIsActive((v) => !v)}
          className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 text-xs bg-black/40 text-white rounded-full"
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
    <div onMouseEnter={()=>{setScale(true)}} onMouseLeave={()=>{setScale(false)}} className="relative md:h-svh lg:h-svh h-[86svh]  w-full">

    <InfiniteCanvas
      cardWidth={170}
      cardHeight={220}
      spacing={40}
      className="h-full bg-white w-full"
      showControls={false}
      showZoom={false}
      showInstructions={false}
      showStatus
    > 
    
     
 <Card className="bg-emerald400 p-2 overflow-hidden shadow">
        <Link draggable={false} href="/products">
          <img
            draggable={false}
            src="/images/prod-bag.jpg"
            className="w-full h-full aspect-[5/7] object-cover"
            alt=""
          />
        </Link>
      </Card>
       <Card className="bg-emerald400 p-2 overflow-hidden shadow">
        <Link draggable={false} href="/products">
          <img
            draggable={false}
            src="/images/prod-t-shirt.jpg"
            className="w-full h-full aspect-[5/7] object-cover"
            alt=""
          />
        </Link>
      </Card>
       <Card className="bg-emerald400 p-2 overflow-hidden shadow">
        <Link draggable={false} href="/products">
          <img
            draggable={false}
            src="/images/prod-cap.jpg"
            className="w-full h-full aspect-[5/7] object-cover"
            alt=""
          />
        </Link>
      </Card>
       <Card className="bg-emerald400 p-2 overflow-hidden shadow">
        <Link  draggable={false} href="/products">
          <Image width={400} height={400}
            draggable={false}
            src="/images/prod-hat.jpg"
            className="w-full h-full aspect-[5/7] object-cover"
            alt=""
          />
        </Link>
      </Card>
    </InfiniteCanvas>
    </div>
  );
}