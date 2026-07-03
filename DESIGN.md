# Design

## Visual Direction

The portfolio uses a dark exhibition system with iOS-like technological art direction. It should feel precise, cinematic, and controlled: frosted black surfaces, thin cool-gray rules, compact system typography, and a red signal layer for identity.

This is not an iOS app clone. The reference is the system-level clarity of Apple interfaces translated into a portfolio: legible type, calm density, sharp hierarchy, and restrained material effects.

## Color Tokens

- Background: near-black, layered with cooler charcoal panels rather than pure black.
- Surface: translucent black and deep graphite with subtle white borders.
- Ink: fog-white for primary text.
- Muted text: cool gray and soft white alpha values with AA contrast.
- Accent: `#ff2a14`, used as Zhang Haoyu's signature red signal.
- Project supporting tones: restrained archive colors only, used inside placeholder states and Toy IP surfaces.

## Typography

Use local system fonts only. Display and technical labels now prefer `Bahnschrift`, `Segoe UI Variable Display`, and `Segoe UI Variable` to create a colder industrial-tech tone on Windows, while Apple devices fall back to native system fonts. Chinese text keeps `Microsoft YaHei UI`, `PingFang SC`, and related system fallbacks so it stays clear and does not become thin or fuzzy.

Display typography should be crisp, slightly condensed, and system-like, with controlled letter spacing, strong but not bloated weights, balanced line heights, and no decorative serif substitution.

Chinese body text should stay clear and not become too thin. English metadata, numbers, project indices, and compact labels may use the technical stack with tabular numerals.

## Layout

The homepage keeps the current route and section order:

- fixed navigation
- hero
- profile
- selected projects
- strengths
- contact

The composition should feel like a curated archive surface. Hero and Toy IP are allowed to be expressive; supporting sections should become quieter and more precise.

## Components

- Navigation: compact frosted bar, one-line desktop layout, strong contact action.
- Hero: oversized `ZHANG / HAOYU` poster typography, clearer personal identity, controlled CTA placement.
- Profile: portrait and career data as system panels, less heavy card styling.
- Project cards: real image cards for completed/expanded work, refined archive placeholders for reserved work.
- Toy IP: preserve tabs and panel behavior, improve spacing, text scale, material consistency, and mobile stability.
- Strengths: proof-oriented capability blocks, less like four identical feature cards.
- Contact: final action band with one clear collaboration intent.

## Motion

Motion should support hierarchy and feedback only. Hover states can use small translate and material changes. Existing reduced-motion rules must remain. Do not add scroll hijacks or continuous animation loops in this pass.

## Implementation Guardrails

- Do not change section ids, primary nav labels, or contact details.
- Do not add external font or UI dependencies.
- Do not use gradient text, em dashes, fake screenshots, or decorative version labels.
- Keep theme locked to dark mode.
- Use real assets where available; reserved projects should look intentionally archived, not incomplete.
