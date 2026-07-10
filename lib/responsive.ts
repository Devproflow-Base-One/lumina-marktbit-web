/**
 * Responsive Design Utilities
 * Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
 */

export const responsiveClasses = {
  // Container padding
  containerPadding: 'px-4 py-6 sm:px-6 lg:px-8',
  
  // Grid layouts
  gridAuto: 'grid gap-4 auto-cols-max',
  grid1Col: 'grid gap-4 grid-cols-1',
  grid2Col: 'grid gap-4 sm:grid-cols-2',
  grid3Col: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  grid4Col: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  grid6Col: 'grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  
  // Flex layouts
  flexCol: 'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
  flexColMd: 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between',
  
  // Text sizes
  textXs: 'text-xs sm:text-sm',
  textSm: 'text-sm sm:text-base',
  textBase: 'text-base sm:text-lg',
  textLg: 'text-lg sm:text-xl',
  textXl: 'text-xl sm:text-2xl',
  text2xl: 'text-2xl sm:text-3xl',
  text3xl: 'text-3xl sm:text-4xl',
  
  // Width utilities
  fullWidth: 'w-full',
  maxWidth: 'max-w-[1600px]',
  maxWidthMd: 'max-w-2xl',
  maxWidthLg: 'max-w-4xl',
  
  // Sidebar responsive
  sidebarHidden: 'hidden lg:block',
  sidebarMobile: 'block lg:hidden',
  
  // Card spacing
  cardPadding: 'p-4 sm:p-6',
  cardPaddingLg: 'p-6 sm:p-8',
  
  // Button sizing
  buttonSmall: 'px-2 py-1 sm:px-3 sm:py-2',
  buttonMedium: 'px-3 py-2 sm:px-4 sm:py-2.5',
  buttonLarge: 'px-4 py-2.5 sm:px-6 sm:py-3',
}

/**
 * Responsive breakpoint detection hook
 * Use in client components to detect current breakpoint
 */
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

/**
 * Common responsive patterns
 */
export const responsivePatterns = {
  // Header with sidebar
  layoutWithSidebar: {
    container: 'flex min-h-screen flex-col md:flex-row',
    sidebar: 'hidden lg:block transition-all duration-300',
    main: 'flex min-w-0 flex-1 flex-col',
  },
  
  // Stats cards
  statsCards: {
    container: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
    card: 'border-zinc-800 bg-zinc-950/90 hover:border-yellow-500/30 transition-colors duration-200',
  },
  
  // Content grid
  contentGrid: {
    container: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
    card: 'border-zinc-800 bg-black/35 hover:border-yellow-500/30 hover:bg-zinc-900/50 transition-all duration-200',
  },
  
  // Two column layout
  twoColumn: {
    container: 'grid gap-6 lg:grid-cols-2',
    left: 'space-y-4',
    right: 'space-y-4',
  },
  
  // Three column layout
  threeColumn: {
    container: 'grid gap-6 lg:grid-cols-3',
    column: 'space-y-4',
  },
  
  // Mobile menu
  mobileMenu: {
    trigger: 'lg:hidden',
    menu: 'hidden lg:flex',
  },
}

/**
 * Responsive text utilities
 */
export const responsiveText = {
  heading1: 'text-2xl sm:text-3xl md:text-4xl font-bold',
  heading2: 'text-xl sm:text-2xl md:text-3xl font-bold',
  heading3: 'text-lg sm:text-xl md:text-2xl font-semibold',
  heading4: 'text-base sm:text-lg md:text-xl font-semibold',
  body: 'text-sm sm:text-base leading-relaxed',
  small: 'text-xs sm:text-sm text-zinc-500',
}

/**
 * Mobile-first spacing utilities
 */
export const responsiveSpacing = {
  sectionPadding: 'py-6 sm:py-8 md:py-12 lg:py-16',
  sectionGap: 'gap-4 sm:gap-6 md:gap-8 lg:gap-12',
  cardGap: 'gap-3 sm:gap-4 md:gap-6',
}
