import type { Transition, Variants } from "framer-motion";

export const easeOutSoft = [0.22, 1, 0.36, 1] as const;
export const springPress = { type: "spring", stiffness: 400, damping: 30 } as const;

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.24, ease: easeOutSoft } }
} as const;

export const gridStagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.04 } }
} as const;

export const motionTokens = {
  duration: {
    instant: 0.1,
    micro: 0.12,
    short: 0.2,
    fast: 0.16,
    base: 0.24,
    slow: 0.36,
    hero: 0.48
  },
  ease: {
    standard: [0.2, 0, 0, 1],
    emphasized: [0.2, 0, 0, 1.2],
    outSoft: [0.22, 1, 0.36, 1],
    out: [0.22, 1, 0.36, 1],
    in: [0.4, 0, 1, 1]
  }
} as const;

export const springs = {
  fast: { type: "spring", stiffness: 520, damping: 32 },
  base: { type: "spring", stiffness: 400, damping: 36 },
  press: { type: "spring", stiffness: 400, damping: 30 },
  gentle: { type: "spring", stiffness: 300, damping: 28 }
} satisfies Record<string, Transition>;

export const fadeUpContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04
    }
  }
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.base,
      ease: easeOutSoft
    }
  }
};

export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: motionTokens.duration.hero,
      ease: motionTokens.ease.emphasized
    }
  }
};

export const pressScale = {
  whileTap: { scale: 0.92 },
  transition: springs.press
};

export const sheetVariants: Variants = {
  closed: { y: "100%", opacity: 0 },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.ease.emphasized
    }
  }
};

export const countUpTransition: Transition = {
  duration: motionTokens.duration.base,
  ease: motionTokens.ease.out
};
