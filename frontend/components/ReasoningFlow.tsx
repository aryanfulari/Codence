"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

// The path from a merged PR to an answer you can trust. Styled after a
// converge / process / fan-out data-flow diagram: raw inputs on the left,
// the four things Codence does in the middle, and the places that knowledge
// resurfaces on the right. Below it, a split showing what one stored decision
// looks like next to the decisions board.

const VIEW_W = 1000;
const VIEW_H = 520;
const CY = 260;
const PETAL_MS = 1800;

type Source = { label: string; icon: ReactNode };

const SOURCES: Source[] = [
  { label: "Pull request", icon: <IconMerge /> },
  { label: "Changed files", icon: <IconDiff /> },
  { label: "File paths", icon: <IconFolder /> },
  { label: "Commit title", icon: <IconTag /> },
  { label: "New files", icon: <IconPlus /> },
  { label: "Dependencies", icon: <IconPackage /> },
  { label: "PR author", icon: <IconUser /> }
];

const DESTINATIONS = ["Why chat", "PR citations", "Code review", "Onboarding", "Any question"];

const PETALS = [
  { label: "Score", shift: "-translate-y-[3.4rem]", nudge: "-mt-[3.5rem]" },
  { label: "Interview", shift: "-translate-x-[3.4rem]", nudge: "-ml-[3.6rem]" },
  { label: "Store", shift: "translate-y-[3.4rem]", nudge: "mt-[3.5rem]" },
  { label: "Retrieve", shift: "translate-x-[3.4rem]", nudge: "ml-[3.6rem]" }
];

const STAGES = [
  {
    label: "Score",
    blurb:
      "Every diff is scored against sensitive paths, new files, and dependency bumps. Only real risk clears the bar."
  },
  {
    label: "Interview",
    blurb: "If it clears the bar, you answer three AI generated questions by voice while the PR is still fresh."
  },
  {
    label: "Store",
    blurb:
      "Your summarized reasoning plus an embedding is written to a vector index, keyed to the pull request."
  },
  {
    label: "Retrieve",
    blurb: "Every why question runs a similarity search over those records and answers with citations."
  }
];

const leftY = (i: number) => 60 + i * (400 / (SOURCES.length - 1));
const rightY = (i: number) => 90 + i * (340 / (DESTINATIONS.length - 1));
// Cable routing: a long flat run out of the pill, then a rounded bend into a
// tight parallel bundle at the diamond edge.
const leftPath = (i: number) => {
  const y = leftY(i);
  const ty = CY + (i - (SOURCES.length - 1) / 2) * 3;
  return `M210 ${y} C 372 ${y}, 344 ${ty}, 404 ${ty}`;
};
const rightPath = (i: number) => {
  const y = rightY(i);
  const ty = CY + (i - (DESTINATIONS.length - 1) / 2) * 3;
  return `M596 ${ty} C 656 ${ty}, 628 ${y}, 790 ${y}`;
};

export function ReasoningFlow() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % PETALS.length), PETAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div className="mx-auto w-full">
      <ScrollReveal>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent-strong)]">
            Where your reasoning goes
          </p>
          <h2 className="mt-3 text-2xl leading-[1.3] text-[var(--foreground)] sm:text-3xl lg:text-4xl">
            One interview at merge time. A cited answer every time someone asks why.
          </h2>
        </div>
      </ScrollReveal>

      {/* Wide screens: the full converge / process / fan-out diagram */}
      <ScrollReveal>
        <div className="relative mt-8 hidden h-[32rem] md:block">
          {/* green to lime radial bloom behind the centre */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(circle at 50% 34%, rgba(74,177,120,0.55), rgba(74,177,120,0) 58%), radial-gradient(circle at 50% 68%, rgba(199,214,80,0.45), rgba(199,214,80,0) 52%)",
              filter: "blur(46px)"
            }}
          />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            fill="none"
            preserveAspectRatio="none"
          >
            {SOURCES.map((s, i) => (
              <path
                key={s.label}
                d={leftPath(i)}
                style={{ stroke: "var(--wire)" }}
                strokeWidth={1.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {DESTINATIONS.map((d, i) => (
              <path
                key={d}
                d={rightPath(i)}
                style={{ stroke: "var(--wire)" }}
                strokeWidth={1.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {!reduceMotion &&
              SOURCES.map((s, i) => (
                <circle key={`fl-${s.label}`} r={2.6} fill="#3aa76e" opacity={0.85}>
                  <animateMotion
                    dur={`${3 + (i % 3) * 0.5}s`}
                    begin={`${i * 0.4}s`}
                    repeatCount="indefinite"
                    path={leftPath(i)}
                  />
                </circle>
              ))}
            {!reduceMotion &&
              DESTINATIONS.map((d, i) => (
                <circle key={`fr-${d}`} r={2.6} fill="#aebb45" opacity={0.85}>
                  <animateMotion
                    dur={`${2.8 + (i % 3) * 0.5}s`}
                    begin={`${0.8 + i * 0.38}s`}
                    repeatCount="indefinite"
                    path={rightPath(i)}
                  />
                </circle>
              ))}
          </svg>

          {/* left column — raw inputs */}
          <div className="absolute inset-y-0 left-0 flex w-[27%] flex-col items-end">
            {SOURCES.map((s, i) => (
              <div
                key={s.label}
                className="absolute"
                style={{ top: `${(leftY(i) / VIEW_H) * 100}%`, transform: "translateY(-50%)" }}
              >
                <span className="flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--foreground)]">
                  <span className="text-[var(--muted)]">{s.icon}</span>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* right column — where it resurfaces */}
          <div className="absolute inset-y-0 right-0 w-[27%]">
            {DESTINATIONS.map((d, i) => (
              <div
                key={d}
                className="absolute left-0"
                style={{ top: `${(rightY(i) / VIEW_H) * 100}%`, transform: "translateY(-50%)" }}
              >
                <span className="inline-flex items-center rounded-full border border-[#4aae78]/35 bg-[var(--success-soft)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--success)]">
                  {d}
                </span>
              </div>
            ))}
          </div>

          {/* center — the four things Codence does */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Diamond active={active} reduceMotion={reduceMotion} />
          </div>
        </div>
      </ScrollReveal>

      {/* Narrow screens: the same four stages, stacked */}
      <ol className="mt-10 space-y-3 md:hidden">
        {STAGES.map((stage, i) => (
          <li
            key={stage.label}
            className="flex gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4"
          >
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-semibold text-[var(--foreground)]">{stage.label}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--foreground)]/70">{stage.blurb}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* 01, 02, 03 — the rest of the story, one split block each */}
      <SplitBlock
        n="01"
        title="Every answer traces back to a real decision, not a guess."
        mockup={<DecisionsBoard />}
      >
        <p className="text-base leading-7 text-[var(--foreground)]/70">
          Each finished interview becomes one row: the pull request, who merged it, a summary in your own
          words, and an embedding. The why chat searches those rows and answers with the receipts attached.
        </p>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          What a decision carries
        </p>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-[var(--card-border)] pt-3 text-sm text-[var(--foreground)]/80">
          <span>Pull request link</span>
          <span>Author and merge date</span>
          <span>Summary from your voice</span>
          <span>Embedding for retrieval</span>
          <span>Repository</span>
          <span className="text-[var(--muted)]">Not your access token</span>
        </div>
      </SplitBlock>

      <SplitBlock
        n="02"
        title="Ask in plain words. Read back the answer with its citation."
        mockup={<ChatMock />}
      >
        <p className="text-base leading-7 text-[var(--foreground)]/70">
          Your question gets embedded and matched against stored decisions. The answer comes back grounded
          in the closest one, cited by pull request, author, and date. If nothing relevant is stored,
          Codence says so instead of guessing.
        </p>
      </SplitBlock>

      <SplitBlock
        n="03"
        title="Runs on your machine, or on your key. Your call."
        mockup={<ModelToggleMock />}
      >
        <p className="text-base leading-7 text-[var(--foreground)]/70">
          Local mode runs the questions and embeddings through Ollama and Mistral 7B with no API key, so
          nothing leaves your machine. Cloud mode uses Gemini with your own key when you want the extra
          quality. The rest of the product is identical.
        </p>
      </SplitBlock>
    </div>
  );
}

function SplitBlock({
  n,
  title,
  mockup,
  children
}: {
  n: string;
  title: string;
  mockup: ReactNode;
  children: ReactNode;
}) {
  return (
    <ScrollReveal>
      <div className="mt-16 grid items-center gap-10 lg:mt-24 lg:grid-cols-[minmax(0,25rem)_1fr] lg:gap-8">
        <div>
          <p className="font-mono text-xs font-semibold text-[var(--accent)]">{n}</p>
          <h3 className="mt-3 text-2xl leading-[1.25] text-[var(--foreground)] sm:text-3xl lg:text-[2rem]">
            {title}
          </h3>
          <div className="mt-4 max-w-md">{children}</div>
        </div>
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10"
            style={{
              background:
                "radial-gradient(circle at 30% 20%, rgba(224,150,132,0.2), transparent 55%), radial-gradient(circle at 80% 80%, rgba(120,183,148,0.2), transparent 55%)",
              filter: "blur(30px)"
            }}
          />
          {mockup}
        </div>
      </div>
    </ScrollReveal>
  );
}

function MockShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-[0_24px_60px_rgba(38,33,25,0.12)]">
      <div className="flex items-center gap-2 border-b border-[var(--card-border)] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--foreground)]">
          {title}
        </span>
      </div>
      {/* Some mockups (the model toggle, in particular) have far less
          natural content than others, so without this the card would just
          be short instead of matching the visual weight of its siblings.
          Centering within the shared min-height keeps light content from
          reading as an under-filled box. */}
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

function DecisionsBoard() {
  return (
    <MockShell title="Decisions">
      <div className="grid grid-cols-[1fr_1fr] gap-3 p-3 sm:grid-cols-[1fr_1fr_0.7fr]">
        <BoardColumn title="Reasoning captured" count={3}>
          <DecisionCard id="#128" title="Fix retry logic in payments" level="High" score="82" reasoning />
          <DecisionCard id="#108" title="Rework the auth provider" level="High" score="71" reasoning />
          <DecisionCard id="#47" title="Payment retry handling" level="Med" score="64" reasoning />
        </BoardColumn>
        <BoardColumn title="Skipped" count={2}>
          <DecisionCard id="#95" title="Update README typo" level="Low" score="6" />
          <DecisionCard id="#96" title="Bump lint config" level="Low" score="14" />
        </BoardColumn>
        <BoardColumn title="Queued" count={1}>
          <DecisionCard id="#131" title="Cache warm on deploy" level="Med" score="58" pending />
        </BoardColumn>
      </div>
    </MockShell>
  );
}

function ChatMock() {
  return (
    <MockShell title="Why chat">
      <div className="space-y-3 p-4 lg:p-5">
        <div className="flex justify-end">
          <p className="max-w-xs rounded-2xl rounded-br-sm bg-[var(--ink)] px-3.5 py-2 text-sm leading-5 text-[var(--ink-foreground)]">
            Why did we remove retry logic in payments?
          </p>
        </div>
        <div className="max-w-md rounded-2xl rounded-bl-sm border border-[var(--card-border)] bg-[var(--surface)] px-3.5 py-3 text-sm leading-6 text-[var(--foreground)]">
          Automatic retries fired before the gateway confirmed failure, so under load the same charge went
          through twice. A fixed delay was rejected because the gateway already queues.
          <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-[var(--accent)]" />
          <span className="mt-2.5 flex w-fit items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--surface-2)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--accent-strong)]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-semibold text-white">
              A
            </span>
            octo/payments#47 · aryan · 2026-08-14
          </span>
        </div>

        <div className="!mt-5 border-t border-dashed border-[var(--card-border)] pt-4">
          <div className="flex justify-end">
            <p className="max-w-xs rounded-2xl rounded-br-sm bg-[var(--ink)] px-3.5 py-2 text-sm leading-5 text-[var(--ink-foreground)]">
              Why is the pricing table hard-coded?
            </p>
          </div>
          <div className="mt-3 max-w-xs rounded-2xl rounded-bl-sm border border-[var(--card-border)] bg-[var(--surface)] px-3.5 py-3 text-sm leading-6 text-[var(--muted)]">
            Nothing relevant is stored. No interview has covered pricing.
            <span className="mt-2 block font-mono text-[11px] text-[var(--foreground)]/60">
              Codence answers only from recorded decisions. It will not guess.
            </span>
          </div>
        </div>
      </div>
    </MockShell>
  );
}

function ModelToggleMock() {
  return (
    <MockShell title="Model">
      <div className="space-y-3 p-4 lg:p-5">
        <label className="flex cursor-default items-start gap-3 rounded-xl border-2 border-[var(--accent)] bg-[var(--accent-soft)]/60 p-3">
          <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--accent)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          </span>
          <span>
            <span className="text-sm font-semibold text-[var(--foreground)]">Local</span>
            <span className="ml-2 rounded bg-[var(--success-soft)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--success)]">
              no key
            </span>
            <span className="mt-1 block font-mono text-[11px] text-[var(--muted)]">
              Ollama · Mistral 7B · nothing leaves your machine
            </span>
          </span>
        </label>
        <label className="flex cursor-default items-start gap-3 rounded-xl border border-[var(--card-border)] p-3">
          <span className="mt-0.5 h-4 w-4 rounded-full border-2 border-[var(--card-border)]" />
          <span>
            <span className="text-sm font-semibold text-[var(--foreground)]">Cloud</span>
            <span className="mt-1 block font-mono text-[11px] text-[var(--muted)]">
              Gemini · your API key · higher quality answers
            </span>
          </span>
        </label>
        <p className="border-t border-[var(--card-border)] pt-3 font-mono text-[11px] text-[var(--muted)]">
          Same interview, same chat, same citations. Only the engine changes.
        </p>
      </div>
    </MockShell>
  );
}

function BoardColumn({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <div className="min-w-[13rem] rounded-xl bg-black/[0.02] p-2.5 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
          {title}
        </span>
        <span className="font-mono text-[10px] text-[var(--muted)]">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DecisionCard({
  id,
  title,
  level,
  score,
  reasoning,
  pending
}: {
  id: string;
  title: string;
  level: string;
  score: string;
  reasoning?: boolean;
  pending?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--surface)] p-2.5 shadow-[0_1px_3px_rgba(22,21,15,0.04)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-[var(--muted)]">{id}</span>
        <span className="h-3.5 w-3.5 rounded-full bg-[var(--accent-soft)]" />
      </div>
      <p className="mt-1 text-[11px] font-semibold leading-4 text-[var(--foreground)]">{title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[9px]">
        <span className="text-[var(--muted)]">{level}</span>
        <span className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[var(--muted)] dark:bg-white/[0.08]">score {score}</span>
        {reasoning && (
          <span className="rounded bg-[var(--success-soft)] px-1.5 py-0.5 text-[var(--success)]">Reasoning</span>
        )}
        {pending && (
          <span className="rounded bg-[var(--warning-soft)] px-1.5 py-0.5 text-[var(--warning)]">Queued</span>
        )}
      </div>
    </div>
  );
}

function Diamond({ active, reduceMotion }: { active: number; reduceMotion: boolean }) {
  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      {PETALS.map((petal, i) => {
        const isActive = !reduceMotion && i === active;
        return (
          <span
            key={petal.label}
            className={`absolute h-28 w-28 rotate-45 rounded-[1.6rem] transition-transform duration-500 ${petal.shift} ${
              isActive ? "scale-[1.06]" : ""
            }`}
            style={{
              background: isActive
                ? "radial-gradient(circle at 50% 50%, rgba(58,167,110,0.85), rgba(120,196,154,0.5) 72%)"
                : "radial-gradient(circle at 50% 50%, rgba(74,177,120,0.6), rgba(150,205,170,0.34) 74%)"
            }}
          />
        );
      })}

      <span className="relative z-[1] flex h-24 w-24 rotate-45 items-center justify-center rounded-[1.35rem] border border-[var(--card-border)] bg-[var(--surface-2)] shadow-[var(--shadow)]">
        <span className={`-rotate-45 ${reduceMotion ? "" : "animate-[spin_11s_linear_infinite]"}`}>
          <DottedRing />
        </span>
      </span>

      {PETALS.map((petal) => (
        <span
          key={`lbl-${petal.label}`}
          className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--foreground)] ${petal.nudge}`}
        >
          {petal.label}
        </span>
      ))}
    </div>
  );
}

function DottedRing() {
  const dots = Array.from({ length: 16 });
  return (
    <span className="relative block h-9 w-9">
      {dots.map((_, i) => {
        const angle = (i / dots.length) * 2 * Math.PI;
        const r = 15;
        const x = 18 + r * Math.cos(angle);
        const y = 18 + r * Math.sin(angle);
        return (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[var(--foreground)]"
            style={{ left: x, top: y }}
          />
        );
      })}
    </span>
  );
}

function IconMerge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M6 8.5v7M6 12h6.5c2 0 3-1 3-2.5" />
    </svg>
  );
}
function IconDiff() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 4v6M9 7h6M6 17h12" />
    </svg>
  );
}
function IconFolder() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M4 7a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M4 12V5a1 1 0 0 1 1-1h7l8 8-8 8z" />
      <circle cx="8.5" cy="8.5" r="1" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
function IconPackage() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
    </svg>
  );
}
