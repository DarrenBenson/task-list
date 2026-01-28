import { test, expect } from '@playwright/test'

/**
 * E2E Tests for Task Organisation
 * Generated from TS0002: Task Organisation
 * 
 * Traceability:
 * - Epic: EP0002
 * - Stories: US0006, US0007
 */

test.describe('TS0002: Task Organisation', () => {
  // Helper to create tasks via API
  async function createTask(page, title, description = null) {
    const response = await page.request.post('/api/v1/tasks/', {
      data: { title, description },
    })
    return response.json()
  }

  // Helper to clear all tasks
  async function clearTasks(page) {
    const response = await page.request.get('/api/v1/tasks/')
    const tasks = await response.json()
    for (const task of tasks) {
      await page.request.delete(`/api/v1/tasks/${task.id}`)
    }
  }

  test.beforeEach(async ({ page }) => {
    await clearTasks(page)
  })

  test('TC0002-1: Toggle Task Completion (E2E)', async ({ page }) => {
    /**
     * Story: US0006
     * Priority: High
     */
    // Given: a task list with an incomplete task
    const taskTitle = 'Incomplete Task'
    await createTask(page, taskTitle)
    await page.goto('/')

    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
    await expect(taskItem).toBeVisible()
    const checkbox = taskItem.locator('.task-checkbox-input')
    await expect(checkbox).toBeVisible()

    // When: the user clicks the checkbox
    await checkbox.click()

    // Then: checkbox becomes checked immediately (visual class applied)
    await expect(taskItem).toHaveClass(/completed/)

    // And: the task text shows strikethrough
    const titleElement = taskItem.locator('.task-title')
    await expect(titleElement).toHaveCSS('text-decoration-line', 'line-through')

    // When: clicking the checkbox again
    await checkbox.click()

    // Then: task becomes incomplete again
    await expect(taskItem).not.toHaveClass(/completed/)
    await expect(titleElement).toHaveCSS('text-decoration-line', 'none')
  })

  test('TC0002-3: Drag-and-Drop Reordering (E2E)', async ({ page }) => {
    /**
     * Story: US0007
     * Priority: Critical
     */
    // Given: tasks A (pos 1) and B (pos 2)
    await createTask(page, 'Task A')
    await createTask(page, 'Task B')
    await page.goto('/')

    await expect(page.locator('.task-item')).toHaveCount(2)
    const taskA = page.locator('.task-item').filter({ hasText: 'Task A' })
    const taskB = page.locator('.task-item').filter({ hasText: 'Task B' })

    // Verify initial order
    const taskTitles = page.locator('.task-title')
    await expect(taskTitles.first()).toHaveText('Task A')
    await expect(taskTitles.last()).toHaveText('Task B')

    // When: user drags A below B
    const dragHandleA = taskA.locator('.drag-handle')
    const dragHandleB = taskB.locator('.drag-handle')

    const boxA = await dragHandleA.boundingBox()
    const boxB = await dragHandleB.boundingBox()

    if (boxA && boxB) {
      await page.mouse.move(boxA.x + boxA.width / 2, boxA.y + boxA.height / 2)
      await page.mouse.down()
      // Drag below B
      await page.mouse.move(boxB.x + boxB.width / 2, boxB.y + boxB.height + 10, { steps: 10 })
      await page.mouse.up()
    }

    // Then: task A moves below B
    await page.waitForTimeout(500) // Wait for animation/state update
    await expect(taskTitles.first()).toHaveText('Task B')
    await expect(taskTitles.last()).toHaveText('Task A')
  })
})
