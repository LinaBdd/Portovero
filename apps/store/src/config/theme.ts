export const theme = {
  colors: {
    background: "#F8F5F0",
    foreground: "#111111",

    primary: "#3E4D3A",      // Olive
    secondary: "#7C5C3B",    // Brun
    accent: "#D1B87C",       // Doré

    navy: "#1B2241",

    white: "#FFFFFF",

    muted: "#8C8C8C",

    border: "#E5E5E5",

    success: "#3A7D44",
    warning: "#C28A00",
    danger: "#B3261E",
  },

  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },

  shadow: {
    sm: "0 2px 8px rgba(0,0,0,.05)",
    md: "0 8px 24px rgba(0,0,0,.08)",
    lg: "0 20px 40px rgba(0,0,0,.12)",
  },

  spacing: {
    section: "120px",
    container: "1280px",
  },

  animation: {
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
  },
} as const;

export type Theme = typeof theme;