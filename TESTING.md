 Codence Backend Testing Guide

## 1. What the backend does

The Codence backend is responsible for:

- Receiving GitHub webhook events for pull requests.

- Fetching PR diffs and metadata using the GitHub API.

- Scoring the PR's complexity based on rules (Person B).

- Creating an interview session and generating questions via Gemini (Person D) if the score is >= 50.

- Providing endpoints for the frontend to fetch the interview and submit answers.

- Summarizing the interview, generating embeddings, and storing the decision via ChromaDB (Person B).

## 2. Prerequisites

- Node.js (v18+)

- npm

- Git

## 3. Required environment variables

Create a `.env` file in the `backend` directory based on `.env.example`:

```env

PORT=5000

FRONTEND_URL=http://localhost:3000

GITHUB_TOKEN=your_github_pat_here

GITHUB_WEBHOOK_SECRET=your_webhook_secret_here

GEMINI_API_KEY=your_gemini_key_here

CHROMA_URL=http://localhost:8000

```

*(Never commit real secrets to version control!)*

## 4. Exact setup commands

```bash

cd backend

npm install

cp .env.example .env

```

## 5. Exact command to start the backend

```bash

npm run dev

```

## 6. How to test /ping

With the server running, send a GET request:

```bash

curl http://localhost:5000/ping

```

Expected response:

```json

{"success":true,"message":"Codence backend is alive!","timestamp":"..."}

```

## 7. Relevant API Endpoints

### GET `/ping`

- **Purpose**: Health check.

- **Request Format**: None.

- **Expected Response**: `{"success": true, "message": "..."}`

### POST `/webhook`

- **Purpose**: Receive GitHub PR events.

- **Request Format**: GitHub Webhook payload (JSON). Needs header `X-GitHub-Event: pull_request`.

- **Expected Response**:

  - Unimportant PR (Score < 50): `{"success":true,"message":"Processed PR #...", "important":false, "score":30}`

  - Important PR (Score >= 50): `{"success":true,"message":"Interview created...", "important":true, "score":65, "interviewId":"..."}`

### GET `/interview/:id`

- **Purpose**: Fetch interview questions and PR context.

- **Request Format**: URL parameter ``.

- **Expected Response**: `{"success":true, "interviewId":"...", "pr":{...}, "questions":["Q1","Q2","Q3"]}`

### POST `/interview/:id/submit`

- **Purpose**: Submit answers and generate a decision record.

- **Request Format**: `{"questions":["Q1","Q2","Q3"], "answers":["A1","A2","A3"]}`

- **Expected Response**: `{"success":true, "interviewId":"...", "summary":"..."}`

## 8. How to test the GitHub webhook

You can test the webhook locally using Postman, curl, or running the automated webhook test script:

```bash

npm run test:webhook

```

Or manually via curl:

```bash

curl -X POST http://localhost:5000/webhook \

  -H "Content-Type: application/json" \

  -H "X-GitHub-Event: pull_request" \

  -d '{"action":"opened","pull_request":{"number":1,"title":"test","user":{"login":"user"},"head":{"sha":"abc"},"base":{"ref":"main"}},"repository":{"name":"repo","owner":{"login":"owner"}}}'

```

## 9. How to use ngrok for local webhook testing

1. Install ngrok.

2. Run ngrok to expose your local server: `ngrok http 5000`.

3. Copy the forwarding URL (e.g., `https://abc.ngrok.app`).

4. In your GitHub repository, go to Settings -> Webhooks -> Add webhook.

5. Set Payload URL to `https://abc.ngrok.app/webhook`.

6. Set Content type to `application/json`.

7. Choose "Let me select individual events" and select "Pull requests".

8. Set the secret to match `GITHUB_WEBHOOK_SECRET` in your `.env`.

## 10. Complete end-to-end flow

1. **GitHub PR**: A developer opens a PR.

2. **webhook**: GitHub sends a POST payload to `/webhook`.

3. **GitHub parser/service**: Backend normalizes the payload and fetches diff/files using `GITHUB_TOKEN`.

4. **scorer**: Evaluates PR rules.

5. **score >= 50**: Interview session is created; Gemini generates 3 questions based on diff.

6. **GET `/interview/:id`**: Frontend retrieves the 3 questions.

7. **submit answers**: Developer answers the 3 questions on the frontend and submits.

8. **summarizeTranscript**: Gemini summarizes Q&A into a decision record.

9. **embedding**: Gemini generates a vector for the summary.

10. **store_decision**: Record is stored in ChromaDB stub.

## 11. Automated test commands

```bash

# Test the PR scorer logic (Person B)

npm run test:scorer

# Test webhook and interview API endpoints

npm run test:webhook

# Test Gemini integrations (Requires GEMINI_API_KEY)

npm run test:gemini

```

## 12. Manual testing commands/examples

Test retrieving an interview (replace `` with an ID from the webhook response):

```bash

curl http://localhost:5000/interview/:id

```

Test submitting answers:

```bash

curl -X POST http://localhost:5000/interview/:id/submit \

  -H "Content-Type: application/json" \

  -d '{"questions":["Q1","Q2","Q3"],"answers":["A1","A2","A3"]}'

```

## 13. Expected successful results

- All tests passing in `npm run test:scorer` (58/58).

- `npm run test:webhook` outputs 34/34 passed when `GITHUB_WEBHOOK_SECRET` is NOT set (the script sends unsigned requests). With a real secret configured, webhook tests will return 401 — this is **correct** and expected; the script was written for unsigned dev environments.

- `npm run test:gemini` output depends on whether a valid `GEMINI_API_KEY` is configured. If not, fallback questions and summaries will be generated, but the embedding step will fail.

## 14. Common troubleshooting issues

- **`fetch failed` on test:webhook**: Ensure the backend server is running (`npm run dev`) before executing the tests.

- **Empty file list in scoring**: If `GITHUB_TOKEN` is missing, the backend cannot fetch PR files, meaning file-based scoring rules won't apply.

- **Gemini errors (`Could not load the default credentials`)**: Occurs when `GEMINI_API_KEY` is not set.

## 15. Person B/C/D dependencies

- **Person B (ChromaDB / Scoring)**: The `store_decision` call is currently stubbed in `chromaStub.js` and logs to the console.

- **Person C (Scorer)**: Fully implemented and integrated in `scorer.js`.

- **Person D (Gemini / AI)**: Integrated in `gemini.js`. Works if `GEMINI_API_KEY` is provided; uses a fallback if missing or failing.

## 16. Status Table

| Feature / Integration | Status | Notes |

| :--- | :--- | :--- |

| Server startup | **VERIFIED** | Boots on port 5000 successfully. |

| GET /ping | **VERIFIED** | Returns HTTP 200 `{"success":true}`. |

| POST /webhook (General) | **VERIFIED** | Handles payloads properly. |

| GitHub PR webhook handling | **VERIFIED** | Validates 'pull_request' actions. |

| GitHub event/action handling | **VERIFIED** | Ignores unrelated events. |

| GitHub parser / normalized data | **VERIFIED** | Normalizes PR payload effectively. |

| GitHub API integration | **LIVE VERIFIED** | Live API tested with real `GITHUB_TOKEN`; PR metadata, changed files, additions/deletions, diff retrieval all confirmed. |

| Webhook HMAC-SHA256 signature validation | **LIVE VERIFIED** | Valid signature accepted (HTTP 200); invalid signature rejected (HTTP 401); missing signature rejected (HTTP 401). Real secret from `.env` used. |

| X-GitHub-Event header handling | **LIVE VERIFIED** | `pull_request` events processed; non-PR events ignored with HTTP 200. |

| PR payload parsing | **LIVE VERIFIED** | `parsePullRequestPayload()` correctly extracts action, prNumber, prTitle, repositoryOwner, repositoryName, author, branches, commitSha. |

| Scoring integration | **LIVE VERIFIED** | `scorePR()` called with real payload; score=30 returned for title keyword matches; correct interview decision made. |

| score < 50 behavior | **LIVE VERIFIED** | Returns `{"success":true,"important":false,"score":30,...}` — interview correctly skipped. |

| score >= 50 behavior | **VERIFIED** | Successfully triggers interview pipeline (tested via dev seed endpoint). |

| Interview ID creation | **VERIFIED** | UUID generated correctly. |

| GET /interview/:id | **VERIFIED** | Returns context + exactly 3 questions. |

| Person D question-gen integration | **LIVE VERIFIED** | Real Gemini API called; 3 questions generated from PR diff context. |

| Exactly 3 interview questions | **LIVE VERIFIED** | Real Gemini API returns exactly 3 questions. |

| POST /interview/:id/submit | **VERIFIED** | Validates answers and generates summary. |

| Answer validation | **VERIFIED** | Returns HTTP 400 with mismatch error for wrong answer count. |

| summarizeTranscript integration | **LIVE VERIFIED** | Real Gemini API summarized Q&A transcript successfully. |

| Embedding integration | **NOT TESTED** | Requires live Gemini embedding endpoint; not verified in this run. |

| Person B store_decision (ChromaDB) | **MOCKED** | Stub logs correctly; ChromaDB not running locally. |

| Error handling (Missing IDs) | **VERIFIED** | Returns HTTP 404 for invalid interview IDs. |

| Error handling (Invalid payload) | **VERIFIED** | Returns HTTP 400 for malformed JSON. |

| Real GitHub webhook delivery | **NOT VERIFIED** | Requires ngrok or public URL; ngrok not installed on this machine. Signature validation and full pipeline verified locally (see Section 17). |

---

**## 17. Live Verification Results (2026-09-09)

Test environment: Backend running locally on http://localhost:5000. Real GITHUB_TOKEN and GITHUB_WEBHOOK_SECRET configured in backend/.env. A temporary public Cloudflare tunnel was used to expose the backend.

GitHub API Integration — LIVE VERIFIED

Previously verified in a separate live API test session:

✅ PR metadata fetched from the real GitHub REST API

✅ Changed files list retrieved (per-file: filename, status, additions, deletions)

✅ Additions / deletions counts confirmed

✅ Unified diff retrieved via application/vnd.github.diff Accept header

✅ GITHUB_TOKEN Bearer authentication confirmed working

Webhook Signature Validation — VERIFIED

Local signature-specific tests used a real HMAC-SHA256 generated from GITHUB_WEBHOOK_SECRET:

Test Case

HTTP Status

Result

Valid X-Hub-Signature-256 (correct HMAC)

200

✅ ACCEPTED

Invalid X-Hub-Signature-256 (wrong HMAC)

401

✅ REJECTED

Missing X-Hub-Signature-256 header

401

✅ REJECTED

Real GitHub Webhook Delivery — PARTIALLY VERIFIED

A real GitHub webhook delivery was successfully received through the public Cloudflare tunnel.

Server log:

[WEBHOOK] Event: ping
[WEBHOOK] Ignored event: ping

This confirms:

✅ GitHub reached the public webhook URL

✅ Cloudflare forwarded the request to the local Express backend

✅ HMAC signature verification succeeded

✅ X-GitHub-Event was read correctly

✅ The ping event was safely ignored

✅ Backend returned HTTP 200

The ping event does not contain PR data, so it did not exercise PR parsing, GitHub API file/diff retrieval, scoring, or interview creation.

What Remains to Be Tested

Real pull_request delivery: A test PR must be opened (or an existing PR reopened) so GitHub sends an actual pull_request event.

End-to-end PR webhook flow: The real PR event should be verified through signature validation → PR parsing → GitHub API → scorePR() → interview decision.

Score ≥ 50 via live webhook: A real high-importance test PR should be used if interview creation through the webhook needs to be demonstrated.

Embedding integration: Requires live Gemini embedding endpoint verification.

Person B ChromaDB storage: Currently mocked/stubbed; real ChromaDB is not running locally.

Current conclusion: The GitHub webhook connection itself is LIVE VERIFIED for delivery and HMAC authentication via a real GitHub ping event, but the full real pull_request webhook pipeline is not yet fully live-verified.