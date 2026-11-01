# Egik Dut ve Yeni Hero Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the documented leaning mulberry to the south wall story and replace the hero background with an optimized user-supplied video.

**Architecture:** `environment.js` owns a dedicated mulberry group and exposes its focus point. Existing chapter/view routing gains one `mulberry` identity. The existing hero controller keeps its asset path while the binary and provenance are replaced.

**Tech Stack:** Static HTML/CSS/JavaScript, Three.js, Node test runner, ffmpeg used only as an authoring tool.

**Spec:** `docs/superpowers/specs/2026-11-01-egik-dut-video-design.md`

## Global Constraints

- Treat the tree story as a sourced legend, never as structural fact.
- Place the tree outside the south/qibla wall behind the mihrab, not in the inner courtyard.
- No new runtime dependency.
- Preserve reduced-motion, Save-Data, poster fallback, range serving and lower YouTube film behavior.
- Record user-supplied image/video rights as unspecified.

## Review Focus

## Completion Evidence

- Implemented video replacement, dedicated south-wall mulberry and sixth discovery stop.
- Final MP4: 5,264,173 bytes, 1280x720, 30fps, silent H.264; moov precedes mdat.
- Final automated run: 41 tests passed, zero failed, including PNG MIME and media policy coverage.
- Browser checks: nonblank desktop/mobile 3D, readable separate caption, sixth-stop selection, user reference photo and no mobile horizontal overflow.
- Live hero playback: readyState 4, videoWidth 1280, advancing currentTime, paused false.
- Independent review found no blocking code defect. Tree remains a schematic reconstruction from the photograph, not a scan.

The checklist below records the original implementation sequence; final verification is recorded above.

- Whole view must still read as a mosque, not a tree demo.
- Mulberry geometry must not block the entrance or museum walk route.
- Mobile stop bars must remain usable with a sixth stop.
- The transcoded MP4 must be fast-start and under 10 MB.
- Source language must distinguish official inventory, academic interpretation and legend.

---

### Task 1: Web video replacement

**Files:**
- Replace: `dist/assets/hero-drone.mp4`
- Modify: `dist/assets/asset-manifest.json`
- Modify: `README.md`

- [ ] Record current/new media metadata and hashes.
- [ ] Transcode `harput_son.mp4` to H.264/yuv420p 1280x720 CRF 26, 30fps, no audio, fast-start.
- [ ] Assert the result is below 10 MB, contains `moov` before `mdat`, and differs from the old clip.
- [ ] Update provenance without making a license claim.
- [ ] Run server/media tests and browser playback verification.

### Task 2: Dedicated leaning mulberry geometry

**Files:**
- Modify: `dist/environment.js`
- Create: `tests/environment-mulberry.test.js`

- [ ] Write failing real-Three tests for south-wall placement, separate curved trunks, horizontal lean, broad crown and route clearance.
- [ ] Add a named mulberry group, low protective oval surround, root mass, curved trunks and instanced foliage.
- [ ] Return `mulberry` and its focus from `createEnvironment()`; keep trunk static and crown motion restrained.
- [ ] Run focused and full tests.

### Task 3: Story/view integration

**Files:**
- Modify: `dist/story-content.js`
- Modify: `dist/app.js`
- Modify: `dist/index.html`
- Modify: `dist/assets/asset-manifest.json`
- Add: `dist/assets/egik-dut-reference.png`
- Test: `tests/environment-mulberry.test.js`

- [ ] Write failing contract checks for the shared `mulberry` identity in chapter, photo, hotspot and sixth stop.
- [ ] Add the sourced legend chapter and south-wall camera preset/hotspot.
- [ ] Add `06 Egik dut`, photo mode and an explicit user-supplied image caption.
- [ ] Refine the existing story card to state the location and legend boundary.
- [ ] Run focused and full tests.

### Task 4: Browser QA and review

**Files:** Modify only files implicated by reproducible QA failures.

- [ ] Inspect whole and mulberry presets at desktop and 390x844 mobile.
- [ ] Verify canvas is nonblank, the tree does not hide the mosque, the sixth stop scrolls, and controls stay at least 44px.
- [ ] Verify hero video playback, pause/resume, reduced-motion, Save-Data and poster fallback.
- [ ] Run full tests, syntax checks and `git diff --check`.
- [ ] Request independent final review before commit/push.
