"use client";

import React, { useEffect, useRef } from "react";

export default function MinimalHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setSize();

    type Particle = {
      x: number;
      y: number;
      speed: number;
      opacity: number;
      fadeDelay: number;
      fadeStart: number;
      fadingOut: boolean;
    };

    let particles: Particle[] = [];
    let raf = 0;

    const count = () => Math.floor((canvas.width * canvas.height) / 7000);

    const make = (): Particle => {
      const fadeDelay = Math.random() * 600 + 100;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() / 5 + 0.1,
        opacity: 0.65,
        fadeDelay,
        fadeStart: Date.now() + fadeDelay,
        fadingOut: false,
      };
    };

    const reset = (p: Particle) => {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
      p.speed = Math.random() / 5 + 0.1;
      p.opacity = 0.65;
      p.fadeDelay = Math.random() * 600 + 100;
      p.fadeStart = Date.now() + p.fadeDelay;
      p.fadingOut = false;
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < count(); i++) particles.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.speed;
        if (p.y < 0) reset(p);
        if (!p.fadingOut && Date.now() > p.fadeStart) p.fadingOut = true;
        if (p.fadingOut) {
          p.opacity -= 0.008;
          if (p.opacity <= 0) reset(p);
        }
        // Warm tint particles matching Merchat's #F4EDE8 palette
        ctx.fillStyle = `rgba(244, 237, 232, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, 0.6, Math.random() * 2 + 1);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="minimal-root">
      <style>{`
@import url('https://fonts.cdnfonts.com/css/hubot-sans');

.minimal-root, .minimal-root * {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.minimal-root {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  --bg: #0B1221;
  --fg: #F4EDE8;
  --muted: rgba(244,237,232,0.55);
  --border: #1A2B4A;
  --accent: #D5652B;
  background: var(--bg);
  color: var(--fg);
  font-family: 'Hubot Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
}

/* header */
.mh-header {
  position: absolute;
  top: 0; left: 0; right: 0;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.mh-brand {
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--fg);
  text-decoration: none;
}

.mh-brand span {
  color: var(--accent);
}

.mh-cta {
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  background: #D5652B;
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  line-height: 36px;
  cursor: pointer;
  transition: background 150ms;
}

.mh-cta:hover { background: #b54e20; }

/* hero center */
.mh-hero {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
  pointer-events: none;
}

.mh-kicker {
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #D5652B;
  margin-bottom: 14px;
  font-weight: 600;
}

.mh-title {
  font-weight: 700;
  font-size: clamp(34px, 8vw, 88px);
  line-height: 0.93;
  margin: 0;
  color: var(--fg);
}

.mh-title em {
  font-style: normal;
  color: #D5652B;
}

.mh-subtitle {
  margin: 20px auto 0;
  font-size: clamp(14px, 2.2vw, 18px);
  color: var(--muted);
  max-width: 500px;
  line-height: 1.6;
  text-align: center;
}

/* accent lines container */
.mh-accent-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mh-hline, .mh-vline {
  position: absolute;
  background: var(--border);
  opacity: .65;
  will-change: transform, opacity;
}

.mh-hline {
  height: 1px; left: 0; right: 0;
  transform: scaleX(0);
  transform-origin: 50% 50%;
  animation: mhDrawX 800ms cubic-bezier(.22,.61,.36,1) forwards;
}

.mh-hline:nth-child(1){ top: 20%; animation-delay: 150ms; }
.mh-hline:nth-child(2){ top: 50%; animation-delay: 280ms; }
.mh-hline:nth-child(3){ top: 80%; animation-delay: 410ms; }

.mh-vline {
  width: 1px; top: 0; bottom: 0;
  transform: scaleY(0);
  transform-origin: 50% 0%;
  animation: mhDrawY 900ms cubic-bezier(.22,.61,.36,1) forwards;
}

.mh-vline:nth-child(4){ left: 20%; animation-delay: 520ms; }
.mh-vline:nth-child(5){ left: 50%; animation-delay: 640ms; }
.mh-vline:nth-child(6){ left: 80%; animation-delay: 760ms; }

.mh-hline::after, .mh-vline::after {
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(90deg, transparent, rgba(213,101,43,.3), transparent);
  opacity:0;
  animation: mhShimmer 900ms ease-out forwards;
}

.mh-hline:nth-child(1)::after{ animation-delay: 150ms; }
.mh-hline:nth-child(2)::after{ animation-delay: 280ms; }
.mh-hline:nth-child(3)::after{ animation-delay: 410ms; }
.mh-vline:nth-child(4)::after{ animation-delay: 520ms; }
.mh-vline:nth-child(5)::after{ animation-delay: 640ms; }
.mh-vline:nth-child(6)::after{ animation-delay: 760ms; }

@keyframes mhDrawX {
  0% { transform: scaleX(0); opacity: 0; }
  60% { opacity: .85; }
  100% { transform: scaleX(1); opacity: .65; }
}

@keyframes mhDrawY {
  0% { transform: scaleY(0); opacity: 0; }
  60% { opacity: .85; }
  100% { transform: scaleY(1); opacity: .65; }
}

@keyframes mhShimmer {
  0% { opacity: 0; }
  30% { opacity: .35; }
  100% { opacity: 0; }
}

/* canvas */
.mh-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: .5;
}

/* CTA buttons */
.mh-cta-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 32px;
  pointer-events: auto;
}

.mh-btn-primary {
  height: 44px;
  padding: 0 24px;
  border-radius: 10px;
  background: #D5652B;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms, transform 150ms;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.mh-btn-primary:hover { background: #b54e20; transform: translateY(-1px); }
.mh-btn-primary:active { transform: translateY(0); }

.mh-btn-secondary {
  height: 44px;
  padding: 0 24px;
  border-radius: 10px;
  background: transparent;
  color: var(--fg);
  border: 1px solid rgba(244,237,232,0.25);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 150ms, background 150ms, transform 150ms;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.mh-btn-secondary:hover { border-color: rgba(244,237,232,0.55); background: rgba(244,237,232,0.06); transform: translateY(-1px); }
.mh-btn-secondary:active { transform: translateY(0); }
      `}</style>

      {/* Header */}
      <header className="mh-header">
        <a className="mh-brand" href="/" rel="noopener noreferrer">
          MER<span>CHAT</span>
        </a>
        <button
          className="mh-cta"
          type="button"
          onClick={() => (window.location.href = "/onboarding")}
        >
          Get started →
        </button>
      </header>

      {/* Particles */}
      <canvas ref={canvasRef} className="mh-canvas" />

      {/* Accent Lines */}
      <div className="mh-accent-lines">
        <div className="mh-hline" />
        <div className="mh-hline" />
        <div className="mh-hline" />
        <div className="mh-vline" />
        <div className="mh-vline" />
        <div className="mh-vline" />
      </div>

      {/* Hero */}
      <main className="mh-hero">
        <div>
          <div className="mh-kicker">AI-Powered WhatsApp Commerce</div>
          <h1 className="mh-title">
            Sell more.<br />
            On <em>WhatsApp.</em>
          </h1>
          <p className="mh-subtitle">
            Turn your WhatsApp into a fully-automated storefront — take orders,
            answer customer questions, and grow your business around the clock.
          </p>
          <div className="mh-cta-group">
            <a className="mh-btn-primary" href="/onboarding">
              Start for free →
            </a>
            <a className="mh-btn-secondary" href="#how-it-works">
              See how it works
            </a>
          </div>
        </div>
      </main>
    </section>
  );
}
