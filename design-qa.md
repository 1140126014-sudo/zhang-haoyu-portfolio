# Design QA

Reference:
- `C:\Users\WIDNOWS\AppData\Local\Temp\codex-clipboard-e01d404b-4610-4b82-a522-0500445bf0c5.png`

Prototype:
- `http://127.0.0.1:5173/`
- Screenshot: `dark-hero-desktop.png`
- Secondary screenshot: `dark-projects-desktop.png`

Checks:
- Hero now uses a dark poster-style composition with oversized red typography, small red information notes, central media, and a compact black header.
- Global sections were converted from light cards to dark exhibition-style panels.
- Hero guitar tuner video has been removed; the hero now uses a static red typographic visual block.
- Button hover states invert color between red fill and transparent red outline.
- Uploaded video `hero-uploaded-background.mp4` is now the hero background with a frosted glass overlay.
- Removed the central typographic frame and the lower-right black capability card.
- Hero buttons are positioned at the bottom of the first viewport.
- Hero typography was reflowed into separated top, middle, and bottom zones; checked major text blocks for overlap.
- Frosted glass blur was reduced to 2px and the background video brightness was increased to preserve detail.
- Vite production build passed.
- Browser check passed with 7 project cards rendered and no console errors.
- Profile card updated with Zhang Haoyu portrait, `AIGC 设计师` title, and verified real WeChat / phone / Xiaohongshu contact details.
- Removed the old pending social-platform placeholder from the red contact card.
- Footer contact section now uses the same real contact details and no longer links to the placeholder email.
- Screenshot: `profile-updated-contact.png`
- `preview.html` has been reduced to a preview launcher so stale static contact/project content does not drift from the React version.
- Performance pass added WebP derivatives under `public/assets/optimized`, including a ~40KB hero poster and ~1.47MB H.264 no-audio hero background video.
- Hero background now shows the poster first and only mounts video after idle on capable desktop sessions; reduced-motion, small viewport, save-data, and slow-connection sessions stay on the poster fallback.
- Rendered images now use an `OptimizedImage` wrapper with WebP `<source>`, lazy loading, async decoding, and original image fallback.
- Toy IP expansion now wires `aria-controls`; the member switcher uses tablist/tab/tabpanel semantics with arrow-key switching.
- Vite production build passed after the performance/accessibility pass.
- Local HTTP asset checks passed for the optimized poster, video, favicon, portrait, and Toy IP cover. Browser plugin verification was blocked by the local sandbox; Chrome headless screenshot also failed in this environment.
- Toy IP character logos were replaced from the new reference images in order: Yan Ya, Mobi, Po Xiao, Yin Po. The same logo image is used in each member impact panel and archive emblem slot, following the earlier Mobi logo layout.
- Optimized WebP derivatives were generated for the four new character logos.
- Fixed non-Mobi Toy IP archive right-column text box overflow/misalignment by giving the logo slot less height, giving the breakdown box more height, and forcing the four breakdown cards into stable equal rows.
- Reworked the Toy IP member tabs so every `aria-controls` target now exists in the DOM: each member has a persistent `tabpanel`, and inactive panels are hidden with `hidden` / `aria-hidden` plus a CSS guard.
- Morale Charge band tab was rebuilt from three simple spreads into four portfolio spreads: `Band Cover`, `Line Up`, `Photo Archive`, and `Poster System`.
- Added five band group-photo assets under `public/assets/toy-ip/band/`, generated a standalone `morale-charge-neo-comic-poster.png`, and created matching WebP derivatives under `public/assets/optimized/toy-ip/band/`.
- The band tab now uses optimized image mapping for the new group photos and poster, with dedicated responsive CSS for wide, square, tall, and poster frames so images keep stable proportions instead of stretching.
- Vite production build passed after the Morale Charge band section update.
- Local HTTP asset checks passed for the new blue-stage group image and neo-comic poster in both original PNG and optimized WebP forms. Browser plugin verification was still blocked by the Windows sandbox (`CreateProcessAsUserW failed: 5`), so real pixel layout should be manually checked in the running browser.
- Reworked the Morale Charge band layout to avoid cropping original group photos: band images now render with `contain`, frame proportions were adjusted around the source aspect ratios, and the neo-comic poster was regenerated with each source photo fully embedded inside its panel instead of using cover crops.
- Vite production build passed after the no-crop band layout revision; local HTTP checks passed for the regenerated poster PNG and optimized WebP.
- Replaced the two-image `Line Up` media layout with `group-color-lineup.jpg` from `E:\士气学习\合照2.jpg`, generated `group-color-lineup.webp`, and mapped it through `OptimizedImage`.
- Fixed Morale Charge cover text overlap by giving the cover spread a wider text column, reducing the cover title scale, constraining title wrapping inside the text column, and adding desktop spacing below the band lockup so the image cannot visually press over the copy.
- Vite production build passed after the line-up replacement and cover text-overlap fix; local HTTP checks passed for the new line-up JPG and WebP assets.
- Enriched the Morale Charge neo-comic poster with denser editorial collage details: file card, role tickets, halftone photo panels, side copy, red archive stickers, barcode blocks, setlist, system card, ticket strip, and bottom member rail.
- The enriched poster still keeps each source photo contained inside its panel instead of cropping the original images; regenerated both PNG and optimized WebP assets.
- Local HTTP checks passed for the enriched poster PNG and WebP assets.
- Vite production build passed after the enriched poster asset update.
- Versioned the enriched poster display asset to `morale-charge-neo-comic-poster-v2.jpg` and mapped it through `OptimizedImage` to `morale-charge-neo-comic-poster-v2.webp`, avoiding stale-cache risk from same-name asset replacement.
- Kept the high-resolution enriched PNG as `morale-charge-neo-comic-poster-v2-archive.png`; page display now uses a ~803.9KB JPG fallback and a ~327.5KB WebP source instead of the previous ~710.5KB WebP display asset.
- Vite production build passed after the poster versioning/compression update; local HTTP checks passed for the versioned JPG, WebP, and archive PNG assets.
- Added the Xiaoniaozhuo agriculture brand case with three supplied JPG boards under `public/assets/xiaoniaozhuo/`.
- Upgraded the `子洲县山地苹果小鸟啄` project card from an archive placeholder to a real expandable packaging case.
- The Xiaoniaozhuo case keeps the global dark exhibition frame and uses muted apple green only as a local project accent.
- Vite production build passed after the Xiaoniaozhuo case update.
- Browser plugin was invoked first but blocked by the Windows sandbox; fallback Chrome/Playwright verification passed at 1600x1000, 1904x888, and 390x844.
- Xiaoniaozhuo visual checks passed with no console errors, no horizontal overflow, no detected text clipping, and all three case images loaded.
- Screenshots: `qa-screenshots/xiaoniaozhuo-desktop.png`, `qa-screenshots/xiaoniaozhuo-wide-short.png`, `qa-screenshots/xiaoniaozhuo-mobile.png`.
- Optimized the Xiaoniaozhuo expanded case images by generating 2400px WebP sources under `public/assets/optimized/xiaoniaozhuo/`: overview ~519.3KB, detail ~415.1KB, packaging ~322.5KB.
- Added the three Xiaoniaozhuo JPG fallback paths to `OPTIMIZED_IMAGE_SOURCES`, so `OptimizedImage` now serves WebP `<source>` first while preserving original JPG fallback.
- Recompressed direct WebP card assets: `xiaoniaozhuo-overview-card.webp` from ~686.2KB to ~239.6KB, `board-01-home-card.webp` from ~967.7KB to ~321.7KB, and `board-01-card-reference.webp` from ~231.9KB to ~150.2KB.
- Versioned the two directly referenced project-card assets as `xiaoniaozhuo-overview-card-v2.webp` and `board-01-card-reference-v2.webp`, then updated the project cards to avoid stale-cache risk from same-name public assets.
- Vite production build passed after the image optimization update; local HTTP checks returned 200 for all new optimized Xiaoniaozhuo WebP files and compressed card assets.
- Local visual spot checks passed for optimized Xiaoniaozhuo overview/detail images and the compressed welfare card reference. Browser-level recheck was attempted through Node REPL/Playwright but was blocked by the Windows sandbox or missing local `playwright-core`.
- Added the Professor-Z virtual human case and upgraded the `虚拟人物设计` project card from an archive placeholder to a real expandable case.
- Copied 7 supplied Professor-Z assets into `public/assets/virtual-human/` and generated matching WebP sources under `public/assets/optimized/virtual-human/`.
- WebP display sizes: portrait ~81.9KB, turnaround ~125.5KB, astrologer poster ~392.4KB, fashion poster ~217.2KB, fashion board ~130.5KB, 6102P concept poster ~221.9KB, watch contact sheet ~170.4KB.
- The new virtual human panel uses the supplied character lore: 1492 Mediterranean origin, immortal observer, scholar-astrologer identity, lynx-like ears, brass chaos-orbit glasses, and 6102P concept commercial endorsement wording without implying an official partnership.
- Added `VirtualHumanPortfolio`, `isVirtualHumanOpen`, `virtual-human-case-panel`, `virtual-human-case-toggle`, optimized image mappings, and dedicated responsive CSS for desktop and mobile layouts.
- Vite production build passed after the Professor-Z case update.
- Local dev server was started at `http://127.0.0.1:5173/` after an approved out-of-sandbox launch because sandboxed background process attempts did not persist.
- Local HTTP checks returned 200 for the page plus all 7 original Professor-Z assets and all 7 optimized WebP assets.
- Browser/Chrome pixel verification tools were not available in this turn, and Node REPL browser automation was blocked by the Windows sandbox (`CreateProcessAsUserW failed: 5`), so this round records build, HTTP, resource, and static DOM/CSS verification rather than screenshot proof.
- Added a Bai Chuan Eastern Journey storyboard section inside the Professor-Z virtual human case, covering five acts: `缘起 · 松壑云桥`, `同行 · 漓江竹筏`, `观星 · 敦煌月夜沙丘`, `问道 · 黄山云海孤松`, and `归途 · 江南烟雨水巷`.
- Copied 5 supplied storyboard JPGs into `public/assets/virtual-human/` using stable Professor-Z/Bai Chuan filenames.
- Generated 2400px WebP sources under `public/assets/optimized/virtual-human/`: origin ~389.5KB, companion ~423.3KB, stargazing ~555.1KB, inquiry ~385.2KB, return ~380.3KB.
- Updated `VirtualHumanPortfolio` with `journeyScenes`, a responsive `.virtual-human-journey` section, alternating desktop storyboard rows, and single-column mobile fallbacks.
- Added the 5 Bai Chuan originals to `OPTIMIZED_IMAGE_SOURCES` so the new section serves WebP first while preserving JPG fallback.
- Vite production build passed after the Bai Chuan storyboard update.
- Local HTTP checks returned 200 for the page plus all 5 original Bai Chuan assets and all 5 optimized WebP assets.
- Browser plugin tools were not exposed after tool discovery, and Node REPL browser automation still failed in the Windows sandbox (`CreateProcessAsUserW failed: 5`), so this round records build, HTTP, resource, and static CSS/JS verification rather than screenshot proof.
- Moved the Bai Chuan Eastern Journey storyboard after the original 7 Professor-Z visual assets, preserving the requested sequence of character archive first and story expansion second.
- Adjusted the Bai Chuan storyboard heading layout so the desktop title `白川出现以后，观察第一次变成同行。` has full-width line flow and does not break `观察` across lines; tablet and mobile breakpoints still allow safe wrapping to prevent overflow.
- Vite production build passed after the storyboard order and heading wrap fix; local page check returned HTTP 200 at `http://127.0.0.1:5173/`.

Remaining iteration notes:
- Replace the central video crop with a real portrait or AI-generated character image when final personal imagery is available.
- Fine-tune the exact hero word crop after the preferred desktop viewport is chosen.

final result: passed

## 2026-06-19 motion director performance optimization

- User confirmed optimization after the automation review flagged GSAP bundle size, missing `check` script, stale screenshot evidence, and noisy local browser profile directories.
- Split `MotionDirector` out of the main app bundle with `React.lazy` and `Suspense`, while preserving the existing motion component API and reduced-motion behavior.
- Updated `usePrefersReducedMotion` so the initial state reads `window.matchMedia('(prefers-reduced-motion: reduce)')`; reduced-motion users no longer mount the lazy MotionDirector entry.
- Added `npm run check` via `scripts/check.mjs`. The script now runs Vite build, checks `/assets` references, validates `OPTIMIZED_IMAGE_SOURCES` WebP derivations, scans for debug/mojibake residue, and enforces JS gzip budgets.
- Added `.tmp-*` and `qa-edge-profile-*` to `.gitignore` so local browser QA profiles do not become tracked project artifacts if the folder becomes a Git repo later.
- `npm run check` passed. Vite output now splits the JS into `index-BzUZYPFG.js` 290.97KB (gzip 94.76KB) and `MotionDirector-B0eCrccv.js` 125.55KB (gzip 48.07KB), instead of the previous single 416.41KB app bundle (gzip 142.42KB).
- Resource scan passed with 164 asset reference hits, 82 unique asset paths, and 0 missing resources.
- Optimized image scan passed with 68 mapped source images and 0 missing derived WebP files.
- Debug residue scan passed with 0 matches for `TODO`, `FIXME`, `debugger`, `console.log`, or common mojibake markers.
- Local HTTP HEAD checks returned 200 for `/`, `src/App.jsx`, `MotionDirector.jsx`, the hero optimized poster/video, and `guitar-tuner-interface.webp`.
- Browser-level screenshot verification was not completed in this pass because no local browser control tool was exposed in the current tool set; this remains a manual/pixel QA follow-up, not a failed build condition.

final result: passed
