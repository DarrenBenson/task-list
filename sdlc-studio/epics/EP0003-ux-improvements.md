# EP0003: UX Improvements

> **Status:** Complete
> **Owner:** Unassigned
> **Created:** 2026-01-23
> **Target Release:** 1.1

## Summary

Apply a cohesive design system to the Task Manager application based on the brand guide. This epic transforms the functional prototype into a polished, visually appealing application with dark mode aesthetics, improved typography, status indicators, and consistent component styling. The focus is on "calm technology" - an interface that stays out of the way when things are fine but provides clear visual feedback when needed.

## Inherited Constraints

Constraints that flow from PRD and TRD to this Epic.

### From PRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Performance | Frontend renders task list within 1 second | New styles must not degrade performance |
| UX | Visual clarity at a glance | Design must support quick scanning |
| UX | Completed tasks visually distinguished | Use status colours for completion states |
| Accessibility | WCAG AA contrast | All text must meet 4.5:1 contrast ratio |

### From Brand Guide

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Visual | Dark mode only | No light mode implementation |
| Typography | Space Grotesk + JetBrains Mono | Font loading and application |
| Colour | Phosphor palette with status colours | CSS custom properties setup |
| Motion | Respect prefers-reduced-motion | Conditional animations |
| UX | Glanceable - status visible in 2 seconds | Clear visual hierarchy |

> **Note:** Inherited constraints MUST propagate to child Stories. Check Story templates include these constraints.

## Business Context

### Problem Statement

The current Task Manager interface is functional but lacks visual polish and consistency. Users like Organised Ollie appreciate clarity and visual distinction, while Busy Parent Sam needs quick visual feedback. A cohesive design system will improve user satisfaction and make the application feel more professional.

**Brand Guide Reference:** [brand-guide.md](../brand-guide.md)

### Value Proposition

A polished, consistent UI improves user confidence and satisfaction. Dark mode reduces eye strain for extended use. Clear status indicators help users quickly assess task state. Professional aesthetics encourage continued use of the application.

### Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| Visual consistency | Ad-hoc styling | 100% design system compliance | Manual review |
| Contrast ratio | Unknown | WCAG AA (4.5:1) minimum | Accessibility audit |
| Font loading | System fonts | Custom fonts < 500ms | Performance testing |
| Animation performance | None | 60fps with reduced-motion support | Browser dev tools |

## Scope

### In Scope

- Dark mode colour scheme (Phosphor palette)
- Custom typography (Space Grotesk, JetBrains Mono)
- Task card component styling
- Status LED indicators for task completion
- Button and input field styling
- Spacing and border radius system
- CSS custom properties for theming
- Hover and focus states
- Reduced motion support
- Drag handle visual improvements

### Out of Scope

- Light mode theme
- Theme switching
- User-customisable colours
- Complex animations
- Icon library integration (future epic)
- Responsive layout overhaul (mobile-first redesign)
- Sidebar navigation (single-page app)

### Affected User Personas

- **Busy Parent Sam:** Needs instant visual feedback on task state; appreciates satisfying completion indicators
- **Organised Ollie:** Values clarity and visual distinction; wants clear differentiation between done and not done

## Acceptance Criteria (Epic Level)

- [x] Application uses dark mode colour scheme (Deep Space background)
- [x] Typography uses Space Grotesk for UI and JetBrains Mono for data
- [x] Task cards follow design system (elevated surface, rounded corners)
- [x] Completed tasks show status LED indicator (green glow)
- [x] Incomplete tasks show neutral indicator
- [x] Buttons follow design system variants (primary, secondary, danger)
- [x] Input fields follow design system (terminal-style)
- [x] All interactive elements have visible focus states
- [x] Animations respect prefers-reduced-motion
- [x] All text meets WCAG AA contrast requirements

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner | Notes |
|------------|------|--------|-------|-------|
| EP0001: Core Task Management | Epic | Complete | - | UI components must exist to style |
| EP0002: Task Organisation | Epic | Complete | - | Drag handles need styling |

### Blocking

| Item | Type | Impact |
|------|------|--------|
| None | - | Enhancement epic, no dependencies |

## Risks & Assumptions

### Assumptions

- Google Fonts (Space Grotesk, JetBrains Mono) remain freely available
- Users accept dark mode only (no light mode toggle needed)
- Current component structure supports CSS-only styling updates
- No significant JavaScript changes required for visual updates

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Font loading latency | Medium | Low | Use font-display: swap; preload critical fonts |
| Contrast issues in some areas | Medium | Medium | Test all text/background combinations |
| CSS specificity conflicts | Low | Low | Use CSS custom properties and consistent naming |
| Browser compatibility | Low | Medium | Test in Chrome, Firefox, Safari, Edge |

## Technical Considerations

### Architecture Impact

No architectural changes - CSS/styling only:
- Add Google Fonts imports
- Create CSS custom properties root
- Update component styles
- Add animation keyframes
- Add media query for reduced motion

### Integration Points

- Font loading → HTML head or CSS import
- CSS custom properties → All component styles
- Status indicators → Task completion state

### Data Considerations

No data model changes. Status indicator derives from existing `is_complete` boolean.

## Sizing & Effort

**Story Points:** 5

**Estimated Story Count:** 1 story

**Complexity Factors:**

- CSS-only changes (no backend)
- Comprehensive style updates across all components
- Accessibility testing required
- Cross-browser testing

## Stakeholders

| Role | Name | Interest |
|------|------|----------|
| End User | Busy Parent Sam | Clear visual feedback, satisfying interactions |
| End User | Organised Ollie | Visual clarity, consistent styling |

## Story Breakdown

- [x] [US0008](../stories/US0008-apply-design-system.md): Apply Brand Guide Design System

## Test Plan

**Test Plan:** Generated and validated

| Test Suite | Type | Cases | Status |
|------------|------|-------|--------|
| Design system E2E | E2E | 29 | ✅ Passing |
| Backend tests | Unit | 79 | ✅ Passing |
| Full E2E suite | E2E | 63 | ✅ Passing |

## Open Questions

None.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial epic created from brand guide |
| 2026-01-23 | Claude | Validated complete - all AC verified, tests passing |
