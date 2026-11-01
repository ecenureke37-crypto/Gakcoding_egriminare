# Hero Video and Minaret Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a resilient ambient hero video and correct the minaret/şerefe structural discontinuities.

**Architecture:** A small hero-media controller owns loading, playback, visibility and fallback policy. Existing Three.js modules retain ownership of mosque and minaret geometry; focused geometry tests define the roof envelope and balcony deck contract.

**Tech Stack:** Static HTML/CSS/JavaScript, Node HTTP server, Three.js, Node test runner, Playwright browser verification.

**Spec:** `docs/superpowers/specs/2026-11-01-hero-video-minaret-design.md`

## Global Constraints

- User-supplied MP4 is the only self-hosted video source.
- Reduced motion and Save-Data never request video bytes.
- Lower official YouTube film section remains intact.
- No new runtime dependency.

## Review Focus

- Autoplay rejection must leave a legible poster and usable CTA.
- Hidden/offscreen heroes must not continue decoding unnecessarily.
- Short mobile viewports must keep copy, pause control and next-section hint visible.
- Minaret must remain within the roof envelope at roof height.
- Balcony deck must close the annulus without z-fighting.

---

### Task 1: Hero media behavior

**Files:**
- Create: `dist/hero-media.js`
- Create: `tests/hero-media.test.js`
- Modify: `dist/index.html`
- Modify: `dist/style.css`
- Modify: `dist/app.js`
- Add: `dist/assets/hero-drone.mp4`

- [ ] Write failing policy tests for reduced motion, Save-Data, autoplay rejection and user pause.
- [ ] Implement the media policy/controller and attach the MP4 only when allowed.
- [ ] Replace the hero image with video plus image fallback and remove the duplicate hero film button.
- [ ] Apply Harput-specific color tokens and stable responsive media framing.
- [ ] Run focused and full tests.

### Task 2: Video transport and provenance

**Files:**
- Modify: `server.cjs`
- Modify: `dist/assets/asset-manifest.json`
- Modify: `README.md`
- Test: `tests/server.test.js`

- [ ] Write failing tests for MP4 MIME, HEAD and byte-range responses.
- [ ] Stream static assets and implement single-range responses.
- [ ] Record the user-supplied asset and transformation/usage notes.
- [ ] Run server and full tests.

### Task 3: Minaret and balcony continuity

**Files:**
- Modify: `dist/architecture.js`
- Modify: `dist/minaret.js`
- Test: `tests/minaret-details.test.js`

- [ ] Write failing tests for roof-envelope placement, balcony deck hit and upper-drum overlap.
- [ ] Move the base inward, add the deck and extend the upper drum.
- [ ] Tune whole/minaret/balcony camera presets only if screenshot evidence requires it.
- [ ] Run geometry and full tests.

### Task 4: Browser verification

**Files:**
- Modify only files implicated by reproducible QA failures.

- [ ] Verify desktop, 1366x650 and 390x844 screenshots.
- [ ] Verify reduced motion, Save-Data, pause/resume, poster fallback and no horizontal overflow.
- [ ] Verify whole/minaret/balcony views at multiple azimuths and console/network cleanliness.
- [ ] Run `npm test`, syntax checks and `git diff --check`.
