"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

const CYCLE_MS = 4000;

function ScoreMockup() {
  return (
    <div className="space-y-2.5">
      <div className="rounded-xl border border-[var(--accent)] bg-[var(--surface)] p-3 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate font-mono text-[11px] text-[var(--muted)]">
            payment_processor.py
          </p>
          <span className="shrink-0 font-mono text-[10px] text-[var(--muted)]">#128</span>
        </div>
        <p className="mt-1 truncate text-xs font-semibold text-[var(--foreground)]">
          Fix retry logic in payments
        </p>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
            Risk score
          </span>
          <span className="font-mono text-xs font-semibold text-[var(--accent-strong)]">82</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.1]">
          <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: "82%" }} />
        </div>
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-strong)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
          Interview triggered
        </div>
      </div>
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)]/60 p-3 opacity-70">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-xs font-semibold text-[var(--foreground)]">
            Update README typo
          </p>
          <span className="shrink-0 font-mono text-[10px] text-[var(--muted)]">score 6</span>
        </div>
        <div className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          <span aria-hidden>&#10003;</span>
          Skipped
        </div>
      </div>
    </div>
  );
}

function CaptureMockup() {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
          Question 2 of 3
        </p>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--danger)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" aria-hidden />
          Recording
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold leading-5 text-[var(--foreground)]">
        Why remove the automatic retry instead of adding a delay?
      </p>
      <div className="relative mt-3 flex items-center gap-2">
        <span className="wash-live" aria-hidden />
        <span className="relative z-[1] waveform" aria-hidden>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((bar) => (
            <span
              key={bar}
              className="waveform-bar"
              style={{ animationDelay: `${bar * 0.12}s` }}
            />
          ))}
        </span>
      </div>
      <p className="mt-3 border-l-2 border-[var(--card-border)] pl-2.5 text-[11px] italic leading-5 text-[var(--muted)]">
        &ldquo;Retries were firing before the gateway confirmed the failure, so under load we
        double charged customers.&rdquo;
      </p>
    </div>
  );
}

function AnswerMockup() {
  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <div className="rounded-xl bg-[var(--ink)] px-3 py-2 text-xs text-[var(--ink-foreground)]">
          Why did we change retry handling?
        </div>
      </div>
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface)] px-3 py-2.5 text-xs leading-5 text-[var(--foreground)] shadow-[var(--shadow)]">
        Removed automatic retries after duplicate charges under high load.
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-2)] px-2 py-1 font-mono text-[10px] text-[var(--accent-strong)]">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[8px] font-semibold text-white">
              A
            </span>
            PR #47 &middot; Aryan &middot; Aug 14, 2026
          </span>
          <span className="rounded-lg bg-black/[0.06] px-2 py-1 font-mono text-[10px] text-[var(--muted)] dark:bg-white/[0.08]">
            2 linked decisions
          </span>
        </div>
      </div>
    </div>
  );
}

type Feature = {
  keyword: string;
  /** short workflow label used in the progression rail */
  shortLabel: string;
  /** the sentence fragment that follows this keyword */
  tail: string;
  number: string;
  title: string;
  description: string;
  mockup: ReactNode;
};

const FEATURES: Feature[] = [
  {
    keyword: "scores",
    shortLabel: "Score",
    tail: " the PRs that matter, ",
    number: "01",
    title: "Score what matters",
    description:
      "Scores every diff against sensitive paths, new files, and dependency bumps. Only real risk triggers an interview.",
    mockup: <ScoreMockup />
  },
  {
    keyword: "captures",
    shortLabel: "Interview",
    tail: " the reasoning by voice, and later ",
    number: "02",
    title: "Capture the reasoning",
    description:
      "Answer three AI generated questions by voice while the PR is still fresh. No forms, no forgetting the call you made.",
    mockup: <CaptureMockup />
  },
  {
    keyword: "answers",
    shortLabel: "Receipts",
    tail: " why the code is the way it is.",
    number: "03",
    title: "Answer with receipts",
    description:
      "Every answer is grounded in a stored decision and cited by PR, author, and date. Never a guess.",
    mockup: <AnswerMockup />
  }
];

export function FeatureShowcase() {
  // `active` keeps auto-advancing on its own timer no matter what the
  // cursor is doing. `hovered` is a display-only override: while a card is
  // hovered it takes over as the shown card, and the moment the cursor
  // leaves, the display falls back to `active` — wherever the cycle has
  // gotten to in the background, not where it was when the hover started.
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const displayed = hovered ?? active;

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Only start the highlight cycle once the section scrolls into view, and start
  // it from the first keyword — so the reveal lines up with the scroll instead
  // of the cycle already being mid-way through when you arrive.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setActive(0);
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FEATURES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [inView, reduceMotion]);

  return (
    <div ref={rootRef}>
      <ScrollReveal>
        <h2 className="max-w-3xl text-2xl leading-[1.3] text-[var(--foreground)]/75 sm:text-3xl lg:text-4xl">
          Codence{" "}
          {FEATURES.map((feature, index) => {
            const isActive = index === displayed;
            return (
              <span key={feature.keyword}>
                <span
                  className={`mr-0.5 inline-block rounded px-1 py-0 align-baseline font-semibold leading-[1] [box-decoration-break:clone] [-webkit-box-decoration-break:clone] transition-colors duration-500 ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                      : "bg-black/[0.05] text-[var(--foreground)] dark:bg-white/[0.08]"
                  }`}
                >
                  {feature.keyword}
                </span>
                {feature.tail}
              </span>
            );
          })}
        </h2>
      </ScrollReveal>

      <div className="mt-7 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_1.12fr_1fr] lg:gap-8">
        {FEATURES.map((feature, index) => {
          const isActive = index === displayed;
          return (
            <ScrollReveal key={feature.number} delayMs={index * 120}>
              <div
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={`flex h-full flex-col gap-4 transition-opacity duration-500 ${
                  isActive ? "opacity-100" : "opacity-40"
                }`}
              >
                <div
                  className={`flex h-60 flex-col justify-center rounded-2xl border bg-[#f5f4f2] p-3.5 transition-all duration-500 dark:bg-[var(--surface-2)] sm:h-64 ${
                    isActive
                      ? "-translate-y-1 border-[var(--accent)] shadow-[0_2.8px_2.2px_rgba(0,0,0,0.034),0_6.7px_5.3px_rgba(0,0,0,0.048),0_12.5px_10px_rgba(0,0,0,0.06),0_22.3px_17.9px_rgba(0,0,0,0.072),0_41.8px_33.4px_rgba(0,0,0,0.086),0_100px_80px_rgba(0,0,0,0.12)]"
                      : "border-[var(--card-border)]"
                  }`}
                >
                  {feature.mockup}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-semibold tracking-[0.2em] transition-colors duration-500 ${
                        isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"
                      }`}
                    >
                      {feature.number}
                    </span>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground)]/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
