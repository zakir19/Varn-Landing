import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { cn } from "../lib/cn";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "ink" | "violet" | "soft" | "quiet" | "danger";
  size?: "sm" | "md" | "lg";
  leading?: ReactNode;
  trailing?: ReactNode;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    tone = "ink",
    size = "md",
    leading,
    trailing,
    loading = false,
    className,
    children,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      className={cn("prism-button", `prism-button--${tone}`, `prism-button--${size}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="prism-spinner" aria-hidden="true" /> : leading && <span className="prism-button__icon">{leading}</span>}
      <span>{children}</span>
      {!loading && trailing && <span className="prism-button__icon">{trailing}</span>}
    </button>
  );
});

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "violet" | "success" | "warning" | "danger";
  children: ReactNode;
}) {
  return <span className={cn("prism-badge", `prism-badge--${tone}`)}><i aria-hidden="true" />{children}</span>;
}

export function Card({
  children,
  className,
  accent = "none",
}: {
  children: ReactNode;
  className?: string;
  accent?: "none" | "violet" | "blush" | "clay";
}) {
  return <section className={cn("prism-card", `prism-card--accent-${accent}`, className)}>{children}</section>;
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label className="prism-field" htmlFor={htmlFor}>
      <span className="prism-field__label">{label}</span>
      {children}
      {error ? <span className="prism-field__message prism-field__message--error">{error}</span> : hint && <span className="prism-field__message">{hint}</span>}
    </label>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput(
  { className, ...props },
  ref,
) {
  return <input {...props} ref={ref} className={cn("prism-input", className)} />;
});

export function Toggle({
  label,
  pressed,
  onPressedChange,
  description,
}: {
  label: string;
  pressed: boolean;
  onPressedChange: (next: boolean) => void;
  description?: string;
}) {
  const id = useId();
  return (
    <div className="prism-toggle-row">
      <div>
        <label htmlFor={id}>{label}</label>
        {description && <p>{description}</p>}
      </div>
      <button id={id} className="prism-switch" type="button" role="switch" aria-checked={pressed} onClick={() => onPressedChange(!pressed)}>
        <span aria-hidden="true" />
      </button>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  label: string;
}) {
  return (
    <div className="prism-segmented" aria-label={label} role="group">
      {options.map((option) => (
        <button type="button" key={option.value} aria-pressed={option.value === value} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Progress({ value, label }: { value: number; label: string }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="prism-progress">
      <div className="prism-progress__label"><span>{label}</span><strong>{safeValue}%</strong></div>
      <div className="prism-progress__track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue}>
        <span style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

export function Divider({ label }: { label?: string }) {
  return <div className="prism-divider">{label && <span>{label}</span>}</div>;
}
