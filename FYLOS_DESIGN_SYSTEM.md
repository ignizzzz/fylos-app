# Fylos Design System Reference

Use this document as context when building new screens. It contains every token, pattern, and component spec extracted from the Home, Inbox, and Activity screens.

---

## 1. Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-accent: #E85D2A;
  --color-accent-hover: #D04A1C;
  --color-primary-text: #111111;
  --color-secondary-text: #6E6E73;
  --color-tertiary-text: #8E8E93;
  --color-background: #F9F9FB;
  --color-surface: #FFFFFF;
  --color-surface-hover: #F2F2F7;
  --color-border: rgba(0, 0, 0, 0.04);
  --color-danger: #FF3B30;
  --color-danger-bg: #FFF0F0;
  --color-success: #34C759;
  --color-success-bg: #E5F9ED;
  --color-warning: #FF9500;
  --color-warning-bg: #FFF4E5;
  --color-info: #007AFF;
  --color-info-bg: #E5F0FF;

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-level-1: 0 2px 8px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03);
  --shadow-level-2: 0 10px 40px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04);
  --shadow-active-glow: 0 0 0 1px rgba(232,93,42,0.15), 0 4px 12px rgba(232,93,42,0.1);

  /* Motion */
  --motion-fast: 120ms;
  --motion-normal: 200ms;
  --motion-slow: 300ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Hardcoded Color Aliases (used directly in Tailwind)

| Purpose | Value |
|---------|-------|
| Accent gradient start | `#FF7240` |
| Accent gradient end | `#E85D2A` |
| Accent light (notifications) | `#FF6A3D` |
| Notification dot | `#FF6A3D` or `#FF7A4D` |
| Background | `#F9F9FB` |
| Surface | `#FFFFFF` |
| Surface alt | `#F2F2F7` |
| Surface alt 2 | `#F5F5F5` or `#F5F5F7` or `#F7F7F8` |
| Primary text | `#111111` |
| Secondary text | `#6E6E73` |
| Tertiary text | `#8E8E93` |
| Light text | `#9A9AA0` |
| Muted label text | `#76767D` or `#58585F` |
| Divider | `border-black/[0.04]` to `border-black/[0.08]` |
| Confirmed badge bg | `#EEF7F1` |
| Confirmed badge text | `#3F8D63` |
| Confirmed badge border | `#D7EBDD` |
| Pending badge bg | `#F7F4EF` |
| Pending badge text | `#B07A3A` |
| Pending badge border | `#ECDDC8` |
| Missed/Error text | `#D96852` |
| Liked state bg | `#FF6A3D/14` (14% opacity) |

---

## 2. iPhone Frame

```jsx
// Outer wrapper
<div style={{
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  minHeight: '100vh', backgroundColor: '#E5E5E5', padding: '20px',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
}}>
  {/* Phone frame */}
  <div style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#F9F9FB' }}>

    {/* Notch */}
    <div className="absolute left-1/2 -translate-x-1/2 z-[100]"
         style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

    {/* Home indicator */}
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
         style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

    {/* Status bar: 9:41, signal, wifi, battery */}
    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
         style={{ height: 54 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
      <div className="flex items-center gap-1">
        {/* Signal SVG */} {/* WiFi SVG */} {/* Battery SVG */}
      </div>
    </div>
  </div>
</div>
```

---

## 3. Floating Header

Used on all standalone screens (not the unified app shell).

```jsx
<header className="absolute top-0 left-0 w-full z-40 pointer-events-none
  bg-gradient-to-b from-white/95 via-white/70 to-transparent"
  style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
  <div className="flex justify-between items-center w-full pointer-events-auto">
    {/* Back button: 44x44 pill */}
    <button className="w-[44px] h-[44px] flex items-center justify-center
      bg-[#FFFFFF] border border-black/[0.06]
      shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px]
      active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
      <ChevronLeft size={22} color="#111111" />
    </button>

    {/* Title */}
    <h2 className="text-[17px] font-semibold text-[#111111]">Screen Title</h2>

    {/* Right spacer or action button */}
    <div className="w-[44px]" />
  </div>
</header>
```

### Scroll Container

```jsx
{/* Must clear the floating header */}
<div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
  <div className="wallet-scroll"
       style={{ flex: 1, paddingTop: 100, paddingBottom: 40, overflowY: 'auto' }}>
    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>
      {/* Content here */}
    </div>
  </div>
</div>
```

Key: `paddingTop: 100` on the scroll container to clear the floating header + status bar.

---

## 4. Tab Bar

```jsx
<nav className="absolute bottom-[22px] left-0 w-full px-5 z-40 pointer-events-none">
  <div className="pointer-events-auto bg-white/70 backdrop-blur-xl
    shadow-[var(--shadow-level-2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
    rounded-[9999px] h-[55px] flex justify-between items-center px-0.5">
    {/* Each tab */}
    <button className="relative flex-1 h-full flex flex-col items-center justify-center gap-[3px]
      active:scale-[0.95]">
      {/* Icon: size={18} */}
      {/* Active: text-[#E85D2A] scale-110, strokeWidth={2} */}
      {/* Inactive: text-[#8E8E93] opacity-60, strokeWidth={1.5} */}
      {/* Label: text-[10px] font-medium. Active: text-[#E85D2A] opacity-100. Inactive: opacity-0 */}
    </button>
  </div>
</nav>
```

---

## 5. Card Component

```jsx
// Default card
<div className="bg-white rounded-[20px] p-5
  shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]">

// Compact card
className="bg-white rounded-[16px] p-4 shadow-[...]"

// Highlighted card (accent left border)
className="bg-white rounded-[20px] p-5 shadow-[...accent-glow...] border-l-[3px] border-l-[#E85D2A]"

// Clickable card interaction
className="cursor-pointer hover:shadow-[var(--shadow-level-2)]
  active:-translate-y-[1px] active:scale-[0.99]"

// List card (no padding, overflow hidden)
className="bg-white rounded-[20px] p-0 shadow-[...] overflow-hidden"
```

---

## 6. Button Component

```jsx
// Primary (gradient)
className="bg-gradient-to-b from-[#FF7240] to-[#E85D2A] text-white
  shadow-[var(--shadow-level-1)] hover:opacity-95"

// Secondary
className="bg-white text-[#111111] shadow-[var(--shadow-level-1)]
  hover:bg-[#F2F2F7]"

// Sizes
// small:  px-3 py-2 text-[14px] rounded-[12px]
// medium: px-4 py-[14px] text-[16px] rounded-[16px]
// large:  px-6 py-4 text-[18px] rounded-[20px]

// All buttons: active:scale-[0.97] transition-all duration-[120ms]

// Disabled state
className="bg-[#F2F2F7] text-[#8E8E93] shadow-none cursor-not-allowed active:scale-100"
```

---

## 7. Typography Scale

| Element | Size | Weight | Color | Extra |
|---------|------|--------|-------|-------|
| Page title (greeting) | 24px | semibold (600) | #111111 | mb-[6px] |
| Page subtitle | 15px | normal (400) | #777777 | |
| Section header (prominent) | 17px | semibold (600) | #111111 | |
| Section header (uppercase) | 12px | bold (700) | #8E8E93 | uppercase tracking-widest |
| Card title | 15px | semibold (600) | #111111 | |
| Card subtitle | 13px | normal (400) | #6E6E73 | |
| Feed post title | 15px | semibold (600) | #111111 | leading-tight |
| Feed post meta | 12px | normal (400) | #8E8E93 | |
| Feed activity label | 14px | medium (500) | #111111 | leading-snug |
| Feed details text | 12px | normal (400) | #6E6E73 | |
| Timeline time | 12px | semibold (600) | #76767D | tracking-[0.2px] |
| Timeline title (today) | 14px | semibold (600) | #111111 | |
| Timeline title (past) | 14px | medium (500) | #111111 | |
| Timeline subtitle | 13px | normal (400) | #6E6E73 | |
| Notification title (unread) | 14px | semibold (600) | #111111 | |
| Notification title (read) | 14px | medium (500) | #111111 | |
| Notification body | 13px | normal (400) | varies | leading-[1.35] line-clamp-2 |
| Notification time | 11px | medium (500) | #8E8E93 | |
| Quick action label | 12px | medium (500) | #58585F | |
| Tab label | 10px | medium (500) | #E85D2A / #8E8E93 | |
| Badge text | 9px | semibold (600) | varies | |
| Chip text | 12px | semibold (600) | varies | |
| Form label | 12px | bold (700) | #8E8E93 | uppercase tracking-widest |
| Input text | 13px-16px | normal (400) | #111111 | |
| Placeholder | varies | normal (400) | #9A9AA0 | |

---

## 8. Home Screen Patterns

### Greeting

```jsx
<h2 className="text-[24px] font-semibold text-[#111111] mb-[6px]">
  Good morning, Anna.
</h2>
<p className="text-[15px] font-normal text-[#777777]">What's the plan?</p>
```

### Pet Selector (pill switcher)

```jsx
<div className="w-full bg-[#F5F5F5] rounded-[20px] h-[56px] p-1
  flex items-center justify-between
  shadow-[0_6px_16px_rgba(0,0,0,0.04)]">
  {/* Each pet tab */}
  <button className={`h-full flex-1 flex items-center justify-center gap-2
    rounded-[16px] transition-all duration-200 active:scale-[0.98]
    ${isSelected
      ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-3'
      : 'bg-transparent px-2'}`}>
    <img className={`${isSelected ? 'w-7 h-7' : 'w-6 h-6'} rounded-full object-cover`} />
    <span className={`text-[14px] font-semibold
      ${isSelected ? 'text-[#111111]' : 'text-[#888888]'}`}>
      {pet.name}
    </span>
  </button>
</div>
```

### Booking Card

```jsx
<Card clickable className="!px-5 !py-3 active:scale-[0.98]">
  {/* Status badge */}
  <span className="h-[18px] px-2.5 rounded-full text-[9px] font-semibold
    inline-flex items-center
    bg-[#EEF7F1] text-[#3F8D63] border border-[#D7EBDD]">  {/* Confirmed */}
    {/* or */}
    bg-[#F7F4EF] text-[#B07A3A] border border-[#ECDDC8]">  {/* Pending */}
  </span>
</Card>
```

### Quick Actions Grid

```jsx
<section className="grid grid-cols-3 gap-2">
  <Card clickable className="h-[86px] !rounded-[18px] bg-[#FCFCFA]
    border border-black/[0.02] flex flex-col items-center justify-center gap-2">
    {/* Icon container */}
    <div className="w-[34px] h-[34px] rounded-full bg-[color] flex items-center justify-center">
      <Icon size={17} />
    </div>
    {/* Label */}
    <span className="text-[12px] font-medium text-[#58585F]">Label</span>
  </Card>
</section>
```

### Today Timeline Row

```jsx
<div className="flex items-center gap-3 py-2.5
  border-b border-black/[0.08]">  {/* today: 0.08, week: 0.05, earlier: 0.03 */}

  {/* Time column */}
  <div className="w-[64px] shrink-0 text-[12px] font-semibold text-[#76767D]
    tracking-[0.2px] leading-none whitespace-nowrap">
    08:00
  </div>

  {/* Icon */}
  <div className="w-[32px] h-[32px] rounded-full bg-[#F5F5F7]
    flex items-center justify-center shrink-0">
    <Icon size={15} className="text-[#6E6E73]" />
  </div>

  {/* Content */}
  <div className="min-w-0">
    <div className="text-[14px] font-semibold text-[#111111] truncate leading-none
      flex items-center gap-1.5">
      Title
      {/* Unread/new dot */}
      <span className="w-[5px] h-[5px] rounded-full bg-[#FF6A3D] shrink-0" />
    </div>
    <div className="text-[13px] text-[#6E6E73] truncate mt-1">Subtitle</div>
  </div>

  {/* Action: complete checkbox or chevron */}
  <div className="shrink-0 min-w-[40px] flex items-center justify-center">
    {/* Checkbox: 22x22 rounded-full border border-black/[0.16] */}
    {/* Completed: bg-[#FF6A3D] border-[#FF6A3D], Check icon white */}
    {/* Or chevron: ChevronRight size={14} text-[#B6B6BC] */}
    {/* Expanded: rotate-90 text-[#FF6A3D] */}
  </div>
</div>
```

### Expandable Detail Panel

```jsx
<div className="overflow-hidden transition-all duration-[250ms]"
  style={{
    maxHeight: isExpanded ? '220px' : '0px',
    opacity: isExpanded ? 1 : 0,
    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }}>
  <div className="pl-[99px] pr-2 pt-2.5">
    {/* Photo: rounded-[12px] overflow-hidden bg-[#F7F7F8] border border-black/[0.04] */}
    {/* Or detail box: rounded-[10px] bg-[#F7F7F8] border border-black/[0.04] px-3 py-2.5 */}
    {/* Detail text: text-[12px] text-[#5D5D64] leading-[1.4] */}
    {/* Meta text: text-[11px] text-[#8E8E93] leading-[1.35] */}
    {/* Action link: text-[11px] font-semibold text-[#FF6A3D] */}
  </div>
</div>
```

---

## 9. Inbox / Notifications Patterns

### Segmented Control (Mode Switcher)

```jsx
<div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full
  border border-black/[0.04] relative">
  {/* Active indicator (sliding pill) */}
  <div className="absolute top-1.5 bottom-1.5 bg-[#111111] rounded-full
    transition-all duration-[300ms]"
    style={{
      width: `calc(${100 / modes.length}% - 12px)`,
      left: `calc(${(100 / modes.length) * activeIndex}% + 6px)`,
      transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)'
    }} />
  {/* Each tab */}
  <button className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold
    transition-colors duration-[200ms] flex items-center justify-center gap-1.5
    ${isActive ? 'text-white' : 'text-[#8E8E93] hover:text-[#111111]'}`}>
    {label}
    {badge && <span className={`w-1.5 h-1.5 rounded-full
      ${isActive ? 'bg-white/80' : 'bg-[#FF6A3D]'}`} />}
  </button>
</div>
```

### Category Filter Chips

```jsx
<div className="grid grid-cols-4 gap-2">
  <button className={`w-full flex items-center justify-center gap-1.5
    px-3 py-1.5 rounded-full whitespace-nowrap
    text-[12px] font-semibold
    active:scale-[0.96] transition-all duration-[180ms] border
    ${isActive
      ? 'bg-[#111111] text-white border-transparent'
      : 'bg-white/90 backdrop-blur-md text-[#6E6E73] border-black/[0.05]
         hover:bg-white hover:text-[#111111]'}`}>
    {label}
  </button>
</div>
```

### Notification Card

```jsx
<div className={`rounded-[22px] overflow-hidden border border-black/[0.03]
  ${isUnread ? 'bg-[#FFFFFF]' : 'bg-[#F4F4F6]'}`}>  {/* alternates: bg-[#F9F9FB] */}

  {/* Header row */}
  <div className="flex items-center gap-3">
    {/* Avatar: 36px rounded-full border-black/[0.04] */}
    <img className="w-9 h-9 rounded-full object-cover" />

    <div className="flex-1 min-w-0">
      {/* Title + time */}
      <div className="flex items-center gap-1.5">
        {isUnread && <span className="w-[5px] h-[5px] rounded-full bg-[#FF7A4D]" />}
        <span className={`text-[14px] ${isUnread ? 'font-semibold' : 'font-medium'}`}>
          Title
        </span>
      </div>
      {/* Body */}
      <p className="text-[13px] leading-[1.35] line-clamp-2">Body text</p>
    </div>

    {/* Time */}
    <span className="text-[11px] font-medium text-[#8E8E93]">2h ago</span>
  </div>
</div>
```

### Group Labels

```jsx
<span className="text-[12px] font-medium text-[#8E8E93]">Today</span>
```

---

## 10. Activity Feed Patterns

### Social Feed Post Card

```jsx
<div className="bg-[#FFFFFF] rounded-[20px] p-4
  border border-black/[0.04] shadow-sm mb-3.5">

  {/* Header: avatar + name + time */}
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <img className="w-10 h-10 rounded-full object-cover bg-[#F7F7F8]" />
      <div>
        <h4 className="text-[15px] font-semibold text-[#111111] leading-tight">Owner Name</h4>
        <p className="text-[12px] text-[#8E8E93] mt-0.5 leading-none">with PetName - 3h ago</p>
      </div>
    </div>
    {/* More button */}
    <button className="w-8 h-8 rounded-full bg-[#F7F7F8]
      flex items-center justify-center text-[#8E8E93]">
      <MoreVertical size={15} />
    </button>
  </div>

  {/* Photo (optional) */}
  <img className="w-full aspect-square object-cover rounded-[16px]
    shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-[#F3F3F5] mb-3" />

  {/* Location (optional) */}
  <p className="text-[12px] text-[#8E8E93] flex items-center gap-1.5 mb-2">
    <MapPin size={12} className="text-[#A6A6AC]" />
    Location Name
  </p>

  {/* Activity label */}
  <p className="text-[14px] font-medium text-[#111111] leading-snug">Activity label</p>
  <p className="text-[12px] text-[#6E6E73] mt-1">Details</p>

  {/* Footer: likes + heart button */}
  <div className="flex items-center justify-between pt-3 border-t border-black/[0.04]">
    <div>
      <p className="text-[13px] font-semibold text-[#111111]">heart-emoji {count}</p>
      <p className="text-[12px] text-[#8E8E93] mt-0.5">Liked by ...</p>
    </div>
    <button className={`h-9 min-w-[42px] px-3 rounded-[12px]
      flex items-center justify-center transition-all duration-200
      ${isLiked ? 'bg-[#FF6A3D]/14 text-[#FF6A3D]' : 'bg-[#F3F3F6] text-[#8E8E93]'}`}>
      <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
    </button>
  </div>
</div>
```

---

## 11. Bottom Sheet

```jsx
{/* Overlay */}
<div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]
  transition-opacity duration-[200ms]" />

{/* Sheet */}
<div className="relative w-full bg-white rounded-t-[20px] flex flex-col
  shadow-[0_-8px_40px_rgba(0,0,0,0.12)]">

  {/* Drag handle */}
  <div className="w-full flex flex-col items-center pt-5 pb-3 cursor-grab">
    <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
    {title && <h3 className="text-[18px] font-semibold text-[#111111] mt-3">{title}</h3>}
  </div>

  {/* Content: scrollable */}
  <div className="px-6 pb-8 overflow-y-auto">
    {children}
  </div>
</div>
```

---

## 12. Form Elements

### Text Input

```jsx
<input className="w-full h-[52px] px-4
  bg-[#F9F9FB] border border-[rgba(0,0,0,0.04)]
  text-[16px] text-[#111111]
  rounded-[16px]
  placeholder:text-[#8E8E93]
  focus:outline-none focus:border-[#E85D2A] focus:ring-4 focus:ring-[#E85D2A]/10
  transition-all duration-200" />
```

### Small Input (Activity sheets)

```jsx
<input className="w-full h-10 rounded-[10px]
  border border-black/[0.06] bg-[#F7F7F8]
  px-3 text-[13px] text-[#111111]
  placeholder:text-[#9A9AA0]
  focus:outline-none focus:border-[#FF6A3D]" />
```

### Select

```jsx
<select className="w-full h-[52px] px-4
  bg-[#F7F7F8] border border-transparent
  text-[16px] text-[#111111] rounded-[16px]
  appearance-none
  focus:outline-none focus:border-[#FF6A3D] focus:bg-[#FFFFFF]
  transition-colors" />
{/* ChevronDown icon: absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8E93] size={18} */}
```

### Toggle Selector Buttons

```jsx
<button className={`h-10 rounded-[10px] text-[13px] font-semibold border transition-colors
  ${isSelected
    ? 'bg-[#111111] text-white border-transparent'
    : 'bg-[#F7F7F8] text-[#111111] border-black/[0.06]'}`}>
```

---

## 13. Floating Action Button (FAB)

```jsx
{/* Primary FAB */}
<button className="absolute right-5 z-30 w-12 h-12
  flex items-center justify-center rounded-full
  shadow-[0_4px_12px_rgba(0,0,0,0.04)]
  active:scale-95 transition-all duration-300 ease-out
  text-[#FF6A3D] bg-[#FFF1EC] border border-[#FFD9CC]"
  style={{ bottom: '92px' }}>  {/* 92px if tab bar visible, 30px if hidden */}
  <Plus size={18} />
</button>

{/* Dark FAB (friends mode) */}
className="bg-[#0A0A0B] text-white border border-black/80"

{/* Secondary action pill */}
<button className="h-9 pl-3 pr-3.5 rounded-full bg-white
  border border-black/[0.05] shadow-[0_4px_12px_rgba(0,0,0,0.04)]
  text-[12px] font-semibold text-[#111111]
  flex items-center gap-2">
```

---

## 14. Collapsible Header (Directional Scroll)

The Activity screen uses a `useDirectionalCollapseProgress` hook to collapse header elements on scroll down and show them on scroll up.

```jsx
// Hook: tracks scroll direction and returns a progress value (0 = fully shown, maxProgress = fully hidden)
const { progress, handleScroll, reset } = useDirectionalCollapseProgress(168, { showFactor: 2.25 });

// Three collapse phases: p1 (pets), p2 (pills), p3 (tabs)
const p1 = clamp01(progress / 56);       // pet selector
const p2 = clamp01((progress - 56) / 56);  // filter pills
const p3 = clamp01((progress - 112) / 56); // mode tabs

// Each element applies opacity and translateY based on its phase
style={{
  opacity: 1 - p1,
  transform: `translateY(${-10 * p1}px)`,
  pointerEvents: p1 > 0.96 ? 'none' : 'auto'
}}
```

---

## 15. Scroll Container (Unified App Shell)

```jsx
<div className="absolute inset-0 overflow-x-hidden bg-[#F9F9FB]
  overflow-y-auto">
  <div className="min-h-full pt-[110px] pb-[120px]">
    {/* Screen content */}
  </div>
</div>
```

- `pt-[110px]`: clears floating header + status bar
- `pb-[120px]`: clears tab bar + safe area

---

## 16. Status Badges

```jsx
// Confirmed (green)
<span className="h-[18px] px-2.5 rounded-full text-[9px] font-semibold
  inline-flex items-center
  bg-[#EEF7F1] text-[#3F8D63] border border-[#D7EBDD]">
  Confirmed
</span>

// Pending (amber)
<span className="... bg-[#F7F4EF] text-[#B07A3A] border border-[#ECDDC8]">
  Pending
</span>

// Default badge (accent gradient)
<span className="bg-gradient-to-r from-[#FF7240] to-[#E85D2A]
  text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
  Default
</span>

// Notification count badge
<span className="w-[10px] h-[10px] bg-[#FF3B4A] rounded-full
  border-[2px] border-[#F7F7F8]" />
```

---

## 17. Global CSS Helpers

```css
/* Scrollbar hidden */
.wallet-scroll::-webkit-scrollbar { display: none; }
.wallet-scroll { scrollbar-width: none; }
.custom-scrollbar::-webkit-scrollbar { display: none; }
.custom-scrollbar { scrollbar-width: none; }

/* Tap feedback */
.wallet-tap {
  transition: opacity 120ms ease, transform 120ms ease;
  cursor: pointer;
}
.wallet-tap:active { opacity: 0.85; transform: scale(0.97); }

/* Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
-webkit-font-smoothing: antialiased;
```

---

## 18. Icon Usage

- **Library:** `lucide-react` v0.300.0
- **Default size:** 18px for most UI elements, 15-17px for timeline/feed icons, 22px for header icons
- **StrokeWidth:** Default (2) for most, 2.5 for search/plus emphasis, 1.5 for inactive tab icons, 1.9 for vault grid icons
- **Colors:** Follow the text color of context (e.g., `#6E6E73` for secondary, `#111111` for primary, `#8E8E93` for tertiary)
- **Icon containers:** Usually a circle (`rounded-full`) with light background (`#F5F5F7`, `#F7F7F8`, `#F2F2F7`)

---

## 19. PRO Dark Theme Tokens (Revolut-style)

For PRO screens (50-55), use this dark palette instead:

```css
--color-accent: #E85D2A;
--color-accent-light: #FF7240;
--color-background: #0D1B2A;
--color-surface: #142232;
--color-surface-alt: #1B2D3E;
--color-primary-text: #FFFFFF;
--color-secondary-text: rgba(255,255,255,0.55);
--color-tertiary-text: rgba(255,255,255,0.35);
--color-divider: rgba(255,255,255,0.08);
```

Home indicator for dark: `rgba(255,255,255,0.25)` instead of `#000`.
