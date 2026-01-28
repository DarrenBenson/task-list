import { test, expect } from '@playwright/test'

/**
 * E2E tests for task list display.
 *
 * Covers TS0001 test cases:
 * - TC015: Task list item shows key information
 * - TC016: Completed tasks are visually distinct
 * - TC017: Empty state is displayed
 */

test.describe('Task List Display', () => {
  test('TC015: Task list item shows key information', async ({ page }) => {
    // Create a task with description to test
    const taskTitle = `Info test ${Date.now()}`
    const taskDescription = 'Test description for visibility'

    await page.goto('/')

    // Create task with description
    await page.locator('input[type="text"]').first().fill(taskTitle)
    await page.locator('textarea').fill(taskDescription)
    await page.locator('button[type="submit"]').click()

    // Wait for task to appear
    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
    await expect(taskItem).toBeVisible()

    // Task title is displayed
    await expect(taskItem.locator('.task-title')).toContainText(taskTitle)

    // Completion checkbox is visible
    await expect(taskItem.locator('.task-checkbox')).toBeVisible()
  })

  test('TC016: Completed tasks are visually distinct - strikethrough', async ({ page }) => {
    await page.goto('/')

    // Create a task
    const taskTitle = `Complete style test ${Date.now()}`
    await page.locator('input[type="text"]').first().fill(taskTitle)
    await page.locator('button[type="submit"]').click()

    // Find the task item
    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
    await expect(taskItem).toBeVisible()

    // Initially not completed - no 'completed' class
    await expect(taskItem).not.toHaveClass(/completed/)

    // Toggle completion
    await taskItem.locator('.task-checkbox-input').click()

    // Now has completed class
    await expect(taskItem).toHaveClass(/completed/)

    // Title has strikethrough (via CSS)
    const titleElement = taskItem.locator('.task-title')
    await expect(titleElement).toHaveCSS('text-decoration-line', 'line-through')
  })

  test('TC016: Completed tasks are visually distinct - muted colour', async ({ page }) => {
    await page.goto('/')

    // Create and complete a task
    const taskTitle = `Muted style test ${Date.now()}`
    await page.locator('input[type="text"]').first().fill(taskTitle)
    await page.locator('button[type="submit"]').click()

    const taskItem = page.locator('.task-item').filter({ hasText: taskTitle })
    await expect(taskItem).toBeVisible()

    // Toggle completion
    await taskItem.locator('.task-checkbox-input').click()
    await expect(taskItem).toHaveClass(/completed/)

    // Completed task title has muted text colour (tertiary: #8B949E = rgb(139, 148, 158))
    const titleElement = taskItem.locator('.task-title')
    await expect(titleElement).toHaveCSS('color', 'rgb(139, 148, 158)')
  })

  test('TC017: Empty state is displayed', async ({ page, request }) => {
    // First, delete all existing tasks via API
    const tasksResponse = await request.get('http://localhost:8000/api/v1/tasks/')
    const tasks = await tasksResponse.json()

    for (const task of tasks) {
      await request.delete(`http://localhost:8000/api/v1/tasks/${task.id}`)
    }

    // Now load the page
    await page.goto('/')

    // Empty state message is displayed
    await expect(page.locator('.task-list-empty')).toBeVisible()
    await expect(page.locator('.task-list-empty')).toContainText('No tasks yet')

    // Message encourages task creation
    await expect(page.locator('.task-list-empty')).toContainText('Add one above')
  })

  test('TC015: Tasks maintain position order', async ({ page }) => {
    await page.goto('/')

    // Create multiple tasks
    const task1 = `First task ${Date.now()}`
    const task2 = `Second task ${Date.now()}`
    const task3 = `Third task ${Date.now()}`

    await page.locator('input[type="text"]').first().fill(task1)
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.task-item').filter({ hasText: task1 })).toBeVisible()

    await page.locator('input[type="text"]').first().fill(task2)
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.task-item').filter({ hasText: task2 })).toBeVisible()

    await page.locator('input[type="text"]').first().fill(task3)
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.task-item').filter({ hasText: task3 })).toBeVisible()

    // Reload to check persistence and order
    await page.reload()

    // Get all task titles in order
    const taskItems = page.locator('.task-item')
    const count = await taskItems.count()

    // Find positions of our tasks
    let task1Index = -1, task2Index = -1, task3Index = -1
    for (let i = 0; i < count; i++) {
      const text = await taskItems.nth(i).textContent()
      if (text.includes(task1)) task1Index = i
      if (text.includes(task2)) task2Index = i
      if (text.includes(task3)) task3Index = i
    }

    // They should be in creation order
    expect(task1Index).toBeLessThan(task2Index)
    expect(task2Index).toBeLessThan(task3Index)
  })
})
