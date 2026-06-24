# Customer Support Chatbot — Frontend UI

An end-to-end AI system design for a customer support chatbot built for SaaS or e-commerce support teams. The chatbot understands customer messages, classifies intent, retrieves company-specific knowledge, answers with citations, calls business tools, creates support tickets, and escalates risky or unresolved cases to humans.

---

## Project Details.

| Field      | Value                                    |
|------------|------------------------------------------|
| Project    | `project-l3ec6`                          |
| Project ID | `prj_dTzZt7S3vG8U3nKS5ZuvTVZ7WBTz`     |
| Platform   | Vercel                                   |
| Repo       | [Abhinav-kanduri/Customer-chat-front-end-Ui](https://github.com/Abhinav-kanduri/Customer-chat-front-end-Ui) |
| Dashboard  | https://vercel.com/v-kanduri-s-projects/project-l3ec6 |

---

## What's in this repo

```
Customer-chat-front-end-Ui/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml          # Validates every PR — HTML check, secret scan, PR title lint
│   │   └── deploy.yml      # Deploys develop → preview, main → production
│   └── PULL_REQUEST_TEMPLATE.md
├── index.html              # Deployment status checker UI
├── README.md
└── LICENSE
```

`index.html` is a self-contained status page that runs live checks in the browser:
- Vercel deployment reachability
- HTTP status code
- HTTPS / TLS confirmation
- Response time (green < 500 ms · orange < 1500 ms · red otherwise)

---

## Branch Strategy

```
feature/*  ─────────┐
hotfix/*   ──────── PR ──► develop ── PR ──► main
                                │              │
                           Vercel Preview   Vercel Production
                           (staging)        (live)
```

### Branches

| Branch | Purpose | Deploys to | Who merges |
|--------|---------|------------|------------|
| `main` | Production-ready code. Protected — no direct pushes. | Vercel Production | Lead / release manager |
| `develop` | Integration branch. All features land here first. | Vercel Preview (staging) | Any team member via PR |
| `feature/*` | One branch per feature or task. Branch off `develop`. | — | Author opens PR → `develop` |
| `hotfix/*` | Urgent production fixes. Branch off `main`. | — | Author opens PR → `main` AND back-merges to `develop` |

### Day-to-day flow

```bash
# 1. Start a new feature
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature

# 2. Work, commit using Conventional Commits
git add .
git commit -m "feat: add chat history panel"

# 3. Push and open a PR → develop
git push -u origin feature/my-new-feature
# Open PR on GitHub: base = develop

# 4. CI runs automatically:
#    - HTML validation
#    - Secret scan (TruffleHog)
#    - PR title lint (Conventional Commits)

# 5. PR is reviewed and merged into develop
#    → Vercel Preview URL is posted as a PR comment

# 6. When develop is stable and ready for release:
#    Open PR: develop → main
#    → On merge, Vercel deploys to Production automatically
#    → A release tag is created (e.g. release-2026.06.18-a1b2c3d)
```

### Hotfix flow

```bash
# Branch off main, not develop
git checkout main
git pull origin main
git checkout -b hotfix/fix-critical-bug

git commit -m "fix: resolve broken status check on mobile"
git push -u origin hotfix/fix-critical-bug

# PR 1: hotfix/* → main   (gets deployed to production)
# PR 2: hotfix/* → develop (keeps develop in sync)
```

### Commit message convention (Conventional Commits)

```
<type>: <short description>

Types:
  feat      New feature
  fix       Bug fix
  docs      Documentation only
  style     UI / CSS, no logic change
  refactor  Code restructure, no feature change
  perf      Performance improvement
  test      Tests added or updated
  chore     Build process, deps, config
  ci        CI/CD pipeline changes
```

Examples:
```
feat: add response-time badge to status page
fix: correct HTTPS detection on Safari
docs: update deployment steps in README
ci: add secret scan to PR workflow
```

### Branch protection rules (set these in GitHub → Settings → Branches)

| Rule | `main` | `develop` |
|------|--------|-----------|
| Require PR before merging | ✅ | ✅ |
| Require status checks to pass (CI workflow) | ✅ | ✅ |
| Require at least 1 review approval | ✅ | Optional |
| Block direct pushes | ✅ | ✅ |
| Allow force pushes | ❌ | ❌ |

---

## CI/CD Pipeline

### Workflows

#### `ci.yml` — runs on every PR to `develop` or `main`

| Job | What it does |
|-----|-------------|
| Validate | Checks required files exist, validates HTML syntax, flags `console.log` / TODO |
| Security | TruffleHog secret scan on changed commits |
| PR Lint | Enforces Conventional Commits format on PR title |

#### `deploy.yml` — runs on push to `develop` or `main`

| Trigger | Job | Result |
|---------|-----|--------|
| Push to `develop` | `deploy-preview` | Vercel Preview URL posted as PR comment |
| Push to `main` | `deploy-production` | Vercel Production deploy + release tag created |

Pipeline visualised:

```
PR opened (feature → develop)
       │
       ▼
  ┌─────────────────────────────────────┐
  │  CI Workflow                        │
  │  ✓ Validate HTML & files            │
  │  ✓ Secret scan (TruffleHog)         │
  │  ✓ PR title lint                    │
  └─────────────────────────────────────┘
       │ all checks green
       ▼
  PR merged into develop
       │
       ▼
  ┌─────────────────────────────────────┐
  │  Deploy Workflow → Preview           │
  │  vercel build                       │
  │  vercel deploy (preview)            │
  │  → Comment preview URL on PR        │
  └─────────────────────────────────────┘
       │ staging looks good
       ▼
  PR opened (develop → main)
       │  (same CI checks run again)
       ▼
  PR merged into main
       │
       ▼
  ┌─────────────────────────────────────┐
  │  Deploy Workflow → Production        │
  │  vercel build --prod                │
  │  vercel deploy --prod               │
  │  → Create release tag               │
  │  → Job summary posted in Actions    │
  └─────────────────────────────────────┘
```

---

## GitHub Secrets Setup

Go to **GitHub → Settings → Secrets and variables → Actions** and add:

| Secret | Where to get it |
|--------|----------------|
| `VERCEL_TOKEN` | [vercel.com/account/settings/tokens](https://vercel.com/account/settings/tokens) |
| `VERCEL_ORG_ID` | Run `vercel link`, then check `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | `prj_dTzZt7S3vG8U3nKS5ZuvTVZ7WBTz` (from your dashboard) |

---

## Local Development

No build step required — plain HTML/CSS/JS.

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ (for Vercel CLI only)

```bash
npm install -g vercel
```

### Run locally

```bash
# Python
python -m http.server 3000

# Node
npx serve .
```

Open [http://localhost:3000](http://localhost:3000).

> The "Vercel Deployment" badge will show a warning locally — expected, no `.vercel.app` domain.

---

## First-Time Vercel Setup

### 1. Link local repo to Vercel project

```bash
vercel login
vercel link
# Select team: abhinavkanduri01-7140
# Select project: project-l3ec6
```

This creates `.vercel/project.json` — copy `orgId` from it into the `VERCEL_ORG_ID` secret.

### 2. Configure Vercel project settings

In **Vercel Dashboard → project-l3ec6 → Settings → General**:

| Setting | Value |
|---------|-------|
| Framework Preset | Other |
| Root Directory | _(leave blank if repo root is `Customer-chat-front-end-Ui`)_ |
| Build Command | _(leave blank)_ |
| Output Directory | _(leave blank)_ |

### 3. Create GitHub Environments

In **GitHub → Settings → Environments**, create two environments:

- `preview` — no protection rules needed
- `production` — add **Required reviewers** if you want a manual approval gate before production deploys

---

## Custom Domain

1. **Vercel Dashboard → project-l3ec6 → Settings → Domains**
2. Add your domain (e.g. `support.yourdomain.com`)
3. Add the DNS records Vercel shows at your registrar
4. TLS is auto-provisioned — no extra config

---

## Verify the Deployment

Open your Vercel URL. All checks on `index.html` should be green:

| Check | Expected |
|-------|----------|
| Vercel Deployment | Live on Vercel |
| Page Load | HTTP 200 |
| HTTPS / TLS | HTTPS ✓ |
| Response Time | < 500 ms |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `deploy.yml` fails — "project not found" | Double-check `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` secrets |
| CI "secret detected" block | Remove the secret from code; rotate it immediately |
| PR title lint fails | Rename the PR title to follow `type: description` format |
| "Unreachable" on status page | Confirm the deploy succeeded in Vercel Dashboard |
| Status page shows HTTP only | Access the URL with `https://` |
| Deploy fails with 404 | Confirm `index.html` is at the root of the deployed directory |

---

## License

See [LICENSE](./LICENSE).
