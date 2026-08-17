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
    <header className="relative z-10 border-b border-[var(--card-border)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--foreground)] text-xs font-semibold text-[var(--background)]">
            MW
          </div>
          <p className="text-lg font-semibold whitespace-nowrap text-[var(--foreground)]">
            MetaWiz
          </p>
        </Link>

        <nav className="w-full sm:w-auto">
          <ul className="flex items-center justify-between gap-1 text-sm sm:justify-start sm:gap-8">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`font-medium transition ${
                      isActive ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
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
