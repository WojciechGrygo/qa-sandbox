# InPost QA Sandbox

A test site for QA recruitment — built to look and feel like a real InPost web app, with intentional bugs seeded throughout.

## What's here

**Main app** (`/`, `/login`, `/profile`) — an InPost-branded app for manual testing. Candidates explore it without prior hints and report what they find.

**QA Challenges** (`/challenges/*`) — four focused automation tasks:

| Path | Task |
|------|------|
| `/challenges/async` | Async wait — write a stable, non-flaky test |
| `/challenges/visual` | Visual regression — mock dynamic data and capture screenshots |
| `/challenges/a11y` | Accessibility — audit a form with deliberate WCAG violations |
| `/challenges/api-testing` | REST API — full CRUD test suite against a parcel management API |

## Credentials

```
email:    user@example.com
password: password12345
```

API sandbox token (shown on the API testing page):

```
test-token-inpost-2026
```

## Running locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.
