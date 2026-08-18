"use client";

import { FormEvent, useState } from "react";
import { connectRepo } from "@/lib/api";
import { TestimonialMarquee } from "@/components/testimonial-marquee";
import { TiltWrapper } from "@/components/TiltedCard/TiltWrapper";

const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

const FEATURES = [
  {
    title: "Speak it, don't type it",
    description:
      "Answer three AI-generated questions by voice right when the PR is fresh in your head — no forms, no forgetting why you made the call."
  },
  {
    title: "Only the PRs that matter",
    description:
      "Codence scores every diff against sensitive paths, new files, and dependency changes, so only real risk triggers a voice interview."
  },
  {
    title: "Answers with receipts",
    description:
      "Every answer comes grounded in stored decisions — cited by PR, author, and date. Never a guess."
  }
];

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
      setError("Use the owner/repository-name format, e.g. codence-ai/core.");
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
    <div className="mx-auto w-full max-w-6xl overflow-x-hidden px-6 lg:px-10">
      <section className="fade-up mx-auto max-w-4xl pt-20 pb-12 text-center lg:pt-28">
        <p className="text-sm uppercase tracking-[0.34em] text-[var(--accent-strong)]">
          Institutional memory, automated
        </p>
        <h1 className="mt-6 text-6xl font-semibold leading-[1.02] text-[var(--foreground)] lg:text-8xl">
          The reasoning behind your code — remembered, not lost.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-xl leading-9 text-[var(--muted)] lg:text-2xl">
          A quick voice interview on the PRs that matter. A searchable
          record of every reason your codebase looks the way it does.
        </p>
      </section>

      <section className="fade-up-delay mx-auto max-w-3xl pb-16 lg:pb-24">
        <TiltWrapper className="rounded-2xl" rotateAmplitude={6} scaleOnHover={1.015}>
          <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-[var(--shadow)]">
            <div className="flex items-center gap-2 border-b border-[var(--card-border)] bg-black/[0.02] px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e8a33d]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#d9714f]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              <span className="ml-2 font-mono text-xs text-[var(--muted)]">codence.app/connect</span>
            </div>

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
                        placeholder="owner/repository-name"
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
        </TiltWrapper>
      </section>

      <section className="fade-up-delay pb-20 lg:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent-strong)]">
            Why Codence
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-[var(--foreground)] lg:text-5xl">
            Context has a shelf life. Codence extends it.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="rounded-[1.75rem] border border-[var(--card-border)] bg-white p-8"
            >
              <span className="font-mono text-sm text-[var(--accent)]">
                0{index + 1}
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[var(--muted)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="fade-up-delay-2 pb-20 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent-strong)]">
            See it in action
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)] lg:text-4xl">
            Every answer, grounded and cited.
          </h2>
        </div>

        <TiltWrapper className="mx-auto max-w-3xl rounded-2xl" rotateAmplitude={10} scaleOnHover={1.03}>
          <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] shadow-[var(--shadow)]">
            <div className="flex items-center gap-2 border-b border-[var(--card-border)] bg-black/[0.02] px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e8a33d]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#d9714f]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              <span className="ml-2 font-mono text-xs text-[var(--muted)]">codence.app/chat</span>
            </div>

            <div className="space-y-4 bg-white p-6 lg:p-8">
              <div className="flex justify-end">
                <div className="max-w-sm rounded-2xl bg-[var(--foreground)] px-4 py-3 text-sm text-white">
                  Why did we change payment retry handling?
                </div>
              </div>

              <div className="max-w-lg rounded-2xl border border-[var(--card-border)] bg-[#faf9f6] px-4 py-3 text-sm leading-6 text-[var(--foreground)]">
                Removed the automatic retry logic in payment_processor.py because
                retries were firing before the gateway confirmed failure, causing
                duplicate charges under high load.
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-white px-3 py-1.5 font-mono text-xs text-[var(--accent-strong)]">
                  PR #47 · Aryan · Mar 12, 2025
                </div>
              </div>
            </div>
          </div>
        </TiltWrapper>
      </section>

      <section className="fade-up-delay-2 pb-20 lg:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent-strong)]">
            Teams shipping with Codence
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)] lg:text-4xl">
            Knowledge that outlasts the person who wrote it.
          </h2>
        </div>

        <div className="mt-10 -mx-6 lg:-mx-10">
          <TestimonialMarquee />
        </div>
      </section>
    </div>
  );
}
