"use client";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 20 } },
};

type P = { children: ReactNode; className?: string };

export function AnimatedSection({ children, className = "" }: P) {
  return (
    <motion.div className={className} variants={containerVariants} initial="hidden"
      whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children, className = "" }: P) {
  return <motion.div className={className} variants={itemVariants}>{children}</motion.div>;
}
