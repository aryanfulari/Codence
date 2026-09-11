// Seeded data for the /demo dashboard. No backend — this is the shape the
// real local dashboard will fetch from the Codence instance, so swapping
// these constants for fetch() calls later is a mechanical change.

export type HealthItem = { label: string; value: string; ok: boolean };

export const health: HealthItem[] = [
  { label: "Ollama", value: "running", ok: true },
  { label: "Model", value: "mistral:7b", ok: true },
  { label: "Vector store", value: "chroma", ok: true },
  { label: "Webhook", value: "receiving", ok: true }
];

export type Repo = { name: string; defaultBranch: string; openPrs: number; webhook: "ok" | "pending" };

export const repos: Repo[] = [
  { name: "octo/payments", defaultBranch: "main", openPrs: 6, webhook: "ok" },
  { name: "octo/web", defaultBranch: "main", openPrs: 12, webhook: "ok" },
  { name: "octo/infra", defaultBranch: "main", openPrs: 2, webhook: "pending" }
];

export type DecisionStatus = "captured" | "skipped" | "queued";

export type DecisionRow = {
  id: string;
  title: string;
  repo: string;
  author: string;
  date: string;
  score: number;
  status: DecisionStatus;
  reasons: string[];
  summary: string;
  prUrl: string;
};

export const decisions: DecisionRow[] = [
  {
    id: "128",
    title: "Fix retry logic in payments",
    repo: "octo/payments",
    author: "aryan",
    date: "2026-08-14",
    score: 82,
    status: "captured",
    reasons: ["Touches sensitive path: payments/", "Modifies dependency manifest: package.json"],
    summary:
      "Removed automatic retries after duplicate charges under load. Retries were firing before the gateway confirmed failure. A fixed delay was rejected because the gateway already queues.",
    prUrl: "https://github.com/octo/payments/pull/128"
  },
  {
    id: "108",
    title: "Rework the auth provider",
    repo: "octo/web",
    author: "meghana",
    date: "2026-08-09",
    score: 71,
    status: "captured",
    reasons: ["Touches sensitive path: auth/", "Includes newly added files"],
    summary:
      "Swapped the auth library after a CVE was disclosed against it. Patching in place was rejected because upstream had stopped shipping fixes for that version.",
    prUrl: "https://github.com/octo/web/pull/108"
  },
  {
    id: "94",
    title: "Move vector search to local Chroma",
    repo: "octo/infra",
    author: "suzanne",
    date: "2026-07-30",
    score: 66,
    status: "captured",
    reasons: ["Modifies dependency manifest: requirements.txt", "Title keyword: migrate"],
    summary:
      "Switched vector search to a local Chroma instance so nothing leaves the network. The hosted option was dropped over data residency concerns.",
    prUrl: "https://github.com/octo/infra/pull/94"
  },
  {
    id: "95",
    title: "Update README typo",
    repo: "octo/web",
    author: "ruchira",
    date: "2026-08-15",
    score: 6,
    status: "skipped",
    reasons: ["No sensitive paths, no new files"],
    summary: "",
    prUrl: "https://github.com/octo/web/pull/95"
  },
  {
    id: "96",
    title: "Bump lint config",
    repo: "octo/web",
    author: "ruchira",
    date: "2026-08-15",
    score: 14,
    status: "skipped",
    reasons: ["Below threshold of 50"],
    summary: "",
    prUrl: "https://github.com/octo/web/pull/96"
  },
  {
    id: "131",
    title: "Cache warm on deploy",
    repo: "octo/infra",
    author: "aryan",
    date: "2026-08-16",
    score: 58,
    status: "queued",
    reasons: ["Touches sensitive path: config/"],
    summary: "",
    prUrl: "https://github.com/octo/infra/pull/131"
  }
];

export const pendingInterview = {
  id: "131",
  title: "Cache warm on deploy",
  repo: "octo/infra",
  score: 58,
  questions: 3
};

export type ActivityItem = { at: string; text: string };

export const activity: ActivityItem[] = [
  { at: "2m ago", text: "PR #131 scored 58, interview queued" },
  { at: "1h ago", text: "Interview #128 submitted, decision stored" },
  { at: "1h ago", text: "PR #128 scored 82, interview created" },
  { at: "3h ago", text: "PR #95 scored 6, skipped" },
  { at: "yesterday", text: "octo/infra connected, webhook pending" }
];
