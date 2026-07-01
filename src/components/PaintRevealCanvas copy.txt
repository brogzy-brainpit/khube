'use client'

import useWindow from '@/hooks/useWindow';
import React, { useEffect, useRef } from 'react';

export default function PaintRevealCanvas() {
  const { dimension } = useWindow();

  const canvas = useRef(null);
  const prevPosition = useRef(null);

  useEffect(() => {
    if (dimension.width > 0 && canvas.current) {
      init();
    }
  }, [dimension]);

  const init = () => {
    const ctx = canvas.current.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, dimension.width, dimension.height);

    ctx.globalCompositeOperation = 'destination-out';
  };

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  const manageMouseMove = (e) => {
    const rect = canvas.current.getBoundingClientRect();

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const nbOfCircles = Math.max(
      1,
      Math.ceil(
        Math.max(
          Math.abs(e.movementX),
          Math.abs(e.movementY)
        ) / 10
      )
    );

    if (prevPosition.current) {
      const { x, y } = prevPosition.current;

      for (let i = 0; i < nbOfCircles; i++) {
        draw(
          lerp(x, clientX, i / nbOfCircles),
          lerp(y, clientY, i / nbOfCircles),
          50
        );
      }
    }

    prevPosition.current = {
      x: clientX,
      y: clientY,
    };
  };

  const draw = (x, y, radius) => {
    const ctx = canvas.current.getContext('2d');

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="relative w-full h-full">
      {dimension.width === 0 && (
        <div className="absolute inset-0 bg-black" />
      )}

      <canvas
        ref={canvas}
        width={dimension.width}
        height={dimension.height}
        onMouseMove={manageMouseMove}
      />
    </div>
  );
}