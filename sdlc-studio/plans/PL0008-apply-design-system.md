# PL0008: Apply Brand Guide Design System - Implementation Plan

> **Status:** Complete
> **Story:** [US0008: Apply Brand Guide Design System](../stories/US0008-apply-design-system.md)
> **Epic:** [EP0003: UX Improvements](../epics/EP0003-ux-improvements.md)
> **Created:** 2026-01-23
> **Language:** JavaScript/JSX (Frontend), CSS

## Overview

Apply the brand guide design system to the Task Manager frontend. This is a CSS-only change with no backend modifications. The implementation transforms the current light-themed prototype into a polished dark mode interface with the Phosphor colour palette, custom typography (Space Grotesk, JetBrains Mono), status LED indicators, and consistent component styling.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Dark mode colours | Background #0D1117, cards #161B22, borders #30363D |
| AC2 | Typography system | Space Grotesk for UI, JetBrains Mono for data |
| AC3 | Status LED indicators | Green glow for complete, muted grey for incomplete |
| AC4 | Task card styling | Console Grey background, 12px radius, 16px padding |
| AC5 | Button styling | Primary cyan, secondary ghost, danger red |
| AC6 | Input field styling | Terminal Dark background, focus glow |
| AC7 | Spacing system | 4px base unit throughout |
| AC8 | Hover/focus states | Visible states with 150ms transitions |
| AC9 | Reduced motion | Respect prefers-reduced-motion |
| AC10 | Completed task styling | Strikethrough + muted + green LED |

## Technical Context

### Language & Framework

- **Primary Language:** JavaScript/JSX
- **Framework:** React 18, Vite
- **Test Framework:** Playwright (E2E)

### Relevant Best Practices

- Use CSS custom properties for theming consistency
- Use `font-display: swap` for custom fonts
- Provide fallback fonts for robustness
- Support `prefers-reduced-motion` media query
- Maintain WCAG AA contrast ratios (4.5:1 minimum)

### Library Documentation (Context7)

No external libraries needed - CSS-only changes.

### Existing Patterns

**Current CSS approach:**
- CSS-in-JS via `<style>` tag in App.jsx
- All styles in single file (approximately 580 lines)
- Component classes: `.task-item`, `.task-form`, `.modal`, etc.
- Light theme with blue accent (#0066cc)

**Current component structure:**
- App.jsx - Main container and all CSS
- SortableTaskItem.jsx - Task item with drag handle
- TaskList.jsx - List container with DnD context
- TaskForm.jsx - Task creation form
- TaskDetail.jsx - Modal for viewing/editing tasks
- ConfirmDialog.jsx - Confirmation modal

## Recommended Approach

**Strategy:** TDD
**Rationale:** User explicitly requested TDD. Write E2E tests for visual verification first, then implement CSS changes to make tests pass.

### Test Priority

1. E2E tests for colour scheme (background, cards, text)
2. E2E tests for status LED indicators
3. E2E tests for component styling (buttons, inputs)
4. E2E test for reduced motion support

### Documentation Updates Required

- [ ] Update story status to In Progress
- [ ] Update epic status if needed
- [ ] Update plan status to Complete when done

## Implementation Steps

### Phase 1: Write Failing E2E Tests (TDD Red)

**Goal:** Create comprehensive E2E tests that verify design system compliance

#### Step 1.1: Create design system test file

- [ ] Create `frontend/e2e/design-system.spec.js`
- [ ] Add tests for background colours
- [ ] Add tests for text colours
- [ ] Add tests for typography (font families)
- [ ] Add tests for status LED indicators
- [ ] Add tests for button styling
- [ ] Add tests for input styling
- [ ] Add tests for reduced motion support

**Files to create:**
- `frontend/e2e/design-system.spec.js`

**Test approach:**
- Use Playwright's `evaluate` to get computed styles
- Verify exact colour values match brand guide
- Verify font families are correctly applied
- Verify LED animations exist/don't exist based on motion preference

### Phase 2: Implement Design System (TDD Green)

**Goal:** Update CSS to pass all tests

#### Step 2.1: Add font imports and CSS custom properties

- [ ] Add Google Fonts preconnect to index.html
- [ ] Add font import to App.jsx styles
- [ ] Add CSS custom properties to :root
- [ ] Apply base typography to body

**Files to modify:**
- `frontend/index.html` - Add font preconnect
- `frontend/src/App.jsx` - Add CSS variables and font import

**CSS Variables to add:**
```css
:root {
  --bg-primary: #0D1117;
  --bg-secondary: #161B22;
  --bg-tertiary: #21262D;
  --border-default: #30363D;
  --border-subtle: #21262D;
  --text-primary: #F0F6FC;
  --text-secondary: #C9D1D9;
  --text-tertiary: #8B949E;
  --text-muted: #484F58;
  --status-success: #4ADE80;
  --status-success-glow: rgba(74, 222, 128, 0.2);
  --status-error: #F87171;
  --status-error-glow: rgba(248, 113, 113, 0.2);
  --interactive-default: #22D3EE;
  --interactive-hover: #67E8F9;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
}
```

#### Step 2.2: Update base styles

- [ ] Update body/html background to Deep Space
- [ ] Update .app container styling
- [ ] Update h1 typography and colour

**Files to modify:**
- `frontend/src/App.jsx` - Update base styles

#### Step 2.3: Update task card styling

- [ ] Update .task-item background, border, radius
- [ ] Add status LED indicator element to SortableTaskItem
- [ ] Style LED for complete (green glow) and incomplete (muted)
- [ ] Update completed task styling (strikethrough + muted)
- [ ] Update drag handle styling

**Files to modify:**
- `frontend/src/App.jsx` - CSS for task items and LED
- `frontend/src/components/SortableTaskItem.jsx` - Add LED element

#### Step 2.4: Update button styling

- [ ] Update primary button (cyan)
- [ ] Update secondary button (ghost/border)
- [ ] Update destructive button (red)
- [ ] Add focus states with glow

**Files to modify:**
- `frontend/src/App.jsx` - Button CSS

#### Step 2.5: Update input styling

- [ ] Update input/textarea background to Terminal Dark
- [ ] Update border colour
- [ ] Add focus glow effect
- [ ] Update placeholder colour
- [ ] Apply JetBrains Mono font

**Files to modify:**
- `frontend/src/App.jsx` - Input CSS

#### Step 2.6: Update modal styling

- [ ] Update modal background
- [ ] Update modal borders
- [ ] Update modal text colours
- [ ] Update backdrop opacity

**Files to modify:**
- `frontend/src/App.jsx` - Modal CSS

#### Step 2.7: Add animations and reduced motion

- [ ] Add LED pulse animation
- [ ] Add smooth transitions (150ms)
- [ ] Add prefers-reduced-motion media query
- [ ] Disable animations for reduced motion users

**Files to modify:**
- `frontend/src/App.jsx` - Animation CSS

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria are met

#### Step 3.1: Run E2E Tests

- [ ] Run design system E2E tests
- [ ] All tests should pass (TDD green)
- [ ] Fix any failing tests

#### Step 3.2: Visual Verification

- [ ] Open application in browser
- [ ] Verify dark mode appearance
- [ ] Test all interactive states
- [ ] Test with reduced motion preference

#### Step 3.3: Accessibility Verification

- [ ] Check contrast ratios with browser dev tools
- [ ] Verify focus states are visible
- [ ] Test keyboard navigation

#### Step 3.4: Acceptance Criteria Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | E2E test: verify background colours | Pending |
| AC2 | E2E test: verify font families | Pending |
| AC3 | E2E test: verify LED indicators | Pending |
| AC4 | E2E test: verify task card styling | Pending |
| AC5 | E2E test: verify button styling | Pending |
| AC6 | E2E test: verify input styling | Pending |
| AC7 | E2E test: verify spacing values | Pending |
| AC8 | E2E test: verify hover/focus states | Pending |
| AC9 | E2E test: verify reduced motion | Pending |
| AC10 | E2E test: verify completed task styling | Pending |

## Edge Case Handling Plan

Every edge case from the Story MUST appear here with an explicit handling strategy.

### Edge Case Coverage

| # | Edge Case (from Story) | Handling Strategy | Implementation Phase | Validated |
|---|------------------------|-------------------|---------------------|-----------|
| 1 | Fonts fail to load | Font stack includes system-ui fallback | Phase 2.1 | [ ] |
| 2 | Very long task titles | Text truncates with ellipsis (existing) | Phase 2.3 | [ ] |
| 3 | Many tasks (100+) | CSS is efficient, no JS changes | Phase 2.3 | [ ] |
| 4 | High contrast mode | Colours meet WCAG AA requirements | Phase 3.3 | [ ] |
| 5 | Print stylesheet | Out of scope (not implemented) | N/A | [ ] |
| 6 | Narrow viewport (<320px) | Existing responsive styles maintained | Phase 2 | [ ] |

### Coverage Summary

- Story edge cases: 6
- Handled in plan: 5 (1 out of scope)
- Unhandled: 0

### Edge Case Implementation Notes

- Font fallback: `'Space Grotesk', system-ui, sans-serif` and `'JetBrains Mono', monospace`
- Truncation already exists via word-wrap and overflow-wrap
- WCAG AA compliance verified with contrast checker

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Font loading delay | Low | Use font-display: swap, preconnect |
| CSS specificity conflicts | Low | Use CSS custom properties consistently |
| Browser compatibility | Low | Test in Chrome, Firefox, Safari, Edge |

## Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| Google Fonts CDN | External | Space Grotesk, JetBrains Mono |
| Playwright | Dev | Already installed for E2E tests |

## Open Questions

None - all design decisions documented in brand guide.

## Definition of Done Checklist

- [ ] All acceptance criteria implemented
- [ ] E2E tests written and passing
- [ ] Edge cases handled
- [ ] Code follows existing patterns
- [ ] No linting errors
- [ ] Story status updated to Complete
- [ ] Manual visual verification completed

## Notes

- All CSS changes are in App.jsx style tag (existing pattern)
- No component architecture changes needed
- Status LED is a new element added to SortableTaskItem
- Existing drag-and-drop functionality unchanged
