# Submission — Builder Center

Everything your Builder Center project page must include to submit.

## Required Fields

| Field | Value |
|-------|-------|
| **Project name** | MediaTracker |
| **One-liner** | A personal media companion to organize anime, movies & games in one library — with progress tracking, personalized recommendations and analytics. |
| **Category** | `#daily-life-enhancement` |
| **Focus track** | Community |
| **Live URL** | `https://<app>.amplifyapp.com` (fill after Amplify deploy) |
| **Repo** | `https://github.com/<you>/mediatracker-go` |

## Community Story (make this specific)

Write this up — don't just say "anyone who likes media":

> **Who we serve:** students and young developers who consume anime, movies and
> games across different platforms and keep fragmented lists. MediaTracker gives
> them one personal library with progress, analytics and recommendations.

Flow diagram for the submission:

```
Students → anime + movies + games across platforms
        → scattered lists
        → MediaTracker → one personal library
```

## Judges' Demo Script (60 seconds)

1. Land on homepage (no login required).
2. Register a quick account.
3. Search "Demon Slayer" → add as Watching with progress.
4. Library shows it; change status → Completed.
5. Dashboard shows type counts, completion rate, favorite genres.
6. Recommendations show a title with a "why" reason.

## Required Attachments

- [ ] 5–10 screenshots of the coding agent performing AWS actions
      (tables, IAM, deploy, Amplify) → `hackathon-docs/agent-proof/amazon-q-screenshots/`
- [ ] Architecture diagram → `hackathon-docs/architecture/ARCHITECTURE.md`
- [ ] Development log → `hackathon-docs/development-log/README.md`
- [ ] Test results → `hackathon-docs/testing/README.md`
- [ ] Agent usage notes → `hackathon-docs/agent-proof/`

## Eligibility Statement (copy-paste template)

> "MediaTracker began life as a local, in-memory Go REST API (Sep 2026). For this
> hackathon it has been rebuilt as an original full-stack application: persistent
> DynamoDB storage, a React web client, personalized recommendation scoring with
> explanations, personal media analytics, and a complete serverless AWS deployment —
> all developed with AI coding agents connected to the AWS console."

*Fill in specific dates and confirm what was public before Sep 18 before submission.*

## Final Check (Oct 2)

- [ ] Live URL reachable without VPN
- [ ] Ship-gate all green (`testing/README.md`)
- [ ] Eligibility statement dated and accurate
- [ ] Screenshots uploaded
- [ ] Submitted before deadline