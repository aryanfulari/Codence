"use client";

import { FormEvent, useState } from "react";
import { connectRepo } from "@/lib/api";
import { TestimonialMarquee } from "@/components/testimonial-marquee";
import { StaggeredWordReveal } from "@/components/StaggeredWordReveal";
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
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-6 pb-12 lg:px-10">
      <section className="fade-up mx-auto max-w-4xl pt-6 pb-8 text-center lg:pt-8">
        <p className="text-sm uppercase tracking-[0.34em] text-[var(--accent-strong)]">
          Institutional memory, automated
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-[1.1] text-[var(--foreground)] sm:text-4xl sm:leading-[1.05] md:text-5xl lg:text-6xl">
          <StaggeredWordReveal text="The reasoning behind your code. Remembered, not lost." />
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)] lg:text-xl">
          A quick voice interview on the PRs that matter. A searchable
          record of every reason your codebase looks the way it does.
        </p>
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3.5 py-1.5 font-mono text-xs text-[var(--foreground)]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          Local mode runs on Ollama. Nothing leaves your machine.
        </div>
      </section>

      <section id="connect" className="fade-up-delay mx-auto max-w-3xl scroll-mt-24 pb-16 lg:pb-24">
        <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow)]">
            <div className="p-8 lg:p-10">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                    Repo Connect
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                    {isConnectedish ? "Repository connected" : "Connect a repository"}
                  </h2>
                </div>
                <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                  {status === "connected" ? "Live" : status === "demo" ? "Demo" : "Setup"}
                </div>
              </div>

              {isConnectedish ? (
                <div className="space-y-5">
                  <div
                    className={`rounded-2xl p-4 text-sm leading-6 ${
                      status === "connected"
                        ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                        : "bg-[#fff3d6] text-[#92620a]"
                    }`}
                  >
                    {status === "connected"
                      ? `${repo.trim()} is connected. Webhooks are now listening for pull requests.`
                      : `Backend not reachable yet, so ${repo.trim()} was saved locally. You can still explore the interview and chat demo.`}
                  </div>

                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                      Repository
                    </p>
                    <p className="mt-1 font-semibold text-[var(--foreground)]">{repo.trim()}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full rounded-2xl border border-[var(--card-border)] px-5 py-3 text-base font-semibold text-[var(--foreground)] transition hover:bg-white"
                  >
                    Connect a different repository
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 sm:grid-cols-2">
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
                          className="w-full rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3.5 pr-20 text-base outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)] hover:text-[var(--accent-strong)]"
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
                        className="w-full rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-2xl bg-[#fdeceb] px-4 py-3 text-sm leading-6 text-[#b3261e]">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--foreground)] px-5 py-4 text-base font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting" && <span className="spinner" aria-hidden />}
                    {status === "submitting" ? "Connecting..." : "Connect Repository"}
                  </button>
                </form>
              )}
            </div>
        </div>
        <p className="mt-4 text-center font-mono text-xs leading-5 text-[var(--muted)]">
          Local mode runs on Ollama and Mistral 7B with no API key. Add a Gemini key only if you want cloud mode.
        </p>
      </section>

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

        <div className="mt-10 -mx-6 lg:-mx-10">
          <TestimonialMarquee />
        </div>
      </section>
    </div>
  );
}
