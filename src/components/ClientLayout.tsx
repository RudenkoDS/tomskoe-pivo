"use client";
import { AudioProvider } from "@/lib/audioContext";
import { ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
