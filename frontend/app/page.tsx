"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { connectRepo } from "@/lib/api";
import { TestimonialMarquee } from "@/components/testimonial-marquee";
import { GlitchText } from "@/components/GlitchText";
import { DashboardMock } from "@/components/DashboardMock";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { ReasoningFlow } from "@/components/ReasoningFlow";

const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

type Status = "idle" | "submitting" | "connected" | "demo";

export default function LandingPage() {
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedToken = token.trim();
    const trimmedRepo = repo.trim();

    if (!trimmedToken) {
      setError("Personal access token is required.");
      return;
    }
    if (!REPO_PATTERN.test(trimmedRepo)) {
      setError("Use the owner/repo format, e.g. codence/core.");
      return;
    }

    setStatus("submitting");
    try {
      await connectRepo({ token: trimmedToken, repo: trimmedRepo });
      setStatus("connected");
    } catch {
      // Backend may not be running yet during a frontend-only demo — keep the
      // flow usable locally instead of dead-ending the user on a fetch error.
      sessionStorage.setItem("codence_demo_repo", trimmedRepo);
      setStatus("demo");
    }
  }

  function handleReset() {
    setStatus("idle");
    setError(null);
  }

  const isConnectedish = status === "connected" || status === "demo";

  return (
    <>
    <div className="mx-auto w-full max-w-[87.5rem] overflow-x-hidden px-6 lg:px-10">
      <section className="fade-up relative pt-8 pb-8 lg:pt-12 lg:pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full bg-[#3f6fe0] opacity-[0.16] blur-[65px] dark:opacity-[0.32]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-10 top-10 -z-10 hidden h-56 w-56 rounded-full bg-[#e0a24a] opacity-[0.16] blur-[65px] dark:opacity-[0.32] lg:block"
        />
        <p className="relative text-sm uppercase tracking-[0.34em] text-[var(--accent-strong)]">
          Institutional memory, automated
        </p>
        <div className="relative mt-6 grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:items-start lg:gap-12">
          <h1 className="text-3xl font-semibold leading-[1.1] text-[var(--foreground)] sm:text-4xl lg:text-[2.6rem]">
            The reasoning behind your code.
            <br />
            Remembered, not <GlitchText>lost</GlitchText>.
          </h1>
          <div className="lg:pt-1">
            <p className="max-w-sm text-[15px] leading-6 text-[var(--muted)]">
              A quick voice interview on the PRs that matter. A searchable record of every reason your
              codebase looks the way it does.
            </p>
            <div className="mt-5">
              <Link
                href="/#connect"
                className="inline-block rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--ink-foreground)] transition hover:bg-[var(--accent-strong)] hover:text-white"
              >
                Connect a repository
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>

    {/* Not nested inside an overflow-x-hidden ancestor (see note further
        down): that's what let the mock bleed to the true right edge. For the
        left edge, reuse the exact same container classes as the hero instead
        of recomputing its inset with a separate formula — that guarantees
        pixel-identical alignment instead of two formulas quietly drifting
        apart across browsers. Only the right edge is pushed out, by exactly
        undoing this container's own centering/padding. */}
    <section className="fade-up-delay hidden pb-16 sm:block lg:pb-24" aria-hidden>
      <div className="mx-auto w-full max-w-[87.5rem] px-6 lg:px-10">
        <div className="mr-[calc(-1*max(0px,(100vw-87.5rem)/2)-1.5rem)] lg:mr-[calc(-1*max(0px,(100vw-87.5rem)/2)-2.5rem)]">
          <DashboardMock />
        </div>
      </div>
    </section>

    <div className="mx-auto w-full max-w-[87.5rem] overflow-x-hidden px-6 pb-12 lg:px-10">
      <section id="how-it-works" className="scroll-mt-24 pb-20 lg:pb-28">
        <FeatureShowcase />
      </section>

      <section id="in-action" className="fade-up-delay-2 scroll-mt-24 pb-20 lg:pb-28">
        <ReasoningFlow />
      </section>

      <section className="fade-up-delay-2 pb-20 lg:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-[var(--foreground)] lg:text-4xl">
            Knowledge that outlasts the person who wrote it.
          </h2>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Illustrative examples — Codence doesn&apos;t have public customers yet
          </p>
        </div>

        <div className="mt-10">
          <TestimonialMarquee />
        </div>
      </section>

      <section id="connect" className="fade-up-delay-2 scroll-mt-24 pb-20 lg:pb-28">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-[var(--card-border)] bg-[#e3eafc] px-6 py-10 dark:bg-[var(--surface-2)] lg:px-10 lg:py-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#3f6fe0] opacity-[0.16] blur-[70px] dark:opacity-[0.4]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-14 h-72 w-72 rounded-full bg-[#e0a24a] opacity-[0.28] blur-[80px] dark:opacity-[0.4]"
          />

          <div className="relative">
            <div className="mb-6 flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Repo Connect</p>
              <span className="rounded-full bg-[var(--surface)]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                {status === "connected" ? "Live" : status === "demo" ? "Demo" : "Setup"}
              </span>
            </div>
            <h2 className="text-3xl font-semibold leading-[1.15] text-[var(--foreground)] lg:text-4xl">
              {isConnectedish ? "Repository connected" : "Connect a repository, effortlessly."}
            </h2>
            {!isConnectedish && (
              <p className="mt-4 text-base leading-7 text-[var(--foreground)]/70">
                Point Codence at a GitHub repo. It listens for pull requests, scores them, and asks the
                questions worth asking. No custom setup, no waiting.
              </p>
            )}

            {isConnectedish ? (
              <div className="mt-6 space-y-4">
                <div
                  className={`rounded-2xl p-4 text-sm leading-6 ${
                    status === "connected"
                      ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                      : "bg-[var(--warning-soft)] text-[var(--warning)]"
                  }`}
                >
                  {status === "connected"
                    ? `${repo.trim()} is connected. Webhooks are now listening for pull requests.`
                    : `Backend not reachable yet, so ${repo.trim()} was saved locally. You can still explore the interview and chat demo.`}
                </div>

                <div className="rounded-2xl bg-[var(--surface)]/80 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Repository</p>
                  <p className="mt-1 font-semibold text-[var(--foreground)]">{repo.trim()}</p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full rounded-full border border-[var(--card-border)] bg-[var(--surface)] px-5 py-3 text-base font-semibold text-[var(--foreground)] transition hover:bg-[var(--surface)]/70"
                >
                  Connect a different repository
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="token" className="text-sm font-medium text-[var(--foreground)]">
                    Personal Access Token
                  </label>
                  <div className="relative">
                    <input
                      id="token"
                      name="token"
                      type={showToken ? "text" : "password"}
                      value={token}
                      onChange={(event) => setToken(event.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full rounded-full border border-[var(--card-border)] bg-[var(--surface)] px-4 py-3 pr-16 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--accent-strong)]"
                    >
                      {showToken ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="repo" className="text-sm font-medium text-[var(--foreground)]">
                    Repository Name
                  </label>
                  <input
                    id="repo"
                    name="repo"
                    type="text"
                    value={repo}
                    onChange={(event) => setRepo(event.target.value)}
                    placeholder="owner/reponame"
                    className="w-full rounded-full border border-[var(--card-border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                  />
                </div>

                {error && (
                  <p className="rounded-2xl bg-[var(--danger-soft)] px-4 py-3 text-sm leading-6 text-[var(--danger)]">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3.5 text-base font-semibold text-[var(--ink-foreground)] transition hover:bg-[var(--accent-strong)] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" && <span className="spinner" aria-hidden />}
                  {status === "submitting" ? "Connecting..." : "Connect Repository"}
                </button>

                <p className="pt-1 font-mono text-xs leading-5 text-[var(--foreground)]/55">
                  Local mode runs on Ollama and Mistral 7B with no API key. Add a Gemini key only if you
                  want cloud mode.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
