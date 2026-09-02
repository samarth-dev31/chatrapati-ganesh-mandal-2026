import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  tone = "danger",
}) {
  const [working, setWorking] = useState(false);

  const handleConfirm = async () => {
    setWorking(true);
    try {
      await onConfirm?.();
    } finally {
      setWorking(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={working ? undefined : onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={working}>
            Cancel
          </Button>
          <Button variant={tone} className="flex-1" onClick={handleConfirm} loading={working}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="pb-2 text-sm leading-relaxed text-cream-200">{message}</p>
    </Modal>
  );
}
