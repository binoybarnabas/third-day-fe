export const colors = {
  // Brand Colors
  google: {
    blue: "#4285F4",
    green: "#34A853",
    yellow: "#FBBC05",
    red: "#EA4335",
  },
  
  // Base Colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
  
  // Semantic Colors (matching globals.css variables conceptually, but fixed values for JS usage if needed)
  // These HSL values correspond to the variables defined in globals.css
  // Ideally, these should be the source of truth if we could inject them into CSS.
  // For now, these serve as the central definition for JS-side usage.
  theme: {
    light: {
      background: "0 0% 100%",
      foreground: "0 0% 0%",
      card: "0 0% 100%",
      cardForeground: "0 0% 0%",
      popover: "0 0% 100%",
      popoverForeground: "0 0% 0%",
      primary: "0 0% 0%",
      primaryForeground: "0 0% 100%",
      secondary: "0 0% 96%",
      secondaryForeground: "0 0% 0%",
      muted: "0 0% 96%",
      mutedForeground: "0 0% 45%",
      accent: "0 0% 96%",
      accentForeground: "0 0% 0%",
      destructive: "0 84% 60%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 90%",
      input: "0 0% 90%",
      ring: "0 0% 0%",
    },
    dark: {
      background: "0 0% 3%",
      foreground: "0 0% 98%",
      card: "0 0% 3%",
      cardForeground: "0 0% 98%",
      popover: "0 0% 3%",
      popoverForeground: "0 0% 98%",
      primary: "0 0% 98%",
      primaryForeground: "0 0% 9%",
      secondary: "0 0% 12%",
      secondaryForeground: "0 0% 98%",
      muted: "0 0% 12%",
      mutedForeground: "0 0% 60%",
      accent: "0 0% 12%",
      accentForeground: "0 0% 98%",
      destructive: "0 62% 30%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 12%",
      input: "0 0% 12%",
      ring: "0 0% 83%",
    }
  },

  // Chart Colors (extracted from usage)
  chart: {
    grid: "#cccccc", // #ccc
    text: "#888888", // muted-foreground approx
    stroke: "#cccccc",
    fill: "#ffffff", // #fff
  }
} as const;
