"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  activity,
  decisions,
  health,
  pendingInterview,
  repos,
  type DecisionRow,
  type DecisionStatus
} from "@/lib/demo-data";
import { searchSeededDecisions, type SeededDecision } from "@/lib/seeded-decisions";

type Mode = "local" | "cloud";

const STATUS_LABEL: Record<DecisionStatus, string> = {
  captured: "Reasoning captured",
  skipped: "Skipped",
  queued: "Queued"
};

export default function DemoDashboard() {
  const [mode, setMode] = useState<Mode>("local");
  const [selectedId, setSelectedId] = useState<string | null>("128");
  const [query, setQuery] = useState("");
  const [asked, setAsked] = useState<string | null>(null);

  const selected = decisions.find((d) => d.id === selectedId) ?? null;
  const results = useMemo<SeededDecision[]>(
    () => (asked ? searchSeededDecisions(asked, 1) : []),
    [asked]
  );
  const answer = results[0] ?? null;

  const columns: DecisionStatus[] = ["captured", "queued", "skipped"];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-10 lg:py-10">
      {/* instance bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-[var(--foreground)]">codence</span>
          <span className="rounded-full bg-[var(--success-soft)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--success)]">
            {mode === "local" ? "local" : "cloud"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {health.map((h) => (
            <span key={h.label} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--muted)]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${h.ok ? "bg-[var(--success)]" : "bg-[var(--danger)]"}`}
                aria-hidden
              />
              {h.label}
              <span className="text-[var(--foreground)]/70">
                {h.label === "Model" && mode === "cloud" ? "gemini-1.5" : h.value}
              </span>
            </span>
          ))}
        </div>

        <div className="flex rounded-full border border-[var(--card-border)] p-0.5 font-mono text-[11px]">
          {(["local", "cloud"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-2.5 py-1 uppercase tracking-[0.1em] transition ${
                mode === m ? "bg-[var(--ink)] text-[var(--ink-foreground)]" : "text-[var(--muted)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* selected decision detail */}
          {selected && (
            <div className="rounded-2xl border border-[var(--accent)] bg-[var(--card)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] text-[var(--muted)]">
                    {selected.repo}#{selected.id}
                  </p>
                  <h2 className="mt-0.5 text-lg font-semibold text-[var(--foreground)]">
                    {selected.title}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--accent-strong)]">
                  score {selected.score}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {selected.reasons.map((r) => (
                  <span
                    key={r}
                    className="rounded bg-black/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[var(--muted)]"
                  >
                    {r}
                  </span>
                ))}
              </div>

              {selected.summary ? (
                <p className="mt-3 text-sm leading-6 text-[var(--foreground)]/80">{selected.summary}</p>
              ) : (
                <p className="mt-3 font-mono text-[11px] text-[var(--muted)]">
                  No interview {selected.status === "queued" ? "yet" : "needed"} for this pull request.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--card-border)] pt-3 font-mono text-[11px] text-[var(--muted)]">
                <span>{selected.author}</span>
                <span>{selected.date}</span>
                <a href={selected.prUrl} className="text-[var(--accent-strong)]">
                  view pull request
                </a>
                {selected.status === "queued" && (
                  <Link
                    href="/interview/demo-pr"
                    className="ml-auto rounded-full bg-[var(--ink)] px-3 py-1.5 font-semibold text-[var(--ink-foreground)]"
                  >
                    Start interview
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* board */}
          <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)]">
            <div className="border-b border-[var(--card-border)] px-4 py-3">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--foreground)]">
                Decisions
              </span>
            </div>
            <div className="grid gap-3 p-3 sm:grid-cols-3">
              {columns.map((col) => {
                const rows = decisions.filter((d) => d.status === col);
                return (
                  <div key={col} className="rounded-xl bg-black/[0.02] p-2.5">
                    <div className="flex items-center justify-between px-1 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      <span>{STATUS_LABEL[col]}</span>
                      <span>{rows.length}</span>
                    </div>
                    <div className="space-y-2">
                      {rows.map((row) => (
                        <BoardRow
                          key={row.id}
                          row={row}
                          active={row.id === selectedId}
                          onSelect={() => setSelectedId(row.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ask */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--foreground)]">
              Ask why
            </span>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setAsked(query.trim() || null);
              }}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Why did we remove retry logic in payments?"
                className="w-full rounded-full border border-[var(--card-border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-foreground)]"
              >
                Ask
              </button>
            </form>

            {asked && (
              <div className="mt-4 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6">
                {answer ? (
                  <>
                    <p className="text-[var(--foreground)]">{answer.summary}</p>
                    <a
                      href={answer.prUrl}
                      className="mt-2.5 inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--surface-2)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--accent-strong)]"
                    >
                      {answer.prTitle} · {answer.author} · {answer.date}
                    </a>
                  </>
                ) : (
                  <p className="text-[var(--muted)]">
                    Nothing relevant is stored. Codence answers only from recorded decisions.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* aside */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-[var(--accent)] bg-[var(--card)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
              Needs you
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[var(--foreground)]">
              {pendingInterview.title}
            </p>
            <p className="font-mono text-[11px] text-[var(--muted)]">
              {pendingInterview.repo}#{pendingInterview.id} · score {pendingInterview.score} ·{" "}
              {pendingInterview.questions} questions
            </p>
            <Link
              href="/interview/demo-pr"
              className="mt-3 block rounded-full bg-[var(--ink)] py-2 text-center text-sm font-semibold text-[var(--ink-foreground)]"
            >
              Start interview
            </Link>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Repositories
            </p>
            <ul className="mt-2.5 space-y-2.5">
              {repos.map((r) => (
                <li key={r.name} className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-mono text-[12px] text-[var(--foreground)]">{r.name}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--muted)]">
                    {r.openPrs} open
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        r.webhook === "ok" ? "bg-[var(--success)]" : "bg-[var(--warning)]"
                      }`}
                      aria-hidden
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
              Activity
            </p>
            <ul className="mt-2.5 space-y-2">
              {activity.map((a, i) => (
                <li key={i} className="text-[13px] leading-5 text-[var(--foreground)]/80">
                  <span className="font-mono text-[10px] text-[var(--muted)]">{a.at}</span>
                  <br />
                  {a.text}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <p className="mt-6 font-mono text-[11px] text-[var(--muted)]">
        Demo dashboard with seeded data. No repository is connected and nothing here is live.
      </p>
    </div>
  );
}

function BoardRow({
  row,
  active,
  onSelect
}: {
  row: DecisionRow;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-2.5 text-left transition ${
        active ? "border-[var(--accent)] bg-[var(--surface)]" : "border-[var(--card-border)] bg-[var(--surface)] hover:border-[var(--accent)]/50"
      }`}
    >
      <div className="flex items-center justify-between font-mono text-[10px] text-[var(--muted)]">
        <span>#{row.id}</span>
        <span>{row.score}</span>
      </div>
      <p className="mt-1 text-[12px] font-semibold leading-4 text-[var(--foreground)]">{row.title}</p>
      <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">{row.repo}</p>
    </button>
  );
}
