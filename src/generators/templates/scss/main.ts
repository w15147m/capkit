export function getScssMainTemplate(): string {
  return `@use './variables' as *;

// ─── Reset & Base ────────────────────────────────────────────────────────────
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: $font-sans;
  background-color: $bg-dark;
  color: $text-primary;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

// ─── Utility Mixins ──────────────────────────────────────────────────────────
@mixin card {
  background: $bg-card;
  border-radius: $radius-lg;
  padding: $space-lg;
}

@mixin glass {
  background: rgba($bg-surface, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

// ─── Buttons ─────────────────────────────────────────────────────────────────
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-sm;
  padding: 10px 20px;
  border: none;
  border-radius: $radius-md;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;

  &:active { transform: scale(0.97); }

  &--primary {
    background: $color-primary;
    color: white;
    &:hover { box-shadow: 0 4px 14px rgba($color-primary, 0.4); }
  }

  &--danger {
    background: transparent;
    color: $color-danger;
    border: 1px solid $color-danger;
    &:hover { background: rgba($color-danger, 0.1); }
  }
}
`
}
