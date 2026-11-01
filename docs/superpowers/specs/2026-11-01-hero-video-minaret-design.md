# Hero Video and Minaret Refinement Design

## Intent

Make the first viewport feel alive and specific to Harput while correcting the 3D minaret's attachment to the mosque and the visible gap at the balcony.

## Chosen Approach

Use the user-supplied 36-second MP4 as a self-hosted, muted, looping hero background. Keep `cami.jpg` as the poster and fallback, remove the duplicate hero film button, and retain the lower sourced YouTube section as the only full-film experience. The video is decorative and gets a keyboard-accessible pause/play control.

Move the minaret base inward so it emerges through the roof. Add a solid annular balcony deck and extend the upper drum down behind the parapet so no daylight-like gap remains.

## Constraints

- Do not load or autoplay video when reduced motion or Save-Data is active.
- Preserve the still image for autoplay rejection, unsupported media, and narrow-data modes.
- Keep the next section visible below the hero.
- Use limestone, brick, mulberry and Harput-sky colors; avoid generic green dominance.
- Treat the 3D model as a sourced interpretation, not a survey.
- Preserve the lower official YouTube dialog and its attribution.

## Validation

Test video MIME/range serving, fallback policy, pause semantics, minaret roof envelope and balcony continuity. Verify desktop, low-height desktop, mobile, reduced motion and no-horizontal-overflow screenshots in a real browser.
