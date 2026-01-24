import { useState, useRef, useEffect } from "react";

/**
 * Task creation form component.
 * Allows users to create tasks with a title and optional description.
 */
function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef(null);

  // Auto-focus title input on mount
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required");
      titleInputRef.current?.focus();
      return;
    }

    if (trimmedTitle.length > 200) {
      setError("Title must be 200 characters or less");
      titleInputRef.current?.focus();
      return;
    }

    if (description && description.length > 2000) {
      setError("Description must be 2000 characters or less");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          description: description.trim() || null,
          deadline: deadline || null,
        }),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const data = await response.json();
          const message = data.detail?.[0]?.msg || "Validation error";
          setError(message);
        } else {
          setError("Failed to create task. Please try again.");
        }
        return;
      }

      const task = await response.json();

      // Clear form
      setTitle("");
      setDescription("");
      setDeadline("");
      titleInputRef.current?.focus();

      // Notify parent
      if (onTaskCreated) {
        onTaskCreated(task);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <input
          ref={titleInputRef}
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          maxLength={201}
          aria-label="Task title"
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="Add details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          rows={2}
          maxLength={2001}
          aria-label="Task description"
        />
      </div>

      <div className="form-group">
        <label htmlFor="deadline">Deadline (optional)</label>
        <input
          id="deadline"
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={isSubmitting}
          aria-label="Task deadline"
        />
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
