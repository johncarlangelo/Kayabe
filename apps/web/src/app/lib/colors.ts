/** CSS-variable palette — resolves correctly in both dark and light modes */
export const C = {
  // Surfaces
  app:    "var(--bg-app)",
  panel:  "var(--bg-panel)",
  card:   "var(--bg-card)",
  menu:   "var(--bg-menu)",
  input:  "var(--bg-input)",
  inset:  "var(--bg-inset)",
  hover:  "var(--bg-hover)",
  active: "var(--bg-active-nav)",
  // Borders
  bSubtle: "var(--border-subtle)",
  bHighlight: "var(--border-highlight)",
  bInput:  "var(--border-input)",
  bFocus:  "var(--border-focus)",
  // Text
  t1:   "var(--text-primary)",
  t2:   "var(--text-secondary)",
  t3:   "var(--text-muted)",
  tBtn: "var(--text-on-accent)",
  // Accents
  primary:  "var(--accent-primary)",
  cta:      "var(--accent-cta)",
  ctaHover: "var(--accent-hover)",
  subtle:   "var(--accent-subtle)",
  link:     "var(--accent-link)",
  headline: "var(--accent-headline)",
  // Secondary button
  btnSecBg:   "var(--btn-secondary-bg)",
  btnSecText: "var(--btn-secondary-text)",
  // Status
  success: "var(--status-success)",
  warn:    "var(--status-warning)",
  error:   "var(--status-error)",
  info:    "var(--status-info)",
  // Brand
  logoBg:  "var(--brand-logo-bg)",
  logoIcon:"var(--brand-logo-icon)",
  btn:     "var(--brand-btn)",
  btnText: "var(--brand-btn-text)",
  // Neumorphic shadows
  raised:      "var(--nm-raised)",
  raisedSm:    "var(--nm-raised-sm)",
  raisedXs:    "var(--nm-raised-xs)",
  nmInset:     "var(--nm-inset)",
  nmInsetSm:   "var(--nm-inset-sm)",
  nmInsetXs:   "var(--nm-inset-xs)",
  accentRaised:"var(--nm-accent-raised)",
  glow:        "var(--nm-glow)",
} as const;

/** Resolve chart hex values for recharts (SVG gradients can't use CSS vars reliably) */
export function chartColors(isDark: boolean) {
  return isDark
    ? { c1: "#00D2EE", c2: "#0066FF", c3: "#10B981", c4: "#F59E0B", c5: "#64748B" }
    : { c1: "#0066FF", c2: "#00D2EE", c3: "#10B981", c4: "#F59E0B", c5: "#64748B" };
}
