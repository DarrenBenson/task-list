# US0008: Apply Brand Guide Design System

> **Status:** Complete
> **Epic:** [EP0003: UX Improvements](../epics/EP0003-ux-improvements.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** user (Organised Ollie)
**I want** a polished, visually consistent interface with clear status indicators
**So that** I can quickly see task states at a glance and enjoy using the application

## Context

### Persona Reference

**Organised Ollie** - Values clarity and visual distinction. "I want my list the way I arranged it" - clear visual hierarchy helps them understand task state immediately.

**Busy Parent Sam** - Needs instant visual feedback. A satisfying glow when completing tasks provides psychological reward.

[Full persona details](../personas.md)

### Background

The Task Manager currently uses basic styling. Applying the brand guide design system will create a cohesive, professional dark mode interface with:
- Phosphor colour palette (retro-futuristic terminal aesthetic)
- Space Grotesk + JetBrains Mono typography
- Status LED indicators for task completion
- Consistent spacing, borders, and shadows
- Reduced motion support for accessibility

The design philosophy is "calm technology" - the interface stays out of the way when things are fine but provides clear visual feedback when needed.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Performance | Font loading < 500ms | Preload fonts, use font-display: swap |
| Accessibility | WCAG AA contrast (4.5:1) | Test all colour combinations |
| Visual | Dark mode only | No light mode implementation |
| Motion | Respect prefers-reduced-motion | Conditional animations |

### From Brand Guide

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Colour | Deep Space #0D1117 background | AC1: Root background colour |
| Colour | Phosphor Green #4ADE80 for success | AC3: Completed task indicator |
| Typography | Space Grotesk for UI | AC2: Font stack setup |
| Typography | JetBrains Mono for data | AC2: Timestamps, counts |
| Spacing | 4px base unit | AC6: Consistent spacing |
| Radius | 8-12px for cards | AC4: Rounded corners |

## Acceptance Criteria

### AC1: Dark mode colour scheme applied

- **Given** the application loads
- **When** viewing any page
- **Then** the background uses Deep Space (#0D1117)
- **And** cards/panels use Console Grey (#161B22)
- **And** borders use Grid Line (#30363D)
- **And** no pure black (#000000) is used anywhere

### AC2: Typography system implemented

- **Given** the application loads
- **When** viewing text content
- **Then** UI text (titles, buttons, labels) uses Space Grotesk
- **And** data text (timestamps, counts) uses JetBrains Mono
- **And** primary text uses Bright White (#F0F6FC)
- **And** secondary text uses Soft White (#C9D1D9)
- **And** muted text uses Dim Grey (#8B949E)

### AC3: Status LED indicators for task completion

- **Given** a task is displayed
- **When** the task is incomplete
- **Then** a neutral LED indicator is shown (muted grey, no glow)
- **Given** a task is displayed
- **When** the task is complete
- **Then** a green LED indicator is shown (Phosphor Green #4ADE80)
- **And** the LED has a subtle pulsing glow animation

### AC4: Task cards follow design system

- **Given** a task is displayed in the list
- **When** viewing the task card
- **Then** the card has Console Grey background (#161B22)
- **And** the card has Grid Line border (#30363D)
- **And** the card has 12px border radius
- **And** the card has 16px padding

### AC5: Buttons follow design system

- **Given** buttons are displayed (Add Task, Delete, etc.)
- **When** viewing the buttons
- **Then** primary buttons use Terminal Cyan (#22D3EE) background
- **And** secondary buttons have transparent background with border
- **And** danger buttons use Red Alert (#F87171) for delete actions
- **And** all buttons have 8px border radius
- **And** all buttons have visible focus states

### AC6: Input fields follow design system

- **Given** input fields are displayed (title, description)
- **When** viewing the inputs
- **Then** inputs have Terminal Dark (#21262D) background
- **And** inputs have Grid Line (#30363D) border
- **And** inputs use JetBrains Mono font
- **And** focus state shows Terminal Cyan border with glow
- **And** placeholder text uses Faded Grey (#484F58)

### AC7: Spacing system applied

- **Given** any UI component
- **When** measuring spacing
- **Then** all spacing values are multiples of 4px
- **And** card padding is 16px (space-4)
- **And** element gaps are 8px or 12px (space-2 or space-3)

### AC8: Hover and focus states

- **Given** interactive elements (buttons, cards, checkboxes)
- **When** hovering over the element
- **Then** a visible hover state is displayed
- **And** the transition is smooth (150ms)
- **Given** an element receives keyboard focus
- **When** focus is visible
- **Then** a clear focus ring or glow is shown

### AC9: Reduced motion support

- **Given** the user has prefers-reduced-motion enabled
- **When** animations would normally play (LED pulse, transitions)
- **Then** animations are disabled or minimised
- **And** functionality is not affected

### AC10: Completed task visual distinction

- **Given** a completed task in the list
- **When** viewing the task
- **Then** the task title has strikethrough styling
- **And** the task text uses muted colour
- **And** the green LED indicator is prominently displayed

## Scope

### In Scope

- CSS custom properties for colour system
- Google Fonts import (Space Grotesk, JetBrains Mono)
- Status LED component/styling
- Task card restyling
- Button component variants
- Input field styling
- Focus state improvements
- Hover state improvements
- Reduced motion media query
- Drag handle visual improvements

### Out of Scope

- JavaScript functionality changes
- Component architecture changes
- New features or behaviours
- Light mode theme
- Theme toggle
- Icon library (Lucide)
- Sidebar navigation
- Mobile-specific layout changes

## UI/UX Requirements

### Colour Tokens (CSS Custom Properties)

```css
:root {
  /* Backgrounds */
  --bg-primary: #0D1117;
  --bg-secondary: #161B22;
  --bg-tertiary: #21262D;

  /* Borders */
  --border-default: #30363D;
  --border-subtle: #21262D;

  /* Text */
  --text-primary: #F0F6FC;
  --text-secondary: #C9D1D9;
  --text-tertiary: #8B949E;
  --text-muted: #484F58;

  /* Status */
  --status-success: #4ADE80;
  --status-success-glow: rgba(74, 222, 128, 0.2);
  --status-error: #F87171;
  --status-error-glow: rgba(248, 113, 113, 0.2);

  /* Interactive */
  --interactive-default: #22D3EE;
  --interactive-hover: #67E8F9;
}
```

### Typography

```css
/* Font imports */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

body {
  font-family: 'Space Grotesk', system-ui, sans-serif;
}

.mono, code, .timestamp {
  font-family: 'JetBrains Mono', monospace;
}
```

### Status LED

```css
.status-led {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-led--complete {
  background-color: var(--status-success);
  box-shadow: 0 0 8px var(--status-success-glow);
  animation: pulse-green 2s ease-in-out infinite;
}

.status-led--incomplete {
  background-color: var(--text-muted);
}

@keyframes pulse-green {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; box-shadow: 0 0 16px var(--status-success-glow); }
}
```

## Technical Notes

### Implementation Approach

1. **Phase 1: Foundation**
   - Add CSS custom properties to root
   - Import Google Fonts
   - Apply base typography

2. **Phase 2: Components**
   - Style task cards
   - Style buttons
   - Style input fields
   - Add status LED indicators

3. **Phase 3: Polish**
   - Add hover/focus states
   - Add transitions
   - Add reduced motion support
   - Test accessibility

### Files to Modify

- `frontend/src/App.jsx` - Main styles (CSS-in-JS)
- `frontend/src/components/TaskList.jsx` - Task card styling
- `frontend/src/components/TaskForm.jsx` - Input styling
- `frontend/src/components/TaskDetail.jsx` - Detail view styling
- `frontend/src/components/SortableTaskItem.jsx` - Drag handle styling
- `frontend/index.html` - Font preload (optional)

### Font Loading Strategy

Use Google Fonts with `display=swap` to prevent invisible text during loading:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Fonts fail to load | Fall back to system-ui, sans-serif |
| Very long task titles | Text truncates with ellipsis |
| Many tasks (100+) | Scroll performance unaffected by styling |
| High contrast mode | Colours still meet accessibility requirements |
| Print stylesheet | Not required (out of scope) |
| Narrow viewport (<320px) | Basic responsiveness maintained |

## Test Scenarios

- [ ] Background uses correct dark colour (#0D1117)
- [ ] Task cards have correct styling (background, border, radius)
- [ ] Completed tasks show green LED indicator with glow
- [ ] Incomplete tasks show muted LED indicator
- [ ] LED animation pulses smoothly
- [ ] Space Grotesk font loads for UI text
- [ ] JetBrains Mono font loads for timestamps
- [ ] Primary buttons use cyan colour
- [ ] Danger buttons use red colour
- [ ] Input fields show focus glow on focus
- [ ] Hover states are visible on interactive elements
- [ ] Reduced motion disables animations
- [ ] All text passes WCAG AA contrast check
- [ ] Drag handle is clearly visible

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| [US0003](US0003-view-task-list.md) | UI | Task list component exists | Complete |
| [US0004](US0004-view-edit-task.md) | UI | Task form component exists | Complete |
| [US0007](US0007-reorder-tasks.md) | UI | Drag handles exist | Complete |

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Google Fonts (Space Grotesk) | CDN | Available |
| Google Fonts (JetBrains Mono) | CDN | Available |

## Estimation

**Story Points:** 5

**Complexity:** Medium

- Comprehensive CSS changes across all components
- Accessibility testing required
- Cross-browser testing needed
- No backend changes

## Open Questions

None - design system fully specified in brand guide.

## Quality Checklist

### All Stories

- [x] No ambiguous language
- [x] Open Questions: 0 unresolved
- [x] Given/When/Then uses concrete values
- [x] Persona referenced with specific context

### UI Stories

- [x] Colour values specified in hex
- [x] Typography specified (font family, sizes)
- [x] Spacing values specified
- [x] Interaction states defined (hover, focus)
- [x] Accessibility requirements stated

### Ready Status Gate

This story can be marked **Ready** when:
- [x] All critical Open Questions resolved
- [x] Design system documented in brand guide
- [x] Colour tokens defined
- [x] No "TBD" placeholders in acceptance criteria

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story created from brand guide |
