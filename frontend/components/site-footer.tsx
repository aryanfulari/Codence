import Image from "next/image";
import Link from "next/link";

const productLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#in-action", label: "In action" },
  { href: "/interview/demo-pr", label: "Try the demo" }
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-[var(--card-border)] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex max-w-xs flex-col gap-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image
                  src="/codence-logo.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-full w-full scale-125 object-cover"
                />
              </span>
              <Image
                src="/codence-wordmark.png"
                alt="Codence"
                width={432}
                height={144}
                className="h-7 w-auto mix-blend-multiply dark:mix-blend-screen dark:invert"
              />
            </Link>
            <p className="text-sm leading-6 text-[var(--muted)]">
              GitHub remembers what changed. Codence remembers why.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Product</p>
            <ul className="flex flex-col gap-2 text-sm">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--foreground)] transition hover:text-[var(--accent-strong)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--card-border)] pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">&copy; {year} Codence. Built for a hackathon.</p>
          <p className="font-mono uppercase tracking-[0.18em]">Institutional memory, automated</p>
        </div>
      </div>
    </footer>
  );
}
