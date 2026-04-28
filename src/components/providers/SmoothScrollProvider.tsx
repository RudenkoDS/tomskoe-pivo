"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, duration: 1.2, smoothWheel: true, syncTouch: false });
    let rafId = 0;
    const raf = (t: number) => { lenis.raf(t); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
