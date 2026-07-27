# Anant — Engineering / CAD Portfolio

A static, no-backend portfolio site for GitHub Pages. Themed as an
engineering "drawing set" — folders are sheet categories, projects are
sheets, and a project can live in more than one folder at once.

## File structure — one master file

```
portfolio-site/
├── index.html            ← THE site: markup, styles, behavior, and
│                            content all live in this one file
├── assets/img/<project>/   your images go here
├── scripts/validate.js     run before you push — catches broken edits
├── .github/workflows/      same check, run automatically on GitHub
└── README.md
```

Everything — CSS, JavaScript, and your project data — is inlined into
`index.html`. There's nothing to keep in sync across multiple files,
and nothing that can go stale because you forgot to update a second
file. The three parts are clearly separated by `<style>` and
`<script>` tags if you ever want to split them back out.

## Who controls this site

This is a plain static file, no CMS, no login, no third-party account
in the loop. Once it's in your GitHub repo, only people with push
access to that repo can change anything — and since it's your repo,
that's you, alone, unless you deliberately add a collaborator.

If you ever want to be stricter (e.g. working with a collaborator),
turn on **Settings → Branches → Branch protection rule** on `main` and
require the `validate` check below to pass before anything can merge.

## What stops a bad edit from breaking the live page

1. **`scripts/validate.js`** — run `node scripts/validate.js` before
   you push. It reads the data straight out of `index.html` and checks
   that every project has an id/title, every folder it references
   actually exists, there are no duplicate ids, and every image path
   actually exists on disk. It fails loudly and tells you exactly
   what's wrong instead of letting a typo reach the live site.
2. **`.github/workflows/validate.yml`** — the same check runs
   automatically on GitHub every time you push. You'll see a green
   check or a red ✗ directly on the commit.

## Editing content — find the `PORTFOLIO CONTENT` comment

Open `index.html`, search for `PORTFOLIO CONTENT`. Everything you'd
want to add, remove, or reorganize is right there in one plain
JavaScript object (`window.PORTFOLIO`).

### Add a folder
```js
FOLDERS: [
  ...
  { id: "cfd", name: "CFD & Simulation", icon: "◭", note: "OpenFOAM runs, mesh studies" },
]
```

### Add a project, in more than one folder at once
```js
PROJECTS: [
  ...
  {
    id: "my-new-project",
    title: "My New Project",
    folders: ["autocad", "creative"],
    date: "2026",
    tools: ["Fusion 360", "Python"],
    summary: "One line, shows on the card.",
    images: ["assets/img/my-new-project/shot-1.jpg"],
    links: { github: "" }
  },
]
```

### Make it a case study (recommended for your best work)
Portfolio reviewers consistently flag the same thing: renders alone
don't show how you think. Add these optional fields and the detail
popup switches from a plain paragraph to a structured Brief / Process
/ Outcome layout, and the project also appears in the "Featured
Sheets" row at the top of the page:

```js
{
  id: "my-new-project",
  featured: true,
  role: "Design & Fabrication Prep",
  brief: "The problem you were actually solving.",
  process: [
    "Step one, in your own words",
    "Step two — what changed and why",
    "Step three — how you checked it actually worked"
  ],
  outcome: "What the result was, concretely.",
  ...
}
```
Leave `featured`/`brief`/`process`/`outcome` out entirely and the
project just falls back to a plain `description` paragraph — nothing
breaks either way.

### Header details
The `meta` block at the top of the data controls your name, role line,
location, resume link, and the GitHub/LinkedIn/email links in the
footer. Set `resume: "assets/resume.pdf"` (drop the PDF in `assets/`)
to turn on the "Download Resume" link in the header status ticker;
leave it blank to hide that link.

## Interactive / visual features

- Sidebar folder filter (multi-membership aware) with live counts
- "Featured Sheets" row — your strongest work, pinned above the fold,
  with a targeting-reticle HUD corner accent on hover
- Live text search across title, summary, description, tools, folders
- Case-study detail popups (Brief / Process / Outcome) for featured
  work, with an image carousel (arrow keys + on-screen nav)
- A small "system online" status line — sci-fi detail kept restrained
  enough to still read as professional
- Ambient blueprint-grid background that parallaxes with the cursor
- Fully keyboard accessible (Tab, Enter, Esc, Arrow keys in the modal)
- Respects `prefers-reduced-motion`

## Run it locally

Just open `index.html` in a browser — it's one file, nothing to serve.

## Put it on GitHub Pages

```
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```
Then **Settings → Pages → Source** → select the branch. Live at
`https://yourusername.github.io/`.
