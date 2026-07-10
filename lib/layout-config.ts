export const layoutConfig = {
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  grid: {
    columns: 12,
    gap: {
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
    },
    maxWidth: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      full: "100%",
    },
  },
  sidebar: {
    width: "280px",
    collapsedWidth: "64px",
    mobileWidth: "100%",
    breakpoint: "lg",
    autoCollapseBelow: "md",
  },
  header: {
    height: "64px",
    mobileHeight: "56px",
  },
  zIndex: {
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    drawer: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  spacing: {
    pagePadding: {
      mobile: "1rem",
      tablet: "1.25rem",
      desktop: "1.5rem",
    },
    cardPadding: {
      mobile: "1rem",
      tablet: "1.25rem",
      desktop: "1.5rem",
    },
    sectionGap: {
      mobile: "1.5rem",
      tablet: "2rem",
      desktop: "3rem",
    },
  },
  responsive: {
    gridCols: {
      mobile: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 4,
      "2xl": 4,
    },
    statsGrid: {
      mobile: 1,
      sm: 2,
      md: 4,
      lg: 4,
      xl: 4,
    },
    signalsGrid: {
      mobile: 1,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 3,
    },
  },
} as const

export type LayoutConfig = typeof layoutConfig
export type Breakpoint = keyof typeof layoutConfig.breakpoints
