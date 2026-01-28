/**
 * Sortable task item component with drag-and-drop support.
 * Wraps task content with useSortable hook from @dnd-kit.
 */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * Format a deadline for compact display (list view).
 */
function formatDeadlineCompact(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Check if a deadline datetime has passed.
 */
function isOverdue(deadlineString) {
  if (!deadlineString) return false;
  const deadline = new Date(deadlineString);
  return deadline < new Date();
}

function SortableTaskItem({ task, onTaskClick, onToggleComplete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleItemClick = () => {
    if (onTaskClick) {
      onTaskClick(task.id);
    }
  };

  const handleItemKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onTaskClick) {
        onTaskClick(task.id);
      }
    }
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`task-item ${task.is_complete ? "completed" : ""} ${isDragging ? "dragging" : ""}`}
      onClick={handleItemClick}
      tabIndex={0}
      onKeyDown={handleItemKeyDown}
      aria-label={`Task: ${task.title}${task.is_complete ? " (completed)" : ""}`}
    >
      <button
        className="drag-handle"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        type="button"
        onClick={(e) => e.stopPropagation()}
      >
        <span aria-hidden="true">⋮⋮</span>
      </button>
      <span
        className="status-led"
        aria-hidden="true"
      />
      <span className="task-checkbox-wrapper">
        <input
          type="checkbox"
          className="task-checkbox-input"
          checked={task.is_complete}
          onChange={(e) => {
            e.stopPropagation();
            if (onToggleComplete) {
              onToggleComplete(task.id, e.target.checked);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label={
            task.is_complete ? "Mark as incomplete" : "Mark as complete"
          }
        />
        <span className="task-checkbox" aria-hidden="true">
          {task.is_complete ? "☑" : "☐"}
        </span>
      </span>
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        {task.deadline && (
          <div className="task-deadline">
            {isOverdue(task.deadline) && (
              <span className="overdue-badge" title="Overdue">Overdue</span>
            )}
            <span>Due: {formatDeadlineCompact(task.deadline)}</span>
          </div>
        )}
      </div>
    </li>
  );
}

export default SortableTaskItem;
