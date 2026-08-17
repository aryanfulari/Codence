"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Landing" },
  { href: "/interview/demo-pr", label: "Interview" },
  { href: "/chat", label: "Chat" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--foreground)] text-sm font-semibold uppercase tracking-[0.28em] text-white">
            MW
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              MetaWiz AI
            </p>
            <p className="text-lg font-semibold whitespace-nowrap text-[var(--foreground)]">
              Decision Memory
            </p>
          </div>
        </Link>

        <nav className="w-full rounded-full border border-[var(--card-border)] bg-[var(--card)] p-1 shadow-[var(--shadow)] backdrop-blur sm:w-auto">
          <ul className="flex items-center justify-between gap-1 sm:justify-start">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));

              return (
                <li key={item.href} className="flex-1 sm:flex-none">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-full px-4 py-2 text-center text-sm font-medium transition ${
                      isActive
                        ? "bg-[var(--foreground)] text-white"
                        : "text-[var(--foreground)] hover:bg-white hover:text-[var(--accent-strong)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
