import { test, expect } from '@playwright/test'

/**
 * E2E tests for task deletion.
 *
 * Covers TS0001 test cases:
 * - TC025: Delete option is accessible
 * - TC026: Confirmation dialog appears on delete
 * - TC028: Cancelled deletion preserves task
 * - TC029: Delete from detail view returns to list
 */

test.describe('Task Deletion', () => {
  let testTaskTitle

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // Create a test task
    testTaskTitle = `Delete test ${Date.now()}`
    await page.locator('input[type="text"]').first().fill(testTaskTitle)
    await page.locator('button[type="submit"]').click()

    // Wait for task to appear
    await expect(page.locator('.task-item').filter({ hasText: testTaskTitle })).toBeVisible()
  })

  test('TC025: Delete option is accessible in detail view', async ({ page }) => {
    // Open task detail
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Delete button is visible
    await expect(page.locator('button.destructive-button').filter({ hasText: 'Delete' })).toBeVisible()
  })

  test('TC026: Confirmation dialog appears on delete', async ({ page }) => {
    // Open task detail
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()

    // Click delete
    await page.locator('button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Confirmation dialog appears
    await expect(page.locator('.confirm-dialog')).toBeVisible()
  })

  test('TC026: Confirmation dialog shows task title', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()
    await page.locator('button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Dialog shows task title
    await expect(page.locator('.confirm-title')).toContainText(testTaskTitle)
  })

  test('TC026: Confirmation dialog shows warning message', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()
    await page.locator('button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Dialog shows "This cannot be undone" warning
    await expect(page.locator('.confirm-message')).toContainText('cannot be undone')
  })

  test('TC026: Confirmation dialog has confirm and cancel buttons', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()
    await page.locator('button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Confirm button visible
    await expect(page.locator('.confirm-dialog button').filter({ hasText: 'Delete' })).toBeVisible()

    // Cancel button visible
    await expect(page.locator('.confirm-dialog button').filter({ hasText: 'Cancel' })).toBeVisible()
  })

  test('TC028: Cancelled deletion preserves task - dialog closes', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()
    await page.locator('button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Confirmation dialog is visible
    await expect(page.locator('.confirm-dialog')).toBeVisible()

    // Click cancel
    await page.locator('.confirm-dialog button').filter({ hasText: 'Cancel' }).click()

    // Dialog closes
    await expect(page.locator('.confirm-dialog')).not.toBeVisible()
  })

  test('TC028: Cancelled deletion preserves task - task still in list', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()
    await page.locator('button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Click cancel
    await page.locator('.confirm-dialog button').filter({ hasText: 'Cancel' }).click()

    // Close the modal
    await page.locator('button').filter({ hasText: 'Close' }).click()

    // Task still in list
    await expect(page.locator('.task-item').filter({ hasText: testTaskTitle })).toBeVisible()
  })

  test('TC029: Delete from detail view removes task', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()
    await page.locator('button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Confirm deletion
    await page.locator('.confirm-dialog button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Task is deleted - modal closes
    await expect(page.locator('.modal')).not.toBeVisible()
  })

  test('TC029: Delete from detail view - task removed from list', async ({ page }) => {
    await page.locator('.task-item').filter({ hasText: testTaskTitle }).click()
    await page.locator('button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Confirm deletion
    await page.locator('.confirm-dialog button.destructive-button').filter({ hasText: 'Delete' }).click()

    // Wait for modal to close
    await expect(page.locator('.modal')).not.toBeVisible()

    // Task removed from list
    await expect(page.locator('.task-item').filter({ hasText: testTaskTitle })).not.toBeVisible()
  })
})
