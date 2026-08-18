"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CodenceMark } from "@/components/codence-mark";

const navItems = [
  { href: "/", label: "Landing" },
  { href: "/interview/demo-pr", label: "Interview" },
  { href: "/chat", label: "Chat" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="relative z-10 border-b border-[var(--card-border)]">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-4 px-6 py-5 sm:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 justify-self-start">
          <CodenceMark size={32} className="shrink-0" />
          <p className="text-lg font-semibold whitespace-nowrap text-[var(--foreground)]">
            Codence
          </p>
        </Link>

        <nav className="order-3 col-span-2 justify-self-center sm:order-none sm:col-auto">
          <ul className="flex items-center gap-1 rounded-full border border-[var(--card-border)] bg-white/80 p-1.5 text-sm shadow-[0_2px_10px_rgba(22,21,15,0.05)]">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-full px-4 py-2 font-medium transition ${
                      isActive
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden justify-self-end sm:block" aria-hidden />
      </div>
    </header>
  );
}
