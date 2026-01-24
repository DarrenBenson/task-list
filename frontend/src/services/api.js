/**
 * API client for the Task Manager backend.
 */

const API_BASE_URL = "/api/v1";

/**
 * Fetch all tasks.
 * @returns {Promise<Array>} List of tasks
 */
export async function getTasks() {
  const response = await fetch(`${API_BASE_URL}/tasks/`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

/**
 * Create a new task.
 * @param {Object} task - Task data
 * @param {string} task.title - Task title
 * @param {string} [task.description] - Task description
 * @returns {Promise<Object>} Created task
 */
export async function createTask(task) {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
}

/**
 * Update an existing task.
 * @param {string} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated task
 */
export async function updateTask(id, updates) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Failed to update task");
  }
  return response.json();
}

/**
 * Delete a task.
 * @param {string} id - Task ID
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}
