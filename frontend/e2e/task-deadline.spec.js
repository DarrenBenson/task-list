import { test, expect } from '@playwright/test'

/**
 * E2E tests for task deadline feature.
 *
 * Covers TS0012 test cases:
 * - TC0012-1: Create task with deadline via form
 * - TC0012-2: Create task without deadline
 * - TC0012-3: Edit task to add deadline
 * - TC0012-4: Remove deadline from task
 * - TC0012-5: Overdue task displays red badge
 * - TC0012-6: Task before deadline is not overdue
 * - TC0012-8: Future deadline shows without overdue indicator
 * - TC0012-9: Deadline persists after refresh
 * - TC0012-11: Completed overdue task shows badge
 */

test.describe('Task Deadline Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for app to load
    await page.waitForLoadState('networkidle')
  })

  test.describe('Create Task with Deadline', () => {
    test('TC0012-1: Create task with deadline via form', async ({ page }) => {
      const taskTitle = `Deadline task ${Date.now()}`
      const deadline = '2026-01-25T17:00'

      // Fill in the form
      await page.locator('input[type="text"]').first().fill(taskTitle)
      await page.locator('input[type="datetime-local"]').fill(deadline)

      // Submit the form
      await page.locator('button[type="submit"]').click()

      // Task appears in list
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()

      // Deadline is displayed
      await expect(taskItem).toContainText('25 Jan')
      await expect(taskItem).toContainText('17:00')
    })

    test('TC0012-2: Create task without deadline', async ({ page }) => {
      const taskTitle = `No deadline task ${Date.now()}`

      // Fill in the form (no deadline)
      await page.locator('input[type="text"]').first().fill(taskTitle)

      // Submit the form
      await page.locator('button[type="submit"]').click()

      // Task appears in list
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()

      // No deadline indicator visible (no "Due:" text)
      await expect(taskItem.locator('.task-deadline')).not.toBeVisible()
    })
  })

  test.describe('Edit Task Deadline', () => {
    test('TC0012-3: Edit task to add deadline', async ({ page }) => {
      // First create a task without deadline
      const taskTitle = `Add deadline ${Date.now()}`
      await page.locator('input[type="text"]').first().fill(taskTitle)
      await page.locator('button[type="submit"]').click()

      // Wait for task to appear
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()

      // Click to open detail
      await taskItem.click()

      // Click edit button
      await page.locator('button:has-text("Edit")').click()

      // Set deadline
      await page.locator('.modal input[type="datetime-local"]').fill('2026-01-30T09:00')

      // Save
      await page.locator('button:has-text("Save")').click()

      // Close modal
      await page.locator('button:has-text("Close")').click()

      // Verify deadline in list
      await expect(taskItem).toContainText('30 Jan')
    })

    test('TC0012-4: Remove deadline from task', async ({ page }) => {
      // Create a task with deadline
      const taskTitle = `Remove deadline ${Date.now()}`
      await page.locator('input[type="text"]').first().fill(taskTitle)
      await page.locator('input[type="datetime-local"]').fill('2026-01-28T14:00')
      await page.locator('button[type="submit"]').click()

      // Wait for task to appear
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()
      await expect(taskItem).toContainText('28 Jan')

      // Click to open detail
      await taskItem.click()

      // Click edit button
      await page.locator('button:has-text("Edit")').click()

      // Clear deadline
      await page.locator('.modal input[type="datetime-local"]').clear()

      // Save
      await page.locator('button:has-text("Save")').click()

      // Close modal
      await page.locator('button:has-text("Close")').click()

      // Verify no deadline in list
      await expect(taskItem.locator('.task-deadline')).not.toBeVisible()
    })
  })

  test.describe('Overdue Indicator', () => {
    test('TC0012-5: Overdue task displays red badge', async ({ page }) => {
      // Create task via API with past deadline
      const taskTitle = `Overdue task ${Date.now()}`
      const pastDeadline = '2026-01-20T12:00:00'

      const response = await page.request.post('/api/v1/tasks/', {
        data: {
          title: taskTitle,
          deadline: pastDeadline
        }
      })
      expect(response.ok()).toBeTruthy()

      // Refresh page to see task
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Find task
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()

      // Verify overdue badge is visible
      const overdueBadge = taskItem.locator('.overdue-badge')
      await expect(overdueBadge).toBeVisible()
    })

    test('TC0012-8: Future deadline shows without overdue indicator', async ({ page }) => {
      // Create task with future deadline
      const taskTitle = `Future task ${Date.now()}`
      const futureDeadline = '2026-02-15T10:00:00'

      const response = await page.request.post('/api/v1/tasks/', {
        data: {
          title: taskTitle,
          deadline: futureDeadline
        }
      })
      expect(response.ok()).toBeTruthy()

      // Refresh page
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Find task
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()

      // Verify deadline is displayed
      await expect(taskItem).toContainText('15 Feb')

      // Verify no overdue badge
      const overdueBadge = taskItem.locator('.overdue-badge')
      await expect(overdueBadge).not.toBeVisible()
    })

    test('TC0012-11: Completed overdue task still shows badge', async ({ page }) => {
      // Create completed overdue task via API
      const taskTitle = `Completed overdue ${Date.now()}`

      // Create task with past deadline
      const createResponse = await page.request.post('/api/v1/tasks/', {
        data: {
          title: taskTitle,
          deadline: '2026-01-20T12:00:00'
        }
      })
      const task = await createResponse.json()

      // Mark as complete
      await page.request.patch(`/api/v1/tasks/${task.id}`, {
        data: { is_complete: true }
      })

      // Refresh page
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Find task
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()

      // Verify both completion and overdue styling
      await expect(taskItem).toHaveClass(/completed/)
      const overdueBadge = taskItem.locator('.overdue-badge')
      await expect(overdueBadge).toBeVisible()
    })
  })

  test.describe('Deadline Persistence', () => {
    test('TC0012-9: Deadline persists after page refresh', async ({ page }) => {
      // Create task with deadline
      const taskTitle = `Persistent deadline ${Date.now()}`
      await page.locator('input[type="text"]').first().fill(taskTitle)
      await page.locator('input[type="datetime-local"]').fill('2026-01-25T17:00')
      await page.locator('button[type="submit"]').click()

      // Wait for task to appear
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()
      await expect(taskItem).toContainText('25 Jan')

      // Refresh page
      await page.reload()
      await page.waitForLoadState('networkidle')

      // Verify deadline still visible
      const taskItemAfterRefresh = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItemAfterRefresh).toBeVisible()
      await expect(taskItemAfterRefresh).toContainText('25 Jan')
      await expect(taskItemAfterRefresh).toContainText('17:00')
    })
  })

  test.describe('Deadline Form Field', () => {
    test('Datetime picker is visible in task creation form', async ({ page }) => {
      // Verify datetime-local input exists
      const deadlineInput = page.locator('input[type="datetime-local"]')
      await expect(deadlineInput).toBeVisible()
    })

    test('Form clears deadline after task creation', async ({ page }) => {
      const taskTitle = `Clear deadline ${Date.now()}`
      const deadlineInput = page.locator('input[type="datetime-local"]')

      // Fill form with deadline
      await page.locator('input[type="text"]').first().fill(taskTitle)
      await deadlineInput.fill('2026-01-25T17:00')

      // Submit
      await page.locator('button[type="submit"]').click()

      // Wait for task to appear
      await expect(page.locator('.task-item').filter({ hasText: taskTitle })).toBeVisible()

      // Verify deadline input is cleared
      await expect(deadlineInput).toHaveValue('')
    })
  })

  test.describe('Task Detail Deadline Display', () => {
    test('Task detail shows deadline in full format', async ({ page }) => {
      // Create task with deadline
      const taskTitle = `Detail deadline ${Date.now()}`
      await page.locator('input[type="text"]').first().fill(taskTitle)
      await page.locator('input[type="datetime-local"]').fill('2026-01-25T17:00')
      await page.locator('button[type="submit"]').click()

      // Wait for task and click to open detail
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()
      await taskItem.click()

      // Verify deadline in detail view (full format)
      const modal = page.locator('.modal')
      await expect(modal).toBeVisible()
      await expect(modal).toContainText('Deadline')
      await expect(modal).toContainText('25 January 2026')
      await expect(modal).toContainText('17:00')
    })

    test('Task detail shows "No deadline" when not set', async ({ page }) => {
      // Create task without deadline
      const taskTitle = `No deadline detail ${Date.now()}`
      await page.locator('input[type="text"]').first().fill(taskTitle)
      await page.locator('button[type="submit"]').click()

      // Wait for task and click to open detail
      const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
      await expect(taskItem).toBeVisible()
      await taskItem.click()

      // Verify "No deadline" shown
      const modal = page.locator('.modal')
      await expect(modal).toBeVisible()
      await expect(modal).toContainText('No deadline')
    })
  })
})
