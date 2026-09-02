import Link from "next/link";

const navItems = [
  { href: "/", label: "Landing" },
  { href: "/interview/demo-pr", label: "Interview" },
  { href: "/chat", label: "Chat" }
];

export function SiteHeader() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--foreground)] text-sm font-semibold uppercase tracking-[0.28em] text-white">
            MW
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Codence
            </p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              Decision Memory
            </p>
          </div>
        </Link>

        <nav className="rounded-full border border-[var(--card-border)] bg-[var(--card)] p-1 shadow-[var(--shadow)] backdrop-blur">
          <ul className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-full px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-white hover:text-[var(--accent-strong)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
