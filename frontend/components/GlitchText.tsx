// One word in a headline that briefly glitches with a chromatic split every
// few seconds, then settles. Pure CSS (see .glitch-word in globals.css); the
// motion is disabled under prefers-reduced-motion.

export function GlitchText({ children }: { children: string }) {
  return (
    <span className="glitch-word" data-text={children}>
      {children}
    </span>
  );
}
