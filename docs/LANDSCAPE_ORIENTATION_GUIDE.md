# Mobile Landscape Orientation Guide

## Overview
Lumina Dashboard automatically adapts to landscape orientation on mobile devices. When users rotate their device, the layout optimizes for the wider but shorter viewport.

## How It Works

### Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=true">
```

**Settings:**
- `width=device-width` - Responsive to device width
- `initial-scale=1` - No zoom on load
- `maximum-scale=5` - Allow user zoom up to 5x
- `user-scalable=true` - Allow pinch zoom

### CSS Media Queries

#### Mobile Landscape (max-height: 500px)
When viewport height is less than 500px (typical mobile landscape):

**Changes:**
- Reduced padding: 0.5rem (8px) instead of 1.5rem (24px)
- Compact header: 0.5rem padding
- Reduced spacing: 0.5rem gap instead of 1rem
- Sidebar becomes visible (override hidden lg:block)
- Smaller font sizes and button padding
- Reduced heading margins

**Result:** Compact, scrollable layout optimized for landscape viewing

#### Tablet Landscape (500px - 800px height)
More spacious layout for tablets in landscape:

**Changes:**
- Standard padding: 1rem (16px)
- Normal spacing: 1rem gap
- Sidebar visible
- Full font sizes

#### Desktop Landscape (800px+ height)
Full desktop experience:

**Changes:**
- Full padding: 1.5rem (24px)
- Normal spacing: 1rem gap
- All features available

## Practical Examples

### Mobile Portrait (375x667)
```
┌─────────────────────┐
│   Header            │
├─────────────────────┤
│ Stats Card 1        │
│ Stats Card 2        │
│ Stats Card 3        │
│ Stats Card 4        │
├─────────────────────┤
│ Content Grid (1 col)│
│ ├─ Card 1          │
│ ├─ Card 2          │
│ └─ Card 3          │
└─────────────────────┘
```

### Mobile Landscape (667x375)
```
┌──────────────────────────────────────────────────┐
│ Header (Compact)                                 │
├──────────────────────────────────────────────────┤
│ Sidebar │ Stats (2x2) │ Content Grid (2 cols)   │
│ (Visible)│            │ ├─ Card 1  │ Card 2     │
│         │            │ ├─ Card 3  │ Card 4     │
│         │            │ └─ Card 5  │ Card 6     │
└──────────────────────────────────────────────────┘
```

## Testing Landscape Mode

### Using Browser DevTools
1. Open Chrome DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select device (e.g., iPhone 12)
4. Rotate device (Ctrl+Shift+R or button in DevTools)

### Using Real Device
1. Open app in mobile browser
2. Rotate device to landscape
3. Layout should auto-adjust

### Testing Checklist
- [ ] Header compacts properly
- [ ] Sidebar becomes visible
- [ ] Content grid shows 2 columns
- [ ] Spacing is compact but readable
- [ ] No horizontal scroll
- [ ] All buttons accessible
- [ ] Text remains readable
- [ ] Images scale properly

## CSS Media Query Syntax

### Orientation-based
```css
/* Portrait only */
@media (orientation: portrait) {
  /* Styles */
}

/* Landscape only */
@media (orientation: landscape) {
  /* Styles */
}
```

### Height-based
```css
/* Small landscape (mobile) */
@media (max-height: 500px) and (orientation: landscape) {
  /* Compact styles */
}

/* Medium landscape (tablet) */
@media (min-height: 500px) and (max-height: 800px) and (orientation: landscape) {
  /* Medium styles */
}

/* Large landscape (desktop) */
@media (min-height: 800px) and (orientation: landscape) {
  /* Full styles */
}
```

## Implementation Details

### Current Breakpoints
| Viewport | Height | Layout | Sidebar |
|----------|--------|--------|---------|
| Mobile Portrait | 667px | 1 column | Hidden |
| Mobile Landscape | 375px | Compact 2-col | Visible |
| Tablet Portrait | 1024px | 2-3 columns | Hidden |
| Tablet Landscape | 768px | 3 columns | Visible |
| Desktop | 1080px+ | 4 columns | Visible |

### Spacing Adjustments
| Context | Portrait | Landscape |
|---------|----------|-----------|
| Main padding | 1.5rem | 0.5rem (mobile), 1rem (tablet) |
| Card padding | 1.5rem | 0.75rem (mobile), 1rem (tablet) |
| Grid gap | 1rem | 0.5rem (mobile), 1rem (tablet) |
| Header padding | 1rem | 0.5rem (mobile) |

## Best Practices

1. **Test on Real Devices**: Browser DevTools don't always match real device behavior
2. **Avoid Fixed Heights**: Use min-height/max-height instead
3. **Flexible Layouts**: Use flexbox and grid for responsive behavior
4. **Touch-Friendly**: Ensure buttons are 44px+ even in landscape
5. **Readable Text**: Don't reduce font sizes too much
6. **Scrollable Content**: Allow vertical scroll for long content
7. **Sidebar Visibility**: Show sidebar in landscape for better UX

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | All features supported |
| Firefox | ✅ Full | All features supported |
| Safari | ✅ Full | All features supported |
| Edge | ✅ Full | All features supported |
| Samsung Internet | ✅ Full | All features supported |

## Troubleshooting

### Layout doesn't adapt
- Check viewport meta tag is present
- Verify CSS media queries are loaded
- Clear browser cache
- Test on real device

### Text too small in landscape
- Increase font size in media query
- Use relative units (em, rem)
- Test readability

### Sidebar not showing
- Check `aside.hidden` override in media query
- Verify `display: block !important` is applied
- Test with different devices

### Content cuts off
- Check for fixed widths
- Use `max-w-full` instead of fixed widths
- Verify overflow handling

## Future Improvements

- [ ] Add landscape-specific navigation drawer
- [ ] Optimize sidebar width for landscape
- [ ] Add landscape-specific component variants
- [ ] Implement device orientation lock option
- [ ] Add landscape-specific animations
