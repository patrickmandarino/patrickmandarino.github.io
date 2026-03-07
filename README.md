# Patrick Mandarino — SLDS Personal Site

This is a simple, static personal site designed to be hosted on **GitHub Pages**.

## What’s included

- **SLDS-themed UI** (Salesforce Lightning Design System)
- A single-page layout with resume sections as **SLDS cards**
- **Responsive** layout (mobile → tablet → desktop)
- **No sensitive contact info** (no email/phone/address)
- **LinkedIn** + **GitHub** + **Trailblazer** links
- SLDS **SVG icons** (loaded in a GitHub Pages-friendly way)

## How to publish on GitHub Pages

1. Create a repository (or use an existing one).
2. Put these files at the repo root.
3. In GitHub:
   - **Settings** → **Pages**
   - Source: `Deploy from a branch`
   - Branch: `main` (or `master`) / root
4. Your site will be available at the GitHub Pages URL.

## Updating content

- Most content is in `index.html`.
- Custom styles are in `assets/css/site.css`.
- The small JS file (`assets/js/site.js`) is used for:
  - loading SLDS icon spritemaps
  - switching the cards between mobile, tablet, and desktop column layouts

## Updating images

- Headshot: `assets/img/headshot.jpg`
- Certification badge: `assets/img/platform-developer.png`
- Trailhead rank badge: `assets/img/four-star-ranger.png`
