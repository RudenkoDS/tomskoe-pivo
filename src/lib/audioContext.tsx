"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface AudioCtx {
  muted: boolean;
  setMuted: (v: boolean) => void;
}

const AudioContext = createContext<AudioCtx>({ muted: false, setMuted: () => {} });

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  return (
    <AudioContext.Provider value={{ muted, setMuted }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
