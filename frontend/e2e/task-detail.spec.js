import { test, expect } from '@playwright/test'

/**
 * E2E tests for task detail modal.
 *
 * Covers TS0001 test cases:
 * - TC019: Task detail view is accessible
 * - TC023: User can cancel edit
 * - TC024: User can return to list from detail view
 */

test.describe('Task Detail View', () => {
  let testTaskTitle

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Create a test task
    testTaskTitle = `Detail test ${Date.now()}`
    await page.locator('input[type="text"]').first().fill(testTaskTitle)
    await page.locator('textarea').fill('Test description for detail view')
    await page.locator('button[type="submit"]').click()

    // Wait for task to appear
    await expect(page.locator('.task-item').filter({ hasText: testTaskTitle })).toBeVisible()
  })

  test('TC019: Task detail view is accessible - modal opens on click', async ({ page }) => {
    // Click on the task
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Modal opens
    await expect(page.locator('.modal')).toBeVisible()
  })

  test('TC019: Task detail view shows title', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Title is displayed
    await expect(page.locator('.detail-value').first()).toContainText(testTaskTitle)
  })

  test('TC019: Task detail view shows description', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Description is displayed
    await expect(page.locator('.modal-body')).toContainText('Test description for detail view')
  })

  test('TC019: Task detail view shows timestamps', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Created timestamp is displayed
    await expect(page.locator('.detail-timestamps')).toContainText('Created')

    // Updated timestamp is displayed
    await expect(page.locator('.detail-timestamps')).toContainText('Updated')
  })

  test('TC019: Edit button is visible in detail view', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Edit button is visible
    await expect(page.locator('button').filter({ hasText: 'Edit' })).toBeVisible()
  })

  test('TC023: User can cancel edit - changes are discarded', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Click edit
    await page.locator('button').filter({ hasText: 'Edit' }).click()

    // Change the title
    const titleInput = page.locator('#edit-title')
    await expect(titleInput).toBeVisible()
    await titleInput.fill('Modified title that should be discarded')

    // Click cancel
    await page.locator('button').filter({ hasText: 'Cancel' }).click()

    // Original title is displayed
    await expect(page.locator('.detail-value').first()).toContainText(testTaskTitle)
  })

  test('TC023: User can cancel edit - original description displayed', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Click edit
    await page.locator('button').filter({ hasText: 'Edit' }).click()

    // Change the description
    const descInput = page.locator('#edit-description')
    await descInput.fill('Modified description that should be discarded')

    // Click cancel
    await page.locator('button').filter({ hasText: 'Cancel' }).click()

    // Original description is displayed
    await expect(page.locator('.modal-body')).toContainText('Test description for detail view')
  })

  test('TC024: User can return to list from detail view', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Modal is visible
    await expect(page.locator('.modal')).toBeVisible()

    // Click close button
    await page.locator('button').filter({ hasText: 'Close' }).click()

    // Modal closes
    await expect(page.locator('.modal')).not.toBeVisible()

    // Task list is still visible
    await expect(page.locator('.task-list')).toBeVisible()
  })

  test('TC024: User can close modal by clicking backdrop', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Modal is visible
    await expect(page.locator('.modal')).toBeVisible()

    // Click on backdrop (outside modal)
    await page.locator('.modal-backdrop').click({ position: { x: 10, y: 10 } })

    // Modal closes
    await expect(page.locator('.modal')).not.toBeVisible()
  })
})
