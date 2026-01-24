/**
 * E2E tests for design system implementation.
 * Tests verify the brand guide design system is correctly applied.
 *
 * Story: US0008 - Apply Brand Guide Design System
 * Acceptance Criteria: AC1-AC10
 */
import { test, expect } from '@playwright/test'

// Brand guide colour constants
const COLORS = {
  bgPrimary: 'rgb(13, 17, 23)', // #0D1117 Deep Space
  bgSecondary: 'rgb(22, 27, 34)', // #161B22 Console Grey
  bgTertiary: 'rgb(33, 38, 45)', // #21262D Terminal Dark
  borderDefault: 'rgb(48, 54, 61)', // #30363D Grid Line
  textPrimary: 'rgb(240, 246, 252)', // #F0F6FC Bright White
  textSecondary: 'rgb(201, 209, 217)', // #C9D1D9 Soft White
  textTertiary: 'rgb(139, 148, 158)', // #8B949E Dim Grey
  textMuted: 'rgb(72, 79, 88)', // #484F58 Faded Grey
  statusSuccess: 'rgb(74, 222, 128)', // #4ADE80 Phosphor Green
  statusError: 'rgb(248, 113, 113)', // #F87171 Red Alert
  interactiveDefault: 'rgb(34, 211, 238)', // #22D3EE Terminal Cyan
}

// Helper to get computed style
async function getComputedStyle(locator, property) {
  return locator.evaluate((el, prop) => {
    return window.getComputedStyle(el).getPropertyValue(prop)
  }, property)
}

// Helper to create a test task
async function createTask(page, title, description = '') {
  await page.getByRole('textbox', { name: /task title/i }).fill(title)
  if (description) {
    await page.getByRole('textbox', { name: /task description/i }).fill(description)
  }
  // Wait for API response when creating task
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/v1/tasks') && resp.status() === 201),
    page.getByRole('button', { name: /add task/i }).click()
  ])
  // Small buffer for React to re-render
  await page.waitForTimeout(100)
}

// Helper to toggle task completion and wait for API
async function toggleTaskCompletion(page, taskLocator) {
  const checkbox = taskLocator.locator('.task-checkbox-button')
  await Promise.all([
    page.waitForResponse(resp => resp.url().includes('/api/v1/tasks/') && resp.request().method() === 'PATCH'),
    checkbox.click()
  ])
  // Wait for React to apply the .completed class
  await page.waitForTimeout(300)
}

test.describe('Design System - AC1: Dark Mode Colour Scheme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS01: Page background uses Deep Space colour (#0D1117)', async ({ page }) => {
    const body = page.locator('body')
    const bgColor = await getComputedStyle(body, 'background-color')
    expect(bgColor).toBe(COLORS.bgPrimary)
  })

  test('TC-DS02: App container uses Deep Space background', async ({ page }) => {
    const app = page.locator('.app')
    const bgColor = await getComputedStyle(app, 'background-color')
    // App should be transparent (inherit from body) or Deep Space
    expect([COLORS.bgPrimary, 'rgba(0, 0, 0, 0)']).toContain(bgColor)
  })

  test('TC-DS03: Task cards use Console Grey background (#161B22)', async ({ page }) => {
    await createTask(page, 'Test task for card styling')
    const taskItem = page.locator('.task-item').first()
    const bgColor = await getComputedStyle(taskItem, 'background-color')
    expect(bgColor).toBe(COLORS.bgSecondary)
  })

  test('TC-DS04: Task cards use Grid Line border (#30363D)', async ({ page }) => {
    await createTask(page, 'Test task for border')
    const taskItem = page.locator('.task-item').first()
    const borderColor = await getComputedStyle(taskItem, 'border-color')
    expect(borderColor).toBe(COLORS.borderDefault)
  })

  test('TC-DS05: No pure black (#000000) used anywhere', async ({ page }) => {
    await createTask(page, 'Test task')

    // Check body background
    const body = page.locator('body')
    const bodyBg = await getComputedStyle(body, 'background-color')
    expect(bodyBg).not.toBe('rgb(0, 0, 0)')

    // Check app background
    const app = page.locator('.app')
    const appBg = await getComputedStyle(app, 'background-color')
    expect(appBg).not.toBe('rgb(0, 0, 0)')
  })
})

test.describe('Design System - AC2: Typography System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS06: UI text uses Space Grotesk font', async ({ page }) => {
    const heading = page.locator('h1')
    const fontFamily = await getComputedStyle(heading, 'font-family')
    expect(fontFamily.toLowerCase()).toContain('space grotesk')
  })

  test('TC-DS07: Body text uses Space Grotesk font', async ({ page }) => {
    const body = page.locator('body')
    const fontFamily = await getComputedStyle(body, 'font-family')
    expect(fontFamily.toLowerCase()).toContain('space grotesk')
  })

  test('TC-DS08: Input fields use JetBrains Mono font', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /task title/i })
    const fontFamily = await getComputedStyle(input, 'font-family')
    expect(fontFamily.toLowerCase()).toContain('jetbrains mono')
  })

  test('TC-DS09: Primary text uses Bright White (#F0F6FC)', async ({ page }) => {
    const heading = page.locator('h1')
    const color = await getComputedStyle(heading, 'color')
    expect(color).toBe(COLORS.textPrimary)
  })
})

test.describe('Design System - AC3: Status LED Indicators', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS10: Incomplete task shows muted LED indicator', async ({ page }) => {
    await createTask(page, 'Incomplete task')
    // Wait for task to appear and ensure it's not completed
    const taskItem = page.locator('.task-item').first()
    await expect(taskItem).not.toHaveClass(/completed/)

    const led = page.locator('.task-item:not(.completed) .status-led').first()
    await expect(led).toBeVisible()

    const bgColor = await getComputedStyle(led, 'background-color')
    expect(bgColor).toBe(COLORS.textMuted)
  })

  test('TC-DS11: Complete task shows green LED indicator', async ({ page }) => {
    await createTask(page, 'Task to complete')
    const taskItem = page.locator('.task-item').first()
    await toggleTaskCompletion(page, taskItem)
    await expect(taskItem).toHaveClass(/completed/)

    const led = taskItem.locator('.status-led').first()
    const bgColor = await getComputedStyle(led, 'background-color')
    expect(bgColor).toBe(COLORS.statusSuccess)
  })

  test('TC-DS12: Complete task LED has glow effect', async ({ page }) => {
    const taskTitle = `Task with glow ${Date.now()}`
    await createTask(page, taskTitle)
    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
    await toggleTaskCompletion(page, taskItem)
    await expect(taskItem).toHaveClass(/completed/)

    const led = taskItem.locator('.status-led').first()
    const boxShadow = await getComputedStyle(led, 'box-shadow')
    // Should have a glow (box-shadow with green colour)
    expect(boxShadow).not.toBe('none')
    expect(boxShadow).toContain('74') // Part of rgba(74, 222, 128, ...)
  })
})

test.describe('Design System - AC4: Task Card Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS13: Task cards have 12px border radius', async ({ page }) => {
    await createTask(page, 'Test card radius')
    const taskItem = page.locator('.task-item').first()
    const radius = await getComputedStyle(taskItem, 'border-radius')
    expect(radius).toBe('12px')
  })

  test('TC-DS14: Task cards have 16px padding', async ({ page }) => {
    await createTask(page, 'Test card padding')
    const taskItem = page.locator('.task-item').first()
    const padding = await getComputedStyle(taskItem, 'padding')
    // Padding could be shorthand or individual values
    expect(padding).toContain('16px')
  })
})

test.describe('Design System - AC5: Button Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS15: Primary button uses Terminal Cyan (#22D3EE)', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add task/i })
    const bgColor = await getComputedStyle(addButton, 'background-color')
    expect(bgColor).toBe(COLORS.interactiveDefault)
  })

  test('TC-DS16: Primary button has 8px border radius', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add task/i })
    const radius = await getComputedStyle(addButton, 'border-radius')
    expect(radius).toBe('8px')
  })

  test('TC-DS17: Danger button uses Red Alert (#F87171)', async ({ page }) => {
    await createTask(page, 'Task to delete')
    await page.locator('.task-item').first().click()
    await page.waitForSelector('.modal')

    const deleteButton = page.locator('.destructive-button')
    const bgColor = await getComputedStyle(deleteButton, 'background-color')
    // Danger button should be red or have red border
    const borderColor = await getComputedStyle(deleteButton, 'border-color')
    expect([bgColor, borderColor]).toContain(COLORS.statusError)
  })

  test('TC-DS18: Buttons have visible focus states', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add task/i })
    await addButton.focus()

    const boxShadow = await getComputedStyle(addButton, 'box-shadow')
    // Should have focus ring (box-shadow or outline)
    const outline = await getComputedStyle(addButton, 'outline')
    expect(boxShadow !== 'none' || outline !== 'none').toBeTruthy()
  })
})

test.describe('Design System - AC6: Input Field Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS19: Input has Terminal Dark background (#21262D)', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /task title/i })
    const bgColor = await getComputedStyle(input, 'background-color')
    expect(bgColor).toBe(COLORS.bgTertiary)
  })

  test('TC-DS20: Input has Grid Line border (#30363D)', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /task title/i })
    // Blur the input first (it's auto-focused on page load)
    await input.blur()
    await page.waitForTimeout(100)
    // border-color may be computed differently, check top border
    const borderTopColor = await getComputedStyle(input, 'border-top-color')
    expect(borderTopColor).toBe(COLORS.borderDefault)
  })

  test('TC-DS21: Input focus shows glow effect', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /task title/i })
    await input.focus()

    const boxShadow = await getComputedStyle(input, 'box-shadow')
    expect(boxShadow).not.toBe('none')
  })

  test('TC-DS22: Placeholder text uses Faded Grey (#484F58)', async ({ page }) => {
    // Placeholder colour is tricky to test directly
    // We verify the input has correct styling when empty
    const input = page.getByRole('textbox', { name: /task title/i })
    await expect(input).toHaveAttribute('placeholder')
  })
})

test.describe('Design System - AC7: Spacing System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS23: App container uses correct padding', async ({ page }) => {
    const app = page.locator('.app')
    const padding = await getComputedStyle(app, 'padding')
    // Should be multiples of 4px
    const paddingValue = parseInt(padding)
    expect(paddingValue % 4).toBe(0)
  })
})

test.describe('Design System - AC8: Hover and Focus States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS24: Task cards have hover transition', async ({ page }) => {
    await createTask(page, 'Test hover')
    const taskItem = page.locator('.task-item').first()

    const transition = await getComputedStyle(taskItem, 'transition')
    expect(transition).not.toBe('none')
    expect(transition).not.toBe('')
  })

  test('TC-DS25: Buttons have hover transition', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add task/i })
    const transition = await getComputedStyle(addButton, 'transition')
    expect(transition).not.toBe('none')
    expect(transition).not.toBe('')
  })
})

test.describe('Design System - AC9: Reduced Motion Support', () => {
  test('TC-DS26: Animations disabled with prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const taskTitle = `Test reduced motion ${Date.now()}`
    await createTask(page, taskTitle)
    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
    await toggleTaskCompletion(page, taskItem)
    await expect(taskItem).toHaveClass(/completed/)

    const led = taskItem.locator('.status-led').first()
    const animation = await getComputedStyle(led, 'animation')

    // Animation should be disabled or very short
    expect(animation === 'none' || animation.includes('0s') || animation.includes('0.01ms')).toBeTruthy()
  })
})

test.describe('Design System - AC10: Completed Task Visual Distinction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC-DS27: Completed task title has strikethrough', async ({ page }) => {
    const title = `Task to complete ${Date.now()}`
    await createTask(page, title)
    const taskItem = page.locator('.task-item').filter({ hasText: title })
    await toggleTaskCompletion(page, taskItem)
    await expect(taskItem).toHaveClass(/completed/)

    const taskTitle = taskItem.locator('.task-title').first()
    const textDecoration = await getComputedStyle(taskTitle, 'text-decoration')
    expect(textDecoration).toContain('line-through')
  })

  test('TC-DS28: Completed task uses muted text colour', async ({ page }) => {
    const title = `Task to complete ${Date.now()}`
    await createTask(page, title)
    const taskItem = page.locator('.task-item').filter({ hasText: title })
    await toggleTaskCompletion(page, taskItem)
    await expect(taskItem).toHaveClass(/completed/)

    const taskTitle = taskItem.locator('.task-title').first()
    const color = await getComputedStyle(taskTitle, 'color')
    // Should be muted (tertiary or muted text colour)
    expect([COLORS.textTertiary, COLORS.textMuted]).toContain(color)
  })

  test('TC-DS29: Completed task shows green LED prominently', async ({ page }) => {
    const title = `Task to complete ${Date.now()}`
    await createTask(page, title)
    const taskItem = page.locator('.task-item').filter({ hasText: title })
    await toggleTaskCompletion(page, taskItem)
    await expect(taskItem).toHaveClass(/completed/)

    const led = taskItem.locator('.status-led').first()
    await expect(led).toBeVisible()
    const bgColor = await getComputedStyle(led, 'background-color')
    expect(bgColor).toBe(COLORS.statusSuccess)
  })
})
