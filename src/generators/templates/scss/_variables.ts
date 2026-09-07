export function getScssVariablesTemplate(): string {
  return `// ─── Design Tokens ────────────────────────────────────────────────────────────
// Customise these variables to match your brand.

// Colors
$color-primary:    #7c3aed;
$color-secondary:  #06b6d4;
$color-success:    #10b981;
$color-warning:    #f59e0b;
$color-danger:     #ef4444;
$color-info:       #3b82f6;

// Background
$bg-dark:      #0f172a;
$bg-surface:   #1e293b;
$bg-card:      #1e293b;

// Text
$text-primary:   #f8fafc;
$text-secondary: #94a3b8;

// Spacing
$space-xs: 4px;
$space-sm: 8px;
$space-md: 16px;
$space-lg: 24px;
$space-xl: 32px;

// Radius
$radius-sm:  8px;
$radius-md: 12px;
$radius-lg: 20px;
$radius-xl: 28px;

// Font
$font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

// Safe area
$safe-top:    env(safe-area-inset-top, 0px);
$safe-bottom: env(safe-area-inset-bottom, 0px);
`
}
