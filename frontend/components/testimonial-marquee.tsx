"use client";

import { useEffect, useState } from "react";
import { testimonials, type Testimonial } from "@/lib/testimonials";

// Autoplay pace for the highlighted testimonial. This keeps running in the
// background at all times, even while a card is hovered — hover only
// overrides which card is *shown* as active, it never stops the cycle.
const INTERVAL_MS = 4000;
const TRANSITION_MS = 700;

// Shortest signed distance from `index` to `center` around the loop, e.g.
// with 6 items, index 5 sits at offset -1 from center 0, not +5. Cards more
// than 2 steps away aren't rendered at all.
function loopOffset(index: number, center: number, length: number) {
  let diff = index - center;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

function TestimonialCard({
  testimonial,
  highlighted
}: {
  testimonial: Testimonial;
  highlighted: boolean;
}) {
  return (
    <div
      className={`flex h-56 w-72 flex-col justify-between rounded-2xl border p-6 transition-colors duration-700 sm:w-80 ${
        highlighted
          ? "border-[var(--accent)] bg-[var(--surface)] shadow-[var(--shadow)]"
          : "border-[var(--card-border)] bg-[var(--surface)]"
      }`}
    >
      <p className="line-clamp-4 text-base leading-7 text-[var(--foreground)]">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">{testimonial.name}</p>
          <p className="text-xs text-[var(--muted)]">{testimonial.role}</p>
        </div>
        <p className="font-mono text-xs text-[var(--accent)]">{testimonial.repo}</p>
      </div>
    </div>
  );
}

export function TestimonialMarquee() {
  // `active` keeps auto-advancing on its own timer no matter what the
  // cursor is doing. `hovered` is a display-only override: while a card is
  // hovered it takes over as the shown center, and the moment the cursor
  // leaves, the display falls back to `active` — wherever the cycle has
  // gotten to in the background, not where it was when the hover started.
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const length = testimonials.length;
  const displayed = hovered ?? active;

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [length]);

  return (
    <div className="relative h-64 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] sm:h-72">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {testimonials.map((testimonial, index) => {
          const offset = loopOffset(index, displayed, length);
          const distance = Math.abs(offset);
          if (distance > 2) return null;

          const isActive = offset === 0;
          const scale = isActive ? 1 : distance === 1 ? 0.86 : 0.74;
          const opacity = isActive ? 1 : distance === 1 ? 0.55 : 0.22;
          const translateX = offset * 19.5;

          return (
            <div
              key={index}
              className="absolute"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              style={{
                transform: `translateX(${translateX}rem) scale(${scale})`,
                opacity,
                zIndex: 10 - distance,
                transition: `transform ${TRANSITION_MS}ms ease, opacity ${TRANSITION_MS}ms ease`
              }}
            >
              <TestimonialCard testimonial={testimonial} highlighted={isActive} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
