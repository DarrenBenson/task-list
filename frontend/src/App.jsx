import { useState, useEffect, useCallback } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskDetail from "./components/TaskDetail";

const API_BASE_URL = "/api/v1";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`);
      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError("Unable to load tasks. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseDetail = () => {
    setSelectedTaskId(null);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setSelectedTaskId(null);
  };

  const clearUpdateError = useCallback(() => {
    setUpdateError(null);
  }, []);

  const handleToggleComplete = async (taskId, isComplete) => {
    // Clear any previous error
    setUpdateError(null);

    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_complete: isComplete } : task,
      ),
    );

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_complete: isComplete }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (err) {
      // Revert on error and notify user
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, is_complete: !isComplete } : task,
        ),
      );
      setUpdateError("Failed to update task. Please try again.");
    }
  };

  const handleReorder = async (oldIndex, newIndex) => {
    // Skip if same position
    if (oldIndex === newIndex) return;

    // Clear any previous error
    setUpdateError(null);

    // Save previous state for potential revert
    const previousTasks = [...tasks];

    // Create new array with moved item
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(oldIndex, 1);
    newTasks.splice(newIndex, 0, movedTask);

    // Optimistic update
    setTasks(newTasks);

    // Get task IDs in new order
    const taskIds = newTasks.map((t) => t.id);

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_ids: taskIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder");
      }

      // Update with server response to get correct positions
      const updatedTasks = await response.json();
      setTasks(updatedTasks);
    } catch (err) {
      // Revert on error and notify user
      setTasks(previousTasks);
      setUpdateError("Failed to reorder tasks. Please try again.");
    }
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>

      {updateError && (
        <div className="toast-error" role="alert">
          <span>{updateError}</span>
          <button
            className="toast-close"
            onClick={clearUpdateError}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <TaskForm onTaskCreated={handleTaskCreated} />

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        onRetry={fetchTasks}
        onTaskClick={handleTaskClick}
        onToggleComplete={handleToggleComplete}
        onReorder={handleReorder}
      />

      {selectedTaskId && (
        <TaskDetail
          taskId={selectedTaskId}
          onClose={handleCloseDetail}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}

      <style>{`
        /* ============================================
         * Design System CSS Custom Properties
         * Based on Home-Lab-Hub Brand Guide
         * ============================================ */
        :root {
          /* Backgrounds */
          --bg-primary: #0D1117;
          --bg-secondary: #161B22;
          --bg-tertiary: #21262D;

          /* Borders */
          --border-default: #30363D;
          --border-subtle: #21262D;
          --border-strong: #484F58;

          /* Text */
          --text-primary: #F0F6FC;
          --text-secondary: #C9D1D9;
          --text-tertiary: #8B949E;
          --text-muted: #484F58;

          /* Status */
          --status-success: #4ADE80;
          --status-success-glow: rgba(74, 222, 128, 0.2);
          --status-error: #F87171;
          --status-error-glow: rgba(248, 113, 113, 0.2);

          /* Interactive */
          --interactive-default: #22D3EE;
          --interactive-hover: #67E8F9;
          --interactive-active: #06B6D4;

          /* Border Radius */
          --radius-sm: 4px;
          --radius-md: 8px;
          --radius-lg: 12px;

          /* Spacing */
          --space-1: 4px;
          --space-2: 8px;
          --space-3: 12px;
          --space-4: 16px;
          --space-6: 24px;
          --space-8: 32px;

          /* Transitions */
          --transition-fast: 100ms;
          --transition-normal: 150ms;
          --transition-slow: 300ms;
        }

        /* Base Styles */
        *, *::before, *::after {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          background-color: var(--bg-primary);
          color: var(--text-secondary);
        }

        body {
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .app {
          max-width: 600px;
          margin: 0 auto;
          padding: var(--space-6);
          min-height: 100vh;
        }

        h1 {
          margin: 0 0 var(--space-6) 0;
          color: var(--text-primary);
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 2rem;
          font-weight: 700;
        }

        /* Toast Notification */
        .toast-error {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          margin-bottom: var(--space-4);
          background: rgba(248, 113, 113, 0.15);
          border: 1px solid var(--status-error);
          border-radius: var(--radius-md);
          color: var(--status-error);
          animation: slideIn var(--transition-normal) ease-out;
        }

        .toast-close {
          background: none;
          border: none;
          padding: var(--space-1);
          color: var(--status-error);
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          opacity: 0.7;
        }

        .toast-close:hover {
          opacity: 1;
          background: rgba(248, 113, 113, 0.2);
          border-radius: var(--radius-sm);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Task Form Styles */
        .task-form {
          margin-bottom: var(--space-8);
        }

        .form-group {
          margin-bottom: var(--space-3);
        }

        .form-group label {
          display: block;
          margin-bottom: var(--space-2);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-tertiary);
        }

        input, textarea {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: var(--text-primary);
          transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
        }

        input::placeholder, textarea::placeholder {
          color: var(--text-muted);
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: var(--interactive-default);
          box-shadow: 0 0 0 3px var(--status-success-glow);
        }

        textarea {
          resize: vertical;
          min-height: 60px;
        }

        /* Button Styles */
        button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-4);
          font-family: 'Space Grotesk', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all var(--transition-normal);
          /* Primary button default */
          background-color: var(--interactive-default);
          color: var(--bg-primary);
        }

        button:hover:not(:disabled) {
          background-color: var(--interactive-hover);
        }

        button:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.3);
        }

        button:disabled {
          background-color: var(--bg-tertiary);
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .secondary-button {
          background-color: transparent;
          color: var(--text-secondary);
          border-color: var(--border-default);
        }

        .secondary-button:hover:not(:disabled) {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .error-message {
          color: var(--status-error);
          margin-bottom: var(--space-3);
          padding: var(--space-3);
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid var(--status-error);
          border-radius: var(--radius-md);
        }

        /* Task List Styles */
        .task-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
          user-select: none;
        }

        .task-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-4);
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-2);
          min-height: 44px;
          cursor: pointer;
          transition: background-color var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
        }

        .task-item:hover {
          background-color: var(--bg-tertiary);
          border-color: var(--border-strong);
        }

        .task-item:focus {
          outline: none;
          border-color: var(--interactive-default);
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.2);
        }

        /* Status LED */
        .status-led {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
          background-color: var(--text-muted);
        }

        .task-item.completed .status-led {
          background-color: var(--status-success);
          box-shadow: 0 0 8px var(--status-success-glow);
          animation: pulse-green 2s ease-in-out infinite;
        }

        @keyframes pulse-green {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--status-success-glow); }
          50% { opacity: 0.7; box-shadow: 0 0 16px var(--status-success-glow); }
        }

        .task-checkbox-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-1);
          margin: calc(-1 * var(--space-1));
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--text-tertiary);
        }

        .task-checkbox-wrapper:hover {
          background: rgba(34, 211, 238, 0.1);
          color: var(--interactive-default);
        }

        .task-checkbox-wrapper:focus-within {
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.3);
        }

        .task-checkbox-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          margin: 0;
        }

        .task-checkbox {
          font-size: 18px;
          line-height: 1;
          flex-shrink: 0;
          width: 24px;
          text-align: center;
          pointer-events: none;
        }

        .task-item.completed .task-checkbox {
          color: var(--status-success);
        }

        .task-content {
          flex: 1;
          min-width: 0;
        }

        .task-title {
          display: block;
          word-wrap: break-word;
          overflow-wrap: break-word;
          color: var(--text-primary);
        }

        .task-description {
          margin: var(--space-1) 0 0;
          color: var(--text-tertiary);
          font-size: 13px;
        }

        /* Completed task styling */
        .task-item.completed .task-title {
          text-decoration: line-through;
          color: var(--text-tertiary);
        }

        .task-item.completed .task-description {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        /* Task Deadline */
        .task-deadline {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-top: var(--space-1);
          font-size: 12px;
          color: var(--text-tertiary);
        }

        /* Overdue Badge */
        .overdue-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          padding: 2px var(--space-2);
          background: rgba(220, 38, 38, 0.15);
          border: 1px solid #dc2626;
          border-radius: var(--radius-sm);
          color: #dc2626;
          font-size: 11px;
          font-weight: 500;
        }

        .overdue-badge::before {
          content: '⚠';
        }

        /* Loading state */
        .task-list-loading {
          text-align: center;
          padding: var(--space-8) var(--space-4);
          color: var(--text-tertiary);
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--bg-tertiary);
          border-top-color: var(--interactive-default);
          border-radius: 50%;
          margin: 0 auto var(--space-3);
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error state */
        .task-list-error {
          text-align: center;
          padding: var(--space-8) var(--space-4);
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid var(--status-error);
          border-radius: var(--radius-lg);
          color: var(--status-error);
        }

        .retry-button {
          margin-top: var(--space-3);
        }

        /* Empty state */
        .task-list-empty {
          text-align: center;
          padding: var(--space-8) var(--space-4);
          color: var(--text-tertiary);
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: var(--space-4);
        }

        .modal {
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--border-default);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: var(--text-primary);
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
        }

        .modal-body {
          padding: var(--space-6);
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          padding: var(--space-4) var(--space-6);
          border-top: 1px solid var(--border-default);
        }

        .modal-loading,
        .modal-error {
          text-align: center;
          padding: var(--space-8) var(--space-4);
          color: var(--text-tertiary);
        }

        .detail-field {
          margin-bottom: var(--space-4);
        }

        .detail-field label {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-tertiary);
          margin-bottom: var(--space-1);
        }

        .detail-value {
          margin: 0;
          color: var(--text-primary);
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .detail-value em {
          color: var(--text-muted);
        }

        .detail-timestamps {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .detail-timestamps .detail-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: var(--text-secondary);
        }

        /* Destructive Button */
        .destructive-button {
          background: transparent;
          color: var(--status-error);
          border-color: var(--status-error);
        }

        .destructive-button:hover:not(:disabled) {
          background: var(--status-error);
          color: var(--bg-primary);
        }

        .destructive-button:focus {
          box-shadow: 0 0 0 3px var(--status-error-glow);
        }

        /* Confirmation Dialog */
        .confirm-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: var(--space-4);
        }

        .confirm-dialog {
          background: var(--bg-secondary);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          max-width: 400px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .confirm-title {
          margin: 0 0 var(--space-2);
          font-size: 18px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .confirm-message {
          margin: 0 0 var(--space-6);
          color: var(--text-secondary);
        }

        .confirm-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
        }

        /* Drag Handle Styles */
        .drag-handle {
          background: none;
          border: none;
          padding: var(--space-1) 2px;
          margin: calc(-1 * var(--space-1)) 0 calc(-1 * var(--space-1)) calc(-1 * var(--space-1));
          cursor: grab;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 14px;
          letter-spacing: 2px;
          touch-action: none;
          transition: background-color var(--transition-normal), color var(--transition-normal);
        }

        .drag-handle:hover {
          background: var(--bg-tertiary);
          color: var(--text-tertiary);
        }

        .drag-handle:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.3);
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        /* Dragging State */
        .task-item.dragging {
          opacity: 0.6;
          background: var(--bg-tertiary);
          border-color: var(--interactive-default);
          box-shadow: 0 8px 24px rgba(34, 211, 238, 0.15);
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .status-led {
            animation: none !important;
          }

          .loading-spinner {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
