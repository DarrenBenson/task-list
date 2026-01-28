import { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE_URL = "/api/v1";

/**
 * Format a date string for display.
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a deadline for full display (detail view).
 */
function formatDeadlineFull(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Convert ISO datetime to datetime-local input format.
 */
function toDatetimeLocalValue(isoString) {
  if (!isoString) return "";
  // datetime-local expects: YYYY-MM-DDTHH:mm
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Task detail modal component.
 * Displays task details and allows editing.
 */
function TaskDetail({ taskId, onClose, onTaskUpdated, onTaskDeleted }) {
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTask = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          signal: abortController.signal,
        });
        if (response.status === 404) {
          setError("Task not found");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to load task");
        }
        const data = await response.json();
        setTask(data);
        setEditTitle(data.title);
        setEditDescription(data.description || "");
        setEditDeadline(toDatetimeLocalValue(data.deadline));
      } catch (err) {
        // Ignore abort errors (component unmounted or taskId changed)
        if (err.name === "AbortError") {
          return;
        }
        setError("Unable to load task. Please try again.");
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchTask();

    return () => {
      abortController.abort();
    };
  }, [taskId]);

  const handleEdit = () => {
    setIsEditing(true);
    setSaveError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDeadline(toDatetimeLocalValue(task.deadline));
    setSaveError("");
  };

  const handleSave = async () => {
    setSaveError("");

    // Client-side validation
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setSaveError("Title is required");
      return;
    }

    if (trimmedTitle.length > 200) {
      setSaveError("Title must be 200 characters or less");
      return;
    }

    const trimmedDescription = editDescription.trim();
    if (trimmedDescription.length > 2000) {
      setSaveError("Description must be 2000 characters or less");
      return;
    }

    // Normalise deadline for comparison
    const currentDeadline = toDatetimeLocalValue(task.deadline);
    const newDeadline = editDeadline || null;
    const deadlineChanged = editDeadline !== currentDeadline;

    // Check if anything changed
    const hasChanges =
      trimmedTitle !== task.title ||
      (trimmedDescription || null) !== (task.description || null) ||
      deadlineChanged;

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      const updateData = {};
      if (trimmedTitle !== task.title) {
        updateData.title = trimmedTitle;
      }
      if ((trimmedDescription || null) !== (task.description || null)) {
        updateData.description = trimmedDescription || null;
      }
      if (deadlineChanged) {
        updateData.deadline = newDeadline || null;
      }

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.status === 404) {
        setSaveError("Task not found. It may have been deleted.");
        return;
      }

      if (response.status === 422) {
        const data = await response.json();
        const message = data.detail?.[0]?.msg || "Validation error";
        setSaveError(message);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      const updatedTask = await response.json();
      setTask(updatedTask);
      setIsEditing(false);

      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }
    } catch (err) {
      setSaveError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isEditing && !showDeleteConfirm && !isDeleting) {
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setDeleteError("");
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.status === 404) {
        // Task already deleted, still notify parent to remove from list
        if (onTaskDeleted) {
          onTaskDeleted(taskId);
        }
        onClose();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      if (onTaskDeleted) {
        onTaskDeleted(taskId);
      }
      onClose();
    } catch (err) {
      setDeleteError("Failed to delete. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal">
          <div className="modal-loading">
            <div className="loading-spinner" />
            <p>Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal">
          <div className="modal-error">
            <p>{error}</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">Task Details</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close"
            disabled={isSaving}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {isEditing ? (
            <>
              <div className="form-group">
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={isSaving}
                  maxLength={201}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={isSaving}
                  rows={4}
                  maxLength={2001}
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-deadline">Deadline (optional)</label>
                <input
                  id="edit-deadline"
                  type="datetime-local"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              {saveError && (
                <div className="error-message" role="alert">
                  {saveError}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="detail-field">
                <label>Title</label>
                <p className="detail-value">{task.title}</p>
              </div>

              <div className="detail-field">
                <label>Description</label>
                <p className="detail-value">
                  {task.description || <em>No description</em>}
                </p>
              </div>

              <div className="detail-field">
                <label>Status</label>
                <p className="detail-value">
                  {task.is_complete ? "Complete" : "Incomplete"}
                </p>
              </div>

              <div className="detail-field">
                <label>Deadline</label>
                <p className="detail-value">
                  {task.deadline
                    ? formatDeadlineFull(task.deadline)
                    : <em>No deadline</em>}
                </p>
              </div>

              <div className="detail-timestamps">
                <div className="detail-field">
                  <label>Created</label>
                  <p className="detail-value">{formatDate(task.created_at)}</p>
                </div>
                <div className="detail-field">
                  <label>Updated</label>
                  <p className="detail-value">{formatDate(task.updated_at)}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {deleteError && (
          <div className="modal-body">
            <div className="error-message" role="alert">
              {deleteError}
            </div>
          </div>
        )}

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button
                className="secondary-button"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              <button
                className="destructive-button"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
              <div style={{ flex: 1 }} />
              <button className="secondary-button" onClick={onClose}>
                Close
              </button>
              <button onClick={handleEdit}>Edit</button>
            </>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title={`Delete "${task.title}"?`}
          message="This cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

export default TaskDetail;
