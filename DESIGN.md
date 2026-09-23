# Design System: Kayabé — Cool Neumorphism (Soft UI 2.5D)

## 1. Visual Theme & Atmosphere
Kayabé is an anti-slop, tactile task orchestration workspace built with a **Cool-Toned Neumorphic (Soft UI 2.5D)** visual architecture. It rejects the generic AI defaults (flat dark cards, neon-purple button glows, centered 4-box rainbow grids, and vague marketing clichés) in favor of physical materiality: directional 45° bevel lighting, debossed input wells, elevated tactile cards, crisp slate typography, and singular electric cyan telemetry.

- **Visual Density:** `5` (Daily App Balanced — generous breathing room, structured data hierarchy)
- **Design Variance:** `7` (Asymmetric layout splits, rhythm-driven bento grids, no generic centered clichés)
- **Motion Intensity:** `6` (Tactile spring physics `stiffness: 100, damping: 20`, physical button depression, 45° directional lighting consistency)

The atmosphere is tactile, architectural, and razor-sharp — reminiscent of a high-end physical industrial instrument with precision machined switches, soft matte surfaces, and icy cool slate undertones.

---

## 2. Color Palette & Roles

### Base Surfaces & Lighting (Cool Slate Matrix)
- **Canvas Background** (`--bg-canvas`): `#EBF1F5` (Light) / `#0D111D` (Dark) — Primary atmospheric foundation.
- **Raised Surface** (`--bg-surface`): `#F4F8FA` (Light) / `#141927` (Dark) — Elevated cards, buttons, floating toolbars.
- **Debossed Well** (`--bg-inset`): `#E2E8F0` (Light) / `#090C15` (Dark) — Inset input fields, code containers, active drop zones.
- **Subtle Highlight** (`--border-subtle`): `rgba(255, 255, 255, 0.7)` (Light) / `rgba(255, 255, 255, 0.08)` (Dark) — 1px top-left bevel sheen.

### Typography & Ink
- **Deep Slate Ink** (`--text-primary`): `#1E293B` (Light) / `#F1F5F9` (Dark) — Primary headings and high-contrast copy.
- **Steel Metadata** (`--text-secondary`): `#64748B` (Light) / `#94A3B8` (Dark) — Subtitles, table headers, secondary labels.
- **Muted Blueprint** (`--text-muted`): `#94A3B8` (Light) / `#64748B` (Dark) — Form placeholders, timestamps, keyboard shortcut hints.

### Singular Accent & Focus (Controlled Cyan / Deep Cobalt)
- **Electric Cyan** (`--accent-primary`): `#00D2EE` — Active indicators, focus rings, primary CTA highlights (Saturation < 80%).
- **Deep Cobalt** (`--accent-secondary`): `#0066FF` — Primary action surfaces, selected navigation pills.
- **Text on Accent** (`--text-on-accent`): `#FFFFFF` — Crisp readable label on active buttons.

### Functional Status Indicators
- **Success Mint** (`--status-success`): `#10B981` — Completed tasks, verified states.
- **Warning Amber** (`--status-warning`): `#F59E0B` — Due soon, high priority.
- **Urgent Coral** (`--status-error`): `#EF4444` — Overdue, blocker, destructive actions.

### 45° Directional Lighting Vectors
- **Light Source Key:** Top-Left (`-1, -1`)
- **Light Highlight Color:** `#FFFFFF` (Light mode 100% opacity, Dark mode 4% opacity)
- **Dark Shadow Color:** `rgba(166, 180, 200, 0.60)` (Light mode), `rgba(0, 0, 0, 0.65)` (Dark mode)

---

## 3. Typography Rules

- **Display & Headlines:** `Geist Sans`, `Outfit`, or system neo-grotesque. Track-tight (`tracking-tight` or `-0.03em`), maximum 2 lines on desktop, weight-driven hierarchy (`font-bold` / `font-extrabold`). Never screaming at `text-8xl`.
- **Body:** `Geist Sans`, relaxed leading (`leading-relaxed`), strict maximum 65 characters per line (`max-w-[65ch]`), color locked to Deep Slate Ink or Steel.
- **Monospace & Metadata:** `Geist Mono` or `JetBrains Mono` for task IDs (`KB-104`), timestamps, status tags, and keyboard accelerators (`⌘K`).
- **Serif Ban:** Generic serifs (`Times`, `Georgia`, `Garamond`) and LLM-default display serifs (`Fraunces`, `Instrument Serif`) are strictly **BANNED**. Software workflows and dashboards use clean sans + monospace pairings exclusively.
- **Emphasis Rule:** Emphasize keywords using font weight or italic in the *same* font family. Never inject random fonts into headlines.

---

## 4. Component Behaviors & Materiality

### Elevated Cards & Panels (`.nm-raised`, `.nm-card`)
- **Geometry:** Rounded corners `16px` to `24px`.
- **Lighting:** Dual-source box shadow (`-6px -6px 14px var(--shadow-light)`, `6px 6px 16px var(--shadow-dark)`).
- **Border:** 1px top-left specular highlight (`rgba(255,255,255,0.8)` in light, `rgba(255,255,255,0.06)` in dark).

### Tactile Action Buttons (`.nm-btn`)
- **Default State:** Elevated pill or rounded rectangle with soft tactile bevel.
- **Active State (Push):** Tactile depression using inset deboss (`box-shadow: inset 3px 3px 6px var(--shadow-dark), inset -3px -3px 6px var(--shadow-light)`) and `transform: translateY(1px) scale(0.99)`.
- **Primary CTA:** Deep Cobalt or Electric Cyan with specular edge highlight. Contrast ratio strictly passes WCAG AA (>4.5:1).
- **Single Line Requirement:** Button labels never wrap to multiple lines on desktop.

### Floating Elevated Input Fields (`.nm-input`)
- **Default State:** Elevated floating container with subtle 45° specular bevel (`box-shadow: var(--nm-raised-xs)`, `--bg-surface` fill, and 1px top-left specular highlight).
- **Hover State:** Soft lift with enhanced depth (`box-shadow: var(--nm-raised-sm)`).
- **Active Focus:** Electric Cyan perimeter ring (`box-shadow: var(--nm-raised-sm), 0 0 0 1px var(--accent-primary)`).
- **Label Placement:** Always label above input, error feedback below input. No placeholder-as-label.

### Skeletal Loaders & Empty States
- **Loaders:** Soft skeletal debossed wells matching component dimensions with a subtle 45° shimmer. No generic spinning SVG circles.
- **Empty States:** Composed tactile trays showing actionable next steps.

---

## 5. Layout Principles

- **Asymmetric Balance:** Centered hero sections with floating sparkles are BANNED. Hero sections must use Split-Screen (50/50), Left-aligned typography with tactile interactive workspace preview on the right, or asymmetric bento grids.
- **Bento Grid Discipline:** Banned the generic 4 equal rainbow-colored cards. Bento sections must feature asymmetric sizing (e.g. 2-column + wide terminal well), real task items, keyboard shortcuts, and tactile status pills.
- **Containment:** Max width constrained to `1280px` (`max-w-7xl mx-auto`).
- **Viewport Height Rule:** Use `min-h-[100dvh]` for hero and full-screen layouts. Never use `h-screen` (prevents iOS Safari jump).
- **Responsive Collapse:** Every multi-column section collapses cleanly to single column below `768px` (`md:`). Tap targets minimum `44px`.

---

## 6. Motion Philosophy & Spring Physics

- **Spring Physics Engine:** `type: "spring", stiffness: 100, damping: 20` for all tactile transitions and drawer reveals.
- **Tactile Compression:** Interactive elements compress physically on `:active` to simulate real-world mechanical switches.
- **Hardware Acceleration:** Animations restricted exclusively to `transform` and `opacity`. Never animate `top`, `left`, `width`, or `height`.
- **Reduced Motion:** Fully respect `prefers-reduced-motion: reduce` by degrading to static transitions.

---

## 7. Anti-Patterns & AI Clichés (Strictly Banned)

1. **NO AI Purple/Indigo Neon:** No `#6c63ff` gradients, no purple button glows, no random rainbow badge icons.
2. **NO 4-Box Rainbow Cards:** No identical cards containing purple, emerald, blue, and orange icons with filler copy.
3. **NO AI Marketing Clichés:** Ban "Build faster. Ship together.", "The next-generation collaborative workspace", "Triple your team velocity with smart automations", "Trusted by 10,000+ teams".
4. **NO Pure Black:** Never use `#000000`. Always use Deep Slate (`#1E293B` in light, `#0D111D` canvas in dark).
5. **NO Emojis in UI:** Replace emojis with structured Lucide / Phosphor icons.
6. **NO Broken / Fake Avatar Rows:** No generic initials circles with fake "+2,400 teams" claims.
7. **NO Flat Div-Screenshots:** Interface previews must be real tactile neumorphic components with functioning interactive states.
