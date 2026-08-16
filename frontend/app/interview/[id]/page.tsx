type InterviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const questionCards = [
  {
    title: "Question 1",
    prompt: "What problem does this pull request solve for the team?"
  },
  {
    title: "Question 2",
    prompt: "What alternatives did you consider before choosing this approach?"
  },
  {
    title: "Question 3",
    prompt: "What should the next developer know before touching this code?"
  }
];

const animationClasses = ["fade-up-delay", "fade-up-delay", "fade-up-delay-2"];

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { id } = await params;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-10">
      <div className="fade-up rounded-[2rem] border border-[var(--card-border)] bg-[var(--card)] p-8 shadow-[var(--shadow)] backdrop-blur lg:p-10">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent-strong)]">
              Interview Shell
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-[var(--foreground)] lg:text-5xl">
              PR Interview: Improve scoring for risky architectural changes
            </h1>
            <p className="text-base leading-7 text-[var(--muted)]">
              Demo route ID: <span className="font-semibold text-[var(--foreground)]">{id}</span>
            </p>
          </div>

          <div className="grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-2">
            <div className="rounded-2xl bg-white/80 px-4 py-3">
              <p className="uppercase tracking-[0.22em]">Status</p>
              <p className="mt-2 font-semibold text-[var(--foreground)]">UI shell ready</p>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-3">
              <p className="uppercase tracking-[0.22em]">Next step</p>
              <p className="mt-2 font-semibold text-[var(--foreground)]">Fetch real questions</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {questionCards.map((question, index) => (
            <article
              key={question.title}
              className={`${animationClasses[index]} rounded-[1.75rem] border border-[var(--card-border)] bg-white/85 p-6`}
            >
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                    {question.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                    {question.prompt}
                  </h2>
                </div>

                <button
                  type="button"
                  className="rounded-2xl border border-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--foreground)] hover:text-white"
                >
                  Start Recording
                </button>
              </div>

              <div className="rounded-2xl bg-[#f9f6f0] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Transcript preview
                </p>
                <p className="mt-3 text-base leading-7 text-[var(--muted)]">
                  Live voice transcript will appear here once the Browser Speech
                  API is wired in on Day 2.
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] bg-[var(--foreground)] p-6 text-white lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">
              Final action
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Submit interview answers</h3>
          </div>

          <button
            type="button"
            className="rounded-2xl bg-[var(--hero)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:translate-y-[-1px]"
          >
            Submit Answers
          </button>
        </div>
      </div>
    </section>
  );
}
