## Design Philosophy

**Balanced · Unopinionated · Reliable**

Neutral is the default Vector experience. It gets out of the way and lets users focus on building without forcing a visual personality too early.

- Even-handed color contrast that works across most use cases
- Familiar, modern SaaS patterns that feel immediately usable
- Clear hierarchy without visual drama or stylistic bias
- Designed to scale from prototype to production without refactoring
- Predictable, calm, and easy to trust

## Color Palette

### Primary Colors

| Token | Hex | Tailwind Class | Usage |
| --- | --- | --- | --- |
| Background | `#F9FAFB` | `bg-background` | Homepage, onboarding, default backgrounds |
| Surface | `#FFFFFF` | `bg-surface` | Cards, panels, forms, menus |
| Surface Alt | `#F3F4F6` | `bg-surface-alt` | Subtle alternate backgrounds |
| Foreground | `#111827` | `text-foreground` | Headings, body text |

### Accent Colors

| Token | Hex | Tailwind Class | Usage |
| --- | --- | --- | --- |
| Primary | `#5E6AD2` | `bg-primary / text-primary` | Primary buttons, links |
| Primary Hover | `#4F5BD5` | `hover:bg-primary-hover` | Hover states |
| Primary Light | `#EEF0FF` | `bg-primary-light` | Subtle highlights |

### Warm Gray Scale

| Token | Hex | Tailwind Class | Usage |
| --- | --- | --- | --- |
| Warm 50 | `#faf9f7` | `bg-warm-50` | Lightest background |
| Warm 100 | `#f5f4ee` | `bg-warm-100` | Subtle backgrounds |
| Warm 200 | `#e8e6e1` | `border-warm-200` | Borders, dividers |
| Warm 300 | `#d4d1cc` | `border-warm-300` | Hover borders |
| Warm 400 | `#a8a49e` | `text-warm-400` | Placeholder text, icons |
| Warm 500 | `#7a7670` | `text-warm-500` | Muted text |
| Warm 600 | `#5c5955` | `text-warm-600` | Secondary text |
| Warm 700 | `#454340` | `text-warm-700` | Primary text alternative |
| Warm 800 | `#2e2e2e` | `text-warm-800` | Headings |
| Warm 900 | `#1a1a1a` | `text-warm-900` | Darkest text |

### Status Colors

| Status | Background | Text | Border |
| --- | --- | --- | --- |
| Success | `bg-green-50` | `text-green-700` | `border-green-200` |
| Warning | `bg-yellow-50` | `text-yellow-700` | `border-yellow-200` |
| Error | `bg-red-50` | `text-red-700` | `border-red-200` |
| Info | `bg-blue-50` | `text-blue-700` | `border-blue-200` |

## Brand Voice

**Clear and reliable**

Speaks plainly and predictably, helping users move forward without distraction or persuasion.

## Typography

### Headline Font — Merriweather

```
font-family: 'Merriweather', Georgia, serif;
```

Used for hero headlines, page titles, section headers, and marketing copy.

| Weight | Usage |
| --- | --- |
| 400 | Section titles, subtitles |
| 700 | Hero headlines, page titles |

### UI Font — Inter

```
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Used for body text, buttons, labels, navigation, and forms.

| Weight | Usage |
| --- | --- |
| 400 | Body text |
| 500 | Buttons, labels |
| 600 | Status indicators, emphasis |

### Type Scale

| Element | Classes | Usage |
| --- | --- | --- |
| Hero Headline | `text-4xl font-headline font-bold text-foreground` | Landing page heroes |
| Page Title | `text-xl font-headline font-bold text-foreground` | Main page headings |
| Section Title | `text-lg font-headline text-foreground` | Section headers |
| Card Title | `font-medium text-foreground` | Card titles |
| Body | `text-sm text-warm-600` | Primary body text |
| Caption | `text-xs text-warm-500` | Helper text |
| Label | `text-sm font-medium text-warm-700` | Form labels |

## Spacing

Use Tailwind's default spacing scale consistently:

| Token | Value | Usage |
| --- | --- | --- |
| `p-3` | 12px | Compact UI |
| `p-4` | 16px | Standard sections |
| `p-6` | 24px | Cards, content |
| `p-8` | 32px | Heroes, modals |
| `gap-2` | 8px | Tight spacing |
| `gap-3` | 12px | Default spacing |
| `gap-4` | 16px | Sections |
| `gap-6` | 24px | Large separation |

## Components

### Buttons

- Primary: `bg-primary text-white rounded-md px-4 py-2 font-medium hover:bg-primary-hover transition-all`
- Secondary: `bg-surface border border-warm-200 text-foreground rounded-md px-4 py-2 font-medium hover:border-warm-300 transition-all`
- Ghost: `text-warm-600 hover:text-foreground hover:bg-warm-50 rounded-md px-3 py-2 transition-all`

### Cards

- Default: `bg-surface rounded-lg border border-warm-200 p-6`
- Hoverable: add `hover:shadow-sm hover:border-warm-300 transition-all cursor-pointer`
- No shadow by default. Shadow only on hover.

### Form Inputs

- `bg-surface border border-warm-200 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-warm-400 focus:border-primary focus:ring-1 focus:ring-primary-light outline-none transition-all`

### Badges

- Default: `bg-warm-100 text-warm-700 text-xs font-medium px-2 py-0.5 rounded-full`
- Status: Use status color backgrounds with matching text (e.g., `bg-green-50 text-green-700`)

### Tables

- Header: `text-xs font-medium text-warm-500 uppercase tracking-wider`
- Row: `border-b border-warm-200 text-sm text-warm-600`
- Hover: `hover:bg-warm-50`

## Layout Patterns

### Page Layout

- Max width: `max-w-6xl mx-auto`
- Page padding: `px-4 sm:px-6 lg:px-8`
- Section spacing: `space-y-8` or `gap-8`

### Card Grid

- Default: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- Dense: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`

### Sidebar Layout

- Sidebar width: `w-64`
- Main content: `flex-1 min-w-0`
- Container: `flex h-screen`

### Empty States

- Center content: `flex flex-col items-center justify-center py-12`
- Icon: `h-12 w-12 text-warm-400 mb-4`
- Title: `text-lg font-headline text-foreground mb-2`
- Description: `text-sm text-warm-500`

## Icons

Use **Lucide React** consistently.

```jsx
import { Layers, Plus, ArrowRight, Check, X } from 'lucide-react'
```

| Size | Class | Usage |
| --- | --- | --- |
| Small | `h-4 w-4` | Inline icons |
| Medium | `h-5 w-5` | Navigation |
| Large | `h-6 w-6` to `h-12 w-12` | Empty states |

Color rules:

- `text-warm-400` — decorative
- `text-warm-500` — secondary
- `text-foreground` — primary

## Shadows

Use sparingly. Default state has no shadow.

| Token | Usage |
| --- | --- |
| `shadow-sm` | Hovered cards |
| `shadow-lg` | Dropdowns, modals |
| None | Default state |

## Transitions

Standard interaction transition:

```jsx
className="transition-all"
```

Tailwind defaults handle duration (150-200ms). Do not add custom durations unless animating a specific element that needs it.

## Borders & Radius

| Element | Radius |
| --- | --- |
| Cards | `rounded-lg` (8px) |
| Buttons | `rounded-md` (6px) |
| Badges | `rounded-full` |
| Inputs | `rounded-md` |
| Icon Containers | `rounded-lg` / `rounded-xl` |
| Avatars | `rounded-full` |

## Anti-Patterns (Avoid)

- No gradients on backgrounds or buttons — keep surfaces flat
- No colored shadows — use only neutral `rgb(0 0 0 / ...)` shadows
- No decorative borders or ornaments — borders serve structure only
- No all-caps headings — use Merriweather weight for emphasis instead
- No heavy drop shadows on cards — default is border only, shadow only on hover
- No custom animations or bounce effects — stick to `transition-all`
- No dark mode overrides — Neutral is light-only
- No opacity tricks for disabled states — use `text-warm-400` and `cursor-not-allowed`
- No more than one accent color per view — `#5E6AD2` is the single action color