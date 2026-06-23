"use client";

import Link from "next/link";
import {motion} from "framer-motion";
import React, {
  useState,
  useRef,
  useEffect,
  Children,
  cloneElement,
  useCallback,
  useMemo,
} from "react";

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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const cellWidth = cardWidth + spacing;
  const cellHeight = cardHeight + spacing;

  const childArray = useMemo(() => Children.toArray(children), [children]);
  const childCount = childArray.length;

  const getVisibleCards = useCallback(
    (pos, zoomLevel, canvas) => {
      const vw = canvas ? canvas.offsetWidth : window.innerWidth;
      const vh = canvas ? canvas.offsetHeight : window.innerHeight;

      const buffer = Math.ceil(3 / zoomLevel);

      const startCol =
        Math.floor((-pos.x / zoomLevel - vw / 2) / cellWidth) - buffer;
      const endCol =
        Math.ceil((-pos.x / zoomLevel + vw / 2) / cellWidth) + buffer;

      const startRow =
        Math.floor((-pos.y / zoomLevel - vh / 2) / cellHeight) - buffer;
      const endRow =
        Math.ceil((-pos.y / zoomLevel + vh / 2) / cellHeight) + buffer;

      const cards = [];

      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          const index = Math.abs(x * 7 + y * 13) % childCount;

          cards.push({
            id: `${x}-${y}`,
            x: x * cellWidth + spacing / 2,
            y: y * cellHeight + spacing / 2,
            childIndex: index,
          });
        }
      }

      return cards;
    },
    [childCount, cellWidth, cellHeight, spacing]
  );

  useEffect(() => {
    setVisibleCards(getVisibleCards(position, zoom, canvasRef.current));
  }, [position, zoom, getVisibleCards]);

  const handleMouseDown = (e) => {
    if (!isActive) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isActive || !isDragging) return;

    const x = e.clientX - dragStart.x;
    const y = e.clientY - dragStart.y;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setPosition({ x, y });
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    if (!isActive) return;
    e.preventDefault();

    const newZoom = Math.max(
      0.4,
      Math.min(100, zoom - e.deltaY * 0.0008)
    );

    setZoom(newZoom);
  };

  return (
    <div
      ref={canvasRef}
      className={cn("relative overflow-hidden select-none", className)}
      style={{
        cursor: isActive ? (isDragging ? "grabbing" : "grab") : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* world */}
      <motion.div
       animate={{
    x: position.x,
    y: position.y,
    scale: zoom,
  }}
  transition={{
    type: "spring",
    stiffness: 220,
    damping: 25, // 2 is extremely low and looks broken
  }}
  style={{
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
            <motion.div
              key={card.id}
              className="absolute"
               transition={{type:'spring',stiffness:120,damping:2}}
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
            </motion.div>
          );
        })}
      </motion.div>

      {/* UI */}
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
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "Disable" : "Enable"}
        </button>
      )}
    </div>
  );
}



export default function InfiniteCanvasDemo() {
  return (
    <InfiniteCanvas
    cardWidth={170}
    cardHeight={220}
    spacing={40}
    className="h-[500px] bg-white w-full">
      <Card className="bg-emerald-400   p-2 overflow-hidden shadow">
        <div className='h-full w-full overflow-hidden'>
          <Link draggable={false} href={"/"}>
          <img draggable={false}
            src='/images/red6.jpg'
            className='w-full h-full'
            alt=''
          /></Link>
        </div>
      </Card>

        <Card className="bg-emerald-400   p-2 overflow-hidden shadow">
        <div className='h-full w-full overflow-hidden'>
          <img draggable={false}
            src='/images/red2.jpg'
            className='w-full h-full'
            alt=''
          />
        </div>
      </Card>
      <Card className="bg-emerald-400   p-2 overflow-hidden shadow">
        <div className='h-full w-full overflow-hidden'>
          <img draggable={false}
            src='/images/red3.jpg'
            className='w-full h-full'
            alt=''
          />
        </div>
      </Card>

    </InfiniteCanvas>
  );
}