import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Tests for frontend project structure.
 *
 * Covers TS0001 test cases:
 * - TC004: Frontend project structure exists
 * - TC005: Development servers start correctly (implicit via webServer)
 */

const frontendDir = resolve(import.meta.dirname, '..')

test.describe('Frontend Project Structure', () => {
  test('TC004: src/App.jsx exists', () => {
    const path = resolve(frontendDir, 'src/App.jsx')
    expect(existsSync(path)).toBe(true)
  })

  test('TC004: src/main.jsx exists', () => {
    const path = resolve(frontendDir, 'src/main.jsx')
    expect(existsSync(path)).toBe(true)
  })

  test('TC004: package.json contains React 18', () => {
    const packagePath = resolve(frontendDir, 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))

    expect(packageJson.dependencies.react).toMatch(/\^?18/)
  })

  test('TC004: package.json contains Vite', () => {
    const packagePath = resolve(frontendDir, 'package.json')
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))

    expect(packageJson.devDependencies.vite).toBeDefined()
  })

  test('TC005: Frontend serves on port 5173', async ({ page }) => {
    // This test implicitly passes if the webServer starts successfully
    const response = await page.goto('/')
    expect(response.status()).toBe(200)
  })

  test('TC005: Backend health check accessible', async ({ request }) => {
    const response = await request.get('http://localhost:8000/health')
    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('healthy')
  })
})
