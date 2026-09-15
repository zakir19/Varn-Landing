import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";

export function Tooltip({
  label,
  children,
  position = "top",
}: {
  label: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}) {
  const id = useId();
  return <span className={cn("prism-tooltip", `prism-tooltip--${position}`)}><span aria-describedby={id}>{children}</span><span id={id} role="tooltip">{label}</span></span>;
}

export function Popover({
  trigger,
  children,
  align = "start",
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "center" | "end";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event: MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, [open]);

  return <div className={cn("prism-popover", `prism-popover--${align}`)} ref={root}><button type="button" className="prism-popover__trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{trigger}</button>{open && <section id={id} className="prism-popover__panel" role="dialog">{children}</section>}</div>;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "right" | "left";
  footer?: ReactNode;
}) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(<div className="prism-drawer-backdrop" onMouseDown={onClose}><section className={cn("prism-drawer", `prism-drawer--${side}`)} role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}><header><h2 id={titleId}>{title}</h2><button type="button" aria-label="Close panel" onClick={onClose}>×</button></header><div className="prism-drawer__body">{children}</div>{footer && <footer>{footer}</footer>}</section></div>, document.body);
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  tone = "danger",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "danger" | "ink";
}) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  const confirm = () => { onConfirm(); onClose(); };
  return createPortal(<div className="prism-drawer-backdrop prism-confirm-backdrop" onMouseDown={onClose}><section className="prism-confirm" role="alertdialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}><span aria-hidden="true">!</span><h2 id={titleId}>{title}</h2><p>{description}</p><div><button type="button" onClick={onClose}>Cancel</button><button type="button" className={`prism-confirm__action prism-confirm__action--${tone}`} onClick={confirm}>{confirmLabel}</button></div></section></div>, document.body);
}

export function InlineNotice({
  title,
  children,
  tone = "info",
  onDismiss,
}: {
  title: string;
  children?: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  onDismiss?: () => void;
}) {
  const mark = tone === "success" ? "✓" : tone === "warning" ? "!" : tone === "danger" ? "×" : "i";
  return <aside className={cn("prism-inline-notice", `prism-inline-notice--${tone}`)}><span aria-hidden="true">{mark}</span><div><b>{title}</b>{children && <p>{children}</p>}</div>{onDismiss && <button type="button" aria-label="Dismiss notice" onClick={onDismiss}>×</button>}</aside>;
}

export function CopyField({ value, label = "Copy value", copiedLabel = "Copied" }: { value: string; label?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return <div className="prism-copy-field"><code>{value}</code><button type="button" onClick={copy} aria-live="polite">{copied ? copiedLabel : label}</button></div>;
}
