"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TextRoll } from "@/components/v1/skiper58";

// Marketing anchor-nav: the middle links jump to sections on the landing page
// (they carry a leading slash so they also work from /interview and /chat),
// and the demo pages collapse into a single "Try the demo" link. The primary
// action lives in the "Connect a repository" button on the right.
const navItems = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#in-action", label: "In action" },
  { href: "/interview/demo-pr", label: "Try the demo" }
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  if (href.startsWith("/interview")) return pathname.startsWith("/interview") || pathname.startsWith("/chat");
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--card-border)] bg-[var(--background)]">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 items-center gap-4 px-6 py-4 sm:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Link href="/" className="justify-self-start">
          <Image
            src="/codence-wordmark.png"
            alt="Codence"
            width={432}
            height={144}
            priority
            className="h-6 w-auto mix-blend-multiply sm:h-7"
          />
        </Link>

        <nav className="order-3 col-span-2 justify-self-center sm:order-none sm:col-auto">
          <ul className="flex items-center gap-1 rounded-full border border-[var(--card-border)] bg-white/80 p-1.5 text-sm shadow-[0_2px_10px_rgba(22,21,15,0.05)]">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-full px-3.5 py-2 font-medium transition ${
                      active
                        ? "bg-[var(--accent)] text-white"
                        : "text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-strong)]"
                    }`}
                  >
                    <TextRoll>{item.label}</TextRoll>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-end justify-self-end">
          <Link
            href="/#connect"
            className="whitespace-nowrap rounded-full bg-[var(--foreground)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--accent-strong)] sm:text-sm"
          >
            Connect a repository
          </Link>
        </div>
      </div>
    </header>
  );
}
