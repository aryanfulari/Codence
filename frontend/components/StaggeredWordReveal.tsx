"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type StaggeredWordRevealProps = {
  text: string;
  className?: string;
};

// Editorial word-by-word reveal (per the staggered-word-reveal skill):
// words fade + rise into place, staggered, the first time the text enters
// the viewport — once only, not scroll-linked. Words (not letters) animate,
// for a calmer, more premium feel than a per-character effect.
//
// Words are kept as separate inline-block spans with a plain text-node
// space between them (not inside any span) so the browser can still wrap
// the line normally — a lone space char inside its own inline-block
// collapses to zero width, which is what broke an earlier per-character
// component (components/v1/skiper58.tsx) until that was fixed.
export function StaggeredWordReveal({ text, className = "" }: StaggeredWordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");
  const shouldAnimate = visible && !reduceMotion;

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <motion.span
            aria-hidden="true"
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={shouldAnimate || reduceMotion ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
            style={reduceMotion ? { opacity: 1, transform: "none" } : undefined}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
