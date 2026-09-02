import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field } from "../ui/Field";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function EditorLoginModal({ open, onClose }) {
  const { signIn } = useAuth();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword("");
      setError(null);
      setBusy(false);
    }
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Enter the editor password.");
      return;
    }
    setBusy(true);
    const { error: err } = await signIn(password);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    toast.success("Editor mode enabled.");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={busy ? undefined : onClose}
      title="Editor Mode"
      description="Enter the editor password to add or change records."
      size="sm"
      footer={
        <Button type="submit" form="editor-login" className="w-full" loading={busy}>
          <ShieldCheck className="h-4 w-4" /> Unlock editor mode
        </Button>
      }
    >
      <form id="editor-login" onSubmit={submit} className="space-y-4 pb-2" noValidate>
        <div className="flex items-center gap-3 rounded-xl2 border border-white/10 bg-ink-850 px-4 py-3 text-sm text-cream-300">
          <Lock className="h-4 w-4 shrink-0 text-gold-300" aria-hidden="true" />
          Everyone can view the tracker. Only editors can make changes.
        </div>

        <Field label="Password" htmlFor="editor-password" error={error} required>
          <input
            id="editor-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            autoComplete="current-password"
            autoFocus
            className={`h-12 w-full rounded-xl2 border bg-ink-850 px-4 text-[15px] text-cream-50 placeholder:text-cream-300/50 focus:outline-none focus:ring-2 focus:ring-gold-400/70 ${
              error ? "border-red-500/60" : "border-white/10"
            }`}
            placeholder="••••••••"
          />
        </Field>
      </form>
    </Modal>
  );
}
