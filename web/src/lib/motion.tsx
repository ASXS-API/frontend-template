import { motion, AnimatePresence, type Variants } from 'motion/react'

export { motion, AnimatePresence }

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', bounce: 0.2, duration: 0.6 }
  },
}

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', bounce: 0.25, duration: 0.6 }
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', bounce: 0.2, duration: 0.5 }
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', bounce: 0.2, duration: 0.5 }
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', bounce: 0.25, duration: 0.5 },
  },
}

export const tableStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
  },
}

export const springTransition = {
  type: 'spring' as const,
  bounce: 0.2,
  duration: 0.6,
}

export const snappySpring = {
  type: 'spring' as const,
  bounce: 0.15,
  duration: 0.4,
}

export const pageTransition = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
  transition: { type: 'spring' as const, bounce: 0.15, duration: 0.45 },
}

export const cardHover = {
  whileHover: { scale: 1.02, y: -3, transition: { type: 'spring' as const, bounce: 0.3, duration: 0.3 } },
  whileTap: { scale: 0.98, transition: { type: 'spring' as const, bounce: 0.2, duration: 0.2 } },
}

export const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', bounce: 0.25, duration: 0.5 },
  },
}

export const sidebarContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.15 },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', bounce: 0.3, duration: 0.5 },
  },
}

export const tableRowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: 'easeOut' },
  },
}
