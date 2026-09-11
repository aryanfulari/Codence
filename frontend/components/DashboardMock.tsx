// Static product shot for the landing page: a Codence "Inbox" showing one
// scored pull request, its interview detail, and the activity that turned it
// into a stored decision. Presentational only.

export function DashboardMock() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-[0_18px_40px_-22px_rgba(38,33,25,0.4)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-24 -z-10 h-72 w-72 rounded-full bg-[#3f6fe0] opacity-[0.22] blur-[70px] dark:opacity-[0.4]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-10 -z-10 h-80 w-80 rounded-full bg-[#e0a24a] opacity-[0.24] blur-[80px] dark:opacity-[0.4]"
      />

      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
          <IconInbox />
          Inbox
          <span className="text-[var(--card-border)]">/</span>
          <span className="text-[var(--foreground)]">Fix retry logic in payments</span>
        </div>
        <div className="flex -space-x-1.5">
          {["A", "M", "S", "R"].map((a, i) => (
            <span
              key={a}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--card)] bg-[var(--accent-soft)] font-mono text-[9px] font-semibold text-[var(--accent-strong)]"
              style={{ zIndex: 4 - i }}
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* icon rail */}
        <div className="hidden w-11 shrink-0 flex-col items-center gap-4 border-r border-[var(--card-border)] py-4 text-[var(--muted)] sm:flex">
          <span className="h-4 w-4 rounded bg-[var(--accent)]" />
          <IconSearch />
          <IconBell />
          <span className="rounded bg-[var(--accent-soft)] p-1 text-[var(--accent-strong)]">
            <IconInbox />
          </span>
          <IconUsers />
          <IconCog />
        </div>

        {/* detail */}
        <div className="w-[16rem] shrink-0 border-r border-[var(--card-border)] p-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-strong)]">
            <IconKey />
          </span>
          <p className="mt-3 font-mono text-[11px] text-[var(--muted)]">octo/payments#128</p>
          <h3 className="mt-1 text-base font-semibold leading-5 text-[var(--foreground)]">
            Fix retry logic in payments
          </h3>
          <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
            Duplicate charges under load after the retry handler fired before the gateway confirmed
            failure.
          </p>

          <dl className="mt-4 space-y-2 text-[12px]">
            <Field label="Repository" value="octo/payments" mono />
            <Field label="Risk score" value="82" mono accent />
            <Field label="Author" value="aryan" mono />
            <Field label="Branch" value="fix/retry-guard" mono />
            <Field label="Status" value="Interview done" />
          </dl>
        </div>

        {/* activity */}
        <div className="min-w-0 flex-1 p-5">
          <div className="flex w-fit gap-1 rounded-lg bg-black/[0.03] p-1 font-mono text-[11px] dark:bg-white/[0.05]">
            <span className="rounded-md bg-[var(--card)] px-2.5 py-1 text-[var(--foreground)] shadow-[0_1px_2px_rgba(22,21,15,0.06)]">
              Activity
            </span>
            <span className="px-2.5 py-1 text-[var(--muted)]">Interview</span>
            <span className="px-2.5 py-1 text-[var(--muted)]">Decision</span>
          </div>

          <ol className="mt-4 space-y-4">
            <Event label="Scored" time="4 min ago">
              Scored 82 against sensitive path <code className="font-mono">payments/</code> and{" "}
              <code className="font-mono">package.json</code>. Above the interview threshold of 50.
            </Event>
            <Event label="Interview created" time="4 min ago" />
            <Event label="Interview submitted" time="2 min ago">
              <blockquote className="border-l-2 border-[var(--card-border)] pl-2.5 text-[12px] italic leading-5 text-[var(--muted)]">
                &ldquo;Retries were firing before the gateway confirmed failure, so under load we
                charged twice. A fixed delay was rejected because the gateway already queues.&rdquo;
              </blockquote>
            </Event>
            <Event label="Decision stored" time="2 min ago" last>
              <div className="mt-1 overflow-hidden rounded-lg border border-[var(--card-border)] bg-[var(--surface)] font-mono text-[11px] leading-5">
                <div className="border-b border-[var(--card-border)] px-3 py-1.5 text-[10px] text-[var(--muted)]">
                  payment_processor.py
                </div>
                <div className="px-3 py-2">
                  <DiffLine n="42" text="def charge(order):" />
                  <DiffLine n="43" text="for attempt in range(3):" kind="del" />
                  <DiffLine n="44" text="    try: gateway.charge(order)" kind="del" />
                  <DiffLine n="43" text="gateway.charge(order)  # gateway queues, no retry" kind="add" />
                  <DiffLine n="44" text='log.info("charged", order.id)' />
                </div>
              </div>
            </Event>
          </ol>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
  accent
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd
        className={`${mono ? "font-mono text-[11px]" : ""} ${
          accent ? "font-semibold text-[var(--accent-strong)]" : "text-[var(--foreground)]"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function Event({
  label,
  time,
  last,
  children
}: {
  label: string;
  time: string;
  last?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative pl-5">
      <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      {!last && <span className="absolute left-[7px] top-3 bottom-[-1rem] w-px bg-[var(--card-border)]" />}
      <div className="flex items-center gap-2 font-mono text-[11px]">
        <span className="font-semibold text-[var(--foreground)]">{label}</span>
        <span className="text-[var(--muted)]">{time}</span>
      </div>
      {children && <div className="mt-1.5 text-[12px] leading-5 text-[var(--foreground)]/80">{children}</div>}
    </li>
  );
}

function DiffLine({ n, text, kind }: { n: string; text: string; kind?: "add" | "del" }) {
  const tone =
    kind === "add"
      ? "bg-[var(--success-soft)] text-[var(--success)]"
      : kind === "del"
        ? "bg-[var(--danger-soft)] text-[var(--danger)]"
        : "text-[var(--muted)]";
  const sign = kind === "add" ? "+" : kind === "del" ? "-" : " ";
  return (
    <div className={`-mx-3 flex gap-2 px-3 ${tone}`}>
      <span className="w-4 shrink-0 text-right opacity-60">{n}</span>
      <span className="w-2 shrink-0">{sign}</span>
      <span className="whitespace-pre">{text}</span>
    </div>
  );
}

function IconInbox() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M4 13l2.5-7h11L20 13v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M4 13h4l1.5 2.5h5L16 13h4" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c1-3.5 3.2-5 6-5s5 1.5 6 5" />
      <path d="M16 6a3 3 0 0 1 0 6M19 20c-.4-2-1.2-3.4-2.4-4.4" />
    </svg>
  );
}
function IconCog() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}
function IconKey() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="15" r="4" />
      <path d="M10.8 12.2 20 3M17 6l3 3M15 8l2 2" />
    </svg>
  );
}
