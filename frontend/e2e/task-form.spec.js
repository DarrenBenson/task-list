import { test, expect } from '@playwright/test'

/**
 * E2E tests for task creation form.
 *
 * Covers TS0001 test cases:
 * - TC006: Task creation form is accessible
 * - TC008: Task appears in list after creation
 * - TC018: List updates after task creation
 */

test.describe('Task Creation Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('TC006: Task creation form is accessible', async ({ page }) => {
    // Title input field is visible
    const titleInput = page.locator('input[type="text"]').first()
    await expect(titleInput).toBeVisible()

    // Description textarea is visible
    const descriptionTextarea = page.locator('textarea')
    await expect(descriptionTextarea).toBeVisible()

    // Submit button is visible
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('TC008: Task appears in list after creation', async ({ page }) => {
    const taskTitle = `Test task ${Date.now()}`

    // Fill in the form
    await page.locator('input[type="text"]').first().fill(taskTitle)

    // Submit the form
    await page.locator('button[type="submit"]').click()

    // Task appears in list
    await expect(page.locator('.task-item').filter({ hasText: taskTitle })).toBeVisible()
  })

  test('TC008: Form clears after task creation', async ({ page }) => {
    const taskTitle = `Clear form test ${Date.now()}`

    // Fill in the form
    const titleInput = page.locator('input[type="text"]').first()
    await titleInput.fill(taskTitle)

    // Submit the form
    await page.locator('button[type="submit"]').click()

    // Wait for task to appear in list
    await expect(page.locator('.task-item').filter({ hasText: taskTitle })).toBeVisible()

    // Form fields are cleared
    await expect(titleInput).toHaveValue('')
  })

  test('TC018: List updates after task creation without page refresh', async ({ page }) => {
    // Wait for initial tasks to load by waiting for network idle
    await page.waitForLoadState('networkidle')

    // Count initial tasks after page is stable
    const initialCount = await page.locator('.task-item').count()

    // Create a new task and wait for API response
    const taskTitle = `No refresh test ${Date.now()}`
    await page.locator('input[type="text"]').first().fill(taskTitle)
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/v1/tasks') && resp.status() === 201),
      page.locator('button[type="submit"]').click()
    ])

    // New task appears without refresh (verify our specific task is visible)
    await expect(page.locator('.task-item').filter({ hasText: taskTitle })).toBeVisible({ timeout: 5000 })
    // Count should have increased by 1
    const newCount = await page.locator('.task-item').count()
    expect(newCount).toBe(initialCount + 1)
  })
})
