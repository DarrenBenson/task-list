import { useEffect, useRef } from "react";

/**
 * Confirmation dialog component.
 * Modal dialog for confirming destructive actions.
 */
function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    // Focus cancel button by default to prevent accidental confirmation
    cancelButtonRef.current?.focus();

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, isLoading]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  };

  return (
    <div className="confirm-backdrop" onClick={handleBackdropClick}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-labelledby="confirm-title"
      >
        <h3 id="confirm-title" className="confirm-title">
          {title}
        </h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button
            ref={cancelButtonRef}
            className="secondary-button"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            className={isDestructive ? "destructive-button" : ""}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
