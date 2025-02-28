"use client";

import { useEffect, useRef } from "react";

interface FireworksProps {
  trigger: boolean;
}

class FireRocket {
  x: number;
  y: number;
  color: string;
  size: number;
  speedY: number;
  crackRocketY: number;
  trail: Array<{ x: number; y: number; size: number; alpha: number }>;

  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = window.innerHeight;
    this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    this.size = Math.random() * 3 + 2;
    this.speedY = Math.random() * 3 + 7;
    this.crackRocketY = Math.random() * (window.innerHeight / 2) + 50;
    this.trail = [];
  }

  update() {
    this.y -= this.speedY;
    this.trail.push({
      x: this.x,
      y: this.y,
      size: this.size * 0.8,
      alpha: 1,
    });
    if (this.trail.length > 5) this.trail.shift();
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.trail.forEach((particle, index) => {
      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.size * (0.8 - index / 10),
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `hsla(${this.color.split("(")[1].split(")")[0]}, ${
        0.5 - index / 10
      })`;
      ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class FireSparkle {
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  gravity: number;
  alpha: number;
  decay: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.color = `hsla(${color.split("(")[1].split(")")[0]}, 0.8)`;
    this.size = Math.random() * 4 + 2;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * (Math.random() * 3 + 2);
    this.vy = Math.sin(angle) * (Math.random() * 3 + 2);
    this.gravity = 0.08;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.015;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= this.decay;
    this.size *= 0.97;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.color.split("(")[1].split(")")[0]}, ${
      this.alpha
    })`;
    ctx.fill();
  }
}

export default function Fireworks({ trigger }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const rocketsRef = useRef<FireRocket[]>([]);
  const sparklesRef = useRef<FireSparkle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeHandler = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeHandler);
    resizeHandler();

    const animate = () => {
      if (!ctx) return;

      // Clear the canvas with a transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rocketsRef.current.forEach((rocket, index) => {
        rocket.update();
        rocket.draw(ctx);

        if (rocket.y <= rocket.crackRocketY) {
          const particles = Math.random() * 50 + 100;
          for (let j = 0; j < particles; j++) {
            sparklesRef.current.push(
              new FireSparkle(rocket.x, rocket.y, rocket.color)
            );
          }
          rocketsRef.current.splice(index, 1);
        }
      });

      sparklesRef.current.forEach((sparkle, index) => {
        sparkle.update();
        sparkle.draw(ctx);

        if (sparkle.alpha <= 0.01 || sparkle.size <= 0.1) {
          sparklesRef.current.splice(index, 1);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const launchInterval = setInterval(() => {
      if (trigger) {
        rocketsRef.current.push(new FireRocket());
      }
    }, Math.random() * 500 + 500);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      clearInterval(launchInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      rocketsRef.current = [];
      sparklesRef.current = [];
    };
  }, [trigger]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
}
