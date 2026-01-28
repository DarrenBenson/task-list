// @ts-check
import { test, expect } from '@playwright/test'

/**
 * E2E tests for US0007: Reorder Tasks
 * Tests drag-and-drop reordering functionality
 */

test.describe('Task Reorder', () => {
  // Helper to create tasks via API
  async function createTask(page, title, description = null) {
    const response = await page.request.post('/api/v1/tasks/', {
      data: { title, description },
    })
    return response.json()
  }

  // Helper to get all tasks via API
  async function getTasks(page) {
    const response = await page.request.get('/api/v1/tasks/')
    return response.json()
  }

  // Helper to clear all tasks
  async function clearTasks(page) {
    const tasks = await getTasks(page)
    for (const task of tasks) {
      await page.request.delete(`/api/v1/tasks/${task.id}`)
    }
  }

  test.beforeEach(async ({ page }) => {
    await clearTasks(page)
  })

  test('TC-R01: Drag handle is visible on each task', async ({ page }) => {
    // Create tasks
    await createTask(page, 'Task 1')
    await createTask(page, 'Task 2')

    await page.goto('/')

    // Wait for tasks to load
    await expect(page.locator('.task-item')).toHaveCount(2)

    // Check drag handles are visible
    const dragHandles = page.locator('.drag-handle')
    await expect(dragHandles).toHaveCount(2)

    // Verify first drag handle is visible
    await expect(dragHandles.first()).toBeVisible()
  })

  test('TC-R02: Drag handle has grab cursor', async ({ page }) => {
    await createTask(page, 'Task 1')

    await page.goto('/')
    await expect(page.locator('.task-item')).toHaveCount(1)

    // Check cursor style
    const dragHandle = page.locator('.drag-handle').first()
    await expect(dragHandle).toHaveCSS('cursor', 'grab')
  })

  test('TC-R03: Task can be dragged from position 1 to position 3', async ({ page }) => {
    // Create 3 tasks
    const task1 = await createTask(page, 'First Task')
    const task2 = await createTask(page, 'Second Task')
    const task3 = await createTask(page, 'Third Task')

    await page.goto('/')

    // Wait for tasks to load
    await expect(page.locator('.task-item')).toHaveCount(3)

    // Get drag handles
    const dragHandles = page.locator('.drag-handle')
    const firstHandle = dragHandles.first()
    const thirdHandle = dragHandles.nth(2)

    // Get bounding boxes
    const firstBox = await firstHandle.boundingBox()
    const thirdBox = await thirdHandle.boundingBox()

    // Perform drag from first to after third
    await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(thirdBox.x + thirdBox.width / 2, thirdBox.y + thirdBox.height + 10, { steps: 10 })
    await page.mouse.up()

    // Wait for reorder to complete
    await page.waitForTimeout(500)

    // Verify new order - First Task should now be last
    const taskTitles = page.locator('.task-title')
    await expect(taskTitles.first()).toHaveText('Second Task')
    await expect(taskTitles.nth(1)).toHaveText('Third Task')
    await expect(taskTitles.nth(2)).toHaveText('First Task')
  })

  test('TC-R04: Task can be dragged from position 3 to position 1', async ({ page }) => {
    // Create 3 tasks
    await createTask(page, 'First Task')
    await createTask(page, 'Second Task')
    await createTask(page, 'Third Task')

    await page.goto('/')

    // Wait for tasks to load
    await expect(page.locator('.task-item')).toHaveCount(3)

    // Get drag handles
    const dragHandles = page.locator('.drag-handle')
    const firstHandle = dragHandles.first()
    const thirdHandle = dragHandles.nth(2)

    // Get bounding boxes
    const firstBox = await firstHandle.boundingBox()
    const thirdBox = await thirdHandle.boundingBox()

    // Perform drag from third to before first
    await page.mouse.move(thirdBox.x + thirdBox.width / 2, thirdBox.y + thirdBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y - 10, { steps: 10 })
    await page.mouse.up()

    // Wait for reorder to complete
    await page.waitForTimeout(500)

    // Verify new order - Third Task should now be first
    const taskTitles = page.locator('.task-title')
    await expect(taskTitles.first()).toHaveText('Third Task')
    await expect(taskTitles.nth(1)).toHaveText('First Task')
    await expect(taskTitles.nth(2)).toHaveText('Second Task')
  })

  test('TC-R05: Reorder persists after page refresh', async ({ page }) => {
    // Create 3 tasks
    await createTask(page, 'First Task')
    await createTask(page, 'Second Task')
    await createTask(page, 'Third Task')

    await page.goto('/')
    await expect(page.locator('.task-item')).toHaveCount(3)

    // Get drag handles
    const dragHandles = page.locator('.drag-handle')
    const firstHandle = dragHandles.first()
    const thirdHandle = dragHandles.nth(2)

    // Get bounding boxes
    const firstBox = await firstHandle.boundingBox()
    const thirdBox = await thirdHandle.boundingBox()

    // Perform drag from third to before first
    await page.mouse.move(thirdBox.x + thirdBox.width / 2, thirdBox.y + thirdBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y - 10, { steps: 10 })
    await page.mouse.up()

    // Wait for API call to complete
    await page.waitForTimeout(500)

    // Refresh the page
    await page.reload()

    // Wait for tasks to load
    await expect(page.locator('.task-item')).toHaveCount(3)

    // Verify order persisted - Third Task should still be first
    const taskTitles = page.locator('.task-title')
    await expect(taskTitles.first()).toHaveText('Third Task')
    await expect(taskTitles.nth(1)).toHaveText('First Task')
    await expect(taskTitles.nth(2)).toHaveText('Second Task')
  })

  test('TC-R06: API reorder endpoint returns updated tasks', async ({ page }) => {
    // Create 3 tasks
    const task1 = await createTask(page, 'Task A')
    const task2 = await createTask(page, 'Task B')
    const task3 = await createTask(page, 'Task C')

    // Call reorder API directly
    const response = await page.request.put('/api/v1/tasks/reorder', {
      data: { task_ids: [task3.id, task1.id, task2.id] },
    })

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data).toHaveLength(3)
    expect(data[0].id).toBe(task3.id)
    expect(data[0].position).toBe(1)
    expect(data[1].id).toBe(task1.id)
    expect(data[1].position).toBe(2)
    expect(data[2].id).toBe(task2.id)
    expect(data[2].position).toBe(3)
  })

  test('TC-R07: Single task list shows drag handle but no reorder needed', async ({ page }) => {
    await createTask(page, 'Only Task')

    await page.goto('/')
    await expect(page.locator('.task-item')).toHaveCount(1)

    // Drag handle should still be visible
    const dragHandle = page.locator('.drag-handle')
    await expect(dragHandle).toBeVisible()
  })

  test('TC-R08: Empty task list shows no drag handles', async ({ page }) => {
    await page.goto('/')

    // Wait for empty state
    await expect(page.locator('.task-list-empty')).toBeVisible()

    // No drag handles should exist
    const dragHandles = page.locator('.drag-handle')
    await expect(dragHandles).toHaveCount(0)
  })

  test('TC-R09: Checkbox still works after reorder', async ({ page }) => {
    await createTask(page, 'Task 1')
    await createTask(page, 'Task 2')

    await page.goto('/')
    await expect(page.locator('.task-item')).toHaveCount(2)

    // Reorder tasks
    const dragHandles = page.locator('.drag-handle')
    const firstHandle = dragHandles.first()
    const secondHandle = dragHandles.nth(1)

    const firstBox = await firstHandle.boundingBox()
    const secondBox = await secondHandle.boundingBox()

    await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y - 10, { steps: 10 })
    await page.mouse.up()

    await page.waitForTimeout(500)

    // Now toggle completion on the first task (which was Task 2)
    const checkbox = page.locator('.task-checkbox-input').first()
    await checkbox.click()

    // Wait for update
    await page.waitForTimeout(300)

    // First task should now be completed
    const firstTask = page.locator('.task-item').first()
    await expect(firstTask).toHaveClass(/completed/)
  })
})
