export default function LandingPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-6xl flex-col justify-center px-6 py-12 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="fade-up space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-white/70 px-4 py-2 text-sm text-[var(--muted)] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            Hackathon frontend shell for high-context PR interviews
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.34em] text-[var(--accent-strong)]">
              Connect your GitHub repo
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-[var(--foreground)] lg:text-7xl">
              Turn every critical pull request into institutional memory.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Person C Day 1 scope: a polished landing page, interview shell,
              and chat shell that make the end-to-end MetaWiz demo easy to show.
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
                  Ready for backend wiring
                </h2>
              </div>
              <div className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">
                Day 1
              </div>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="token"
                  className="text-sm font-medium text-[var(--foreground)]"
                >
                  Personal Access Token
                </label>
                <input
                  id="token"
                  name="token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="repo"
                  className="text-sm font-medium text-[var(--foreground)]"
                >
                  Repository Name
                </label>
                <input
                  id="repo"
                  name="repo"
                  type="text"
                  placeholder="owner/repository-name"
                  className="w-full rounded-2xl border border-[var(--card-border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-2xl bg-[var(--foreground)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                Connect Repository
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-[#fff8ed] p-4 text-sm leading-6 text-[var(--muted)]">
              Backend POST is intentionally left for the next step. The form is
              ready and waiting for integration.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
