import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./primitives";

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="prism-dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="prism-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="prism-dialog__topline"><span>PRISM / CONFIRM</span><button type="button" onClick={onClose} aria-label="Close dialog">×</button></div>
        <h2 id="dialog-title">{title}</h2>
        <div className="prism-dialog__body">{children}</div>
        <div className="prism-dialog__actions"><Button tone="quiet" onClick={onClose}>Not now</Button><Button onClick={onClose}>Continue <span aria-hidden="true">↗</span></Button></div>
      </section>
    </div>,
    document.body,
  );
}

export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return createPortal(
    <div className="prism-toast" role="status"><span className="prism-toast__spark" aria-hidden="true">✦</span><span>{message}</span><button type="button" onClick={onDismiss} aria-label="Dismiss notification">×</button></div>,
    document.body,
  );
}
