const sampleCitations = [
  "PR #47 - payment retry logic - Aryan - March 12",
  "PR #63 - auth provider migration - Meghana - April 3"
];

export default function ChatPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-6xl flex-col px-6 py-12 lg:px-10">
      <div className="fade-up flex min-h-[72vh] flex-1 flex-col rounded-[2rem] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow)] backdrop-blur lg:p-8">
        <div className="border-b border-[var(--card-border)] pb-6">
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent-strong)]">
            RAG Chat Shell
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[var(--foreground)]">
            Ask MetaWiz why the codebase is the way it is.
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted)]">
            This page is ready for Day 3 integration. For now it shows the final
            layout: answer area above, input below, and an empty-state experience.
          </p>
        </div>

        <div className="fade-up-delay flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-3xl rounded-[1.75rem] border border-dashed border-[var(--card-border)] bg-white/80 p-8 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">
              Empty state
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              No decision retrieved yet
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Ask a grounded question like “Why did we change payment retry
              handling?” and MetaWiz will respond with cited decisions from stored
              PR interviews.
            </p>

            <div className="mt-6 grid gap-3 text-left">
              {sampleCitations.map((citation) => (
                <div
                  key={citation}
                  className="rounded-2xl bg-[#f9f6f0] px-4 py-3 text-sm text-[var(--foreground)]"
                >
                  {citation}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fade-up-delay-2 mt-auto rounded-[1.75rem] border border-[var(--card-border)] bg-white/90 p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <input
              type="text"
              placeholder="Ask why a change was made, what tradeoffs were considered, or what risk was noted..."
              className="min-h-14 flex-1 rounded-2xl border border-[var(--card-border)] bg-[#fcfbf8] px-4 py-3 outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
            />
            <button
              type="button"
              className="rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            >
              Ask MetaWiz
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
