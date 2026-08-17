"use client";

import { FormEvent, useState } from "react";
import { connectRepo } from "@/lib/api";

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
      setError("Use the owner/repository-name format, e.g. metawiz-ai/core.");
      return;
    }

    setStatus("submitting");
    try {
      await connectRepo({ token: trimmedToken, repo: trimmedRepo });
      setStatus("connected");
    } catch {
      // Backend may not be running yet during a frontend-only demo — keep the
      // flow usable locally instead of dead-ending the user on a fetch error.
      sessionStorage.setItem("metawiz_demo_repo", trimmedRepo);
      setStatus("demo");
    }
  }

  function handleReset() {
    setStatus("idle");
    setError(null);
  }

  const isConnectedish = status === "connected" || status === "demo";

  return (
    <section className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-6xl flex-col justify-center px-6 py-12 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="fade-up space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-white/70 px-4 py-2 text-sm text-[var(--muted)] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            GitHub remembers what changed. MetaWiz remembers why.
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.34em] text-[var(--accent-strong)]">
              Connect your GitHub repo
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-[var(--foreground)] lg:text-7xl">
              Turn every critical pull request into institutional memory.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              MetaWiz scores every PR, interviews the developer by voice when it
              matters, and lets your team ask why the codebase is the way it is
              — with grounded, cited answers.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Voice-first developer interviews",
              "AI-generated questions on important PRs",
              "Cited team knowledge chat"
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-[var(--card-border)] bg-white/75 p-5 shadow-[var(--shadow)] backdrop-blur"
              >
                <p className="text-sm leading-6 text-[var(--foreground)]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up-delay relative">
          <div className="rounded-[2rem] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] backdrop-blur lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Repo Connect
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
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
              <form className="space-y-5" onSubmit={handleSubmit}>
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
                      className="w-full rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3 pr-20 text-base outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
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
                    className="w-full rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                  />
                </div>

                {error && (
                  <p className="rounded-2xl bg-[#fdeceb] px-4 py-3 text-sm leading-6 text-[#b3261e]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--foreground)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" && <span className="spinner" aria-hidden />}
                  {status === "submitting" ? "Connecting..." : "Connect Repository"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
