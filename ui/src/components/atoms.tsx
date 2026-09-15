import {
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { cn } from "../lib/cn";

export function IconButton({ label, children, tone = "quiet", size = "md", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; tone?: "quiet" | "soft" | "ink" | "danger"; size?: "sm" | "md" | "lg" }) {
  return <button {...props} type={props.type ?? "button"} aria-label={label} className={cn("prism-icon-button", `prism-icon-button--${tone}`, `prism-icon-button--${size}`, className)}>{children}</button>;
}

export function Chip({ children, selected = false, disabled = false, onClick }: { children: ReactNode; selected?: boolean; disabled?: boolean; onClick?: () => void }) {
  return <button type="button" className="prism-chip" aria-pressed={selected} disabled={disabled} onClick={onClick}>{children}</button>;
}

export function Kbd({ children }: { children: ReactNode }) { return <kbd className="prism-kbd">{children}</kbd>; }

export function Avatar({ name, src, size = "md" }: { name: string; src?: string; size?: "xs" | "sm" | "md" | "lg" }) {
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span className={cn("prism-avatar", `prism-avatar--${size}`)} title={name}>{src ? <img src={src} alt={name} /> : <span aria-label={name}>{initials}</span>}</span>;
}

export function AvatarGroup({ names }: { names: string[] }) { return <div className="prism-avatar-group" aria-label={names.join(", ")}>{names.slice(0, 4).map((name) => <Avatar key={name} name={name} size="sm" />)}{names.length > 4 && <span className="prism-avatar-group__more">+{names.length - 4}</span>}</div>; }

export function Skeleton({ lines = 1, width = "100%" }: { lines?: number; width?: string }) { return <span className="prism-skeleton" aria-busy="true" aria-label="Loading content" style={{ "--skeleton-lines": lines, width } as React.CSSProperties} />; }

export function Spinner({ size = "md", label = "Loading" }: { size?: "sm" | "md" | "lg"; label?: string }) { return <span className={cn("prism-loading", `prism-loading--${size}`)} role="status"><i aria-hidden="true" /><span className="prism-visually-hidden">{label}</span></span>; }

export function Alert({ tone = "info", title, children, action }: { tone?: "info" | "success" | "warning" | "danger"; title: string; children?: ReactNode; action?: ReactNode }) {
  const icon = tone === "success" ? "✓" : tone === "warning" ? "!" : tone === "danger" ? "×" : "i";
  return <section className={cn("prism-alert", `prism-alert--${tone}`)} role={tone === "danger" ? "alert" : "status"}><span className="prism-alert__mark" aria-hidden="true">{icon}</span><div><strong>{title}</strong>{children && <p>{children}</p>}</div>{action && <div className="prism-alert__action">{action}</div>}</section>;
}

export function Swatch({ name, color, selected = false, unavailable = false, onSelect }: { name: string; color: string; selected?: boolean; unavailable?: boolean; onSelect?: () => void }) { return <button type="button" className="prism-swatch" aria-label={`${name}${unavailable ? ", unavailable" : ""}`} aria-pressed={selected} disabled={unavailable} onClick={onSelect}><span style={{ background: color }} aria-hidden="true" /><em>{name}</em></button>; }

export const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function TextArea({ className, ...props }, ref) { return <textarea {...props} ref={ref} className={cn("prism-textarea", className)} />; });

export function SelectInput({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) { return <span className="prism-select-wrap"><select {...props} className={cn("prism-select", className)}>{children}</select><i aria-hidden="true">⌄</i></span>; }

export function Checkbox({ label, description, checked, onChange, disabled }: { label: string; description?: string; checked: boolean; onChange: (next: boolean) => void; disabled?: boolean }) { const id = useId(); return <label className={cn("prism-check-row", disabled && "is-disabled")} htmlFor={id}><input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} disabled={disabled} /><span className="prism-check-row__box" aria-hidden="true">✓</span><span><b>{label}</b>{description && <small>{description}</small>}</span></label>; }

export function RadioGroup<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: ReadonlyArray<{ value: T; label: string; description?: string; disabled?: boolean }>; onChange: (next: T) => void }) { const name = useId(); return <fieldset className="prism-radio-group"><legend>{label}</legend>{options.map((option) => <label key={option.value} className={cn("prism-radio", option.disabled && "is-disabled")}><input name={name} type="radio" value={option.value} checked={value === option.value} disabled={option.disabled} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value as T)} /><span aria-hidden="true" /><b>{option.label}</b>{option.description && <small>{option.description}</small>}</label>)}</fieldset>; }

export function Tabs<T extends string>({ value, onChange, tabs, label }: { value: T; onChange: (next: T) => void; tabs: ReadonlyArray<{ value: T; label: string; count?: number; disabled?: boolean }>; label: string }) { return <div className="prism-tabs" role="tablist" aria-label={label}>{tabs.map((tab) => <button role="tab" type="button" key={tab.value} aria-selected={tab.value === value} disabled={tab.disabled} onClick={() => onChange(tab.value)}>{tab.label}{tab.count !== undefined && <span>{tab.count}</span>}</button>)}</div>; }

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) { return <nav className="prism-breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={item.label}>{index > 0 && <i aria-hidden="true">/</i>}{item.href ? <a href={item.href}>{item.label}</a> : <b aria-current="page">{item.label}</b>}</span>)}</nav>; }

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) { const visible = Array.from({ length: Math.min(pages, 5) }, (_, index) => index + 1); return <nav className="prism-pagination" aria-label="Pagination"><IconButton label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}>←</IconButton>{visible.map((item) => <button key={item} type="button" aria-current={item === page ? "page" : undefined} onClick={() => onChange(item)}>{item}</button>)}{pages > 5 && <span>…</span>}<IconButton label="Next page" disabled={page >= pages} onClick={() => onChange(page + 1)}>→</IconButton></nav>; }

export function Metric({ label, value, delta, direction = "up" }: { label: string; value: ReactNode; delta?: string; direction?: "up" | "down" | "flat" }) { return <div className="prism-metric"><span>{label}</span><strong>{value}</strong>{delta && <small className={`is-${direction}`}>{direction === "up" ? "↗" : direction === "down" ? "↘" : "→"} {delta}</small>}</div>; }

export function KeyValueList({ items }: { items: Array<{ label: string; value: ReactNode }> }) { return <dl className="prism-key-value">{items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>; }

export function EmptyState({ title, description, action, icon = "✦" }: { title: string; description: string; action?: ReactNode; icon?: string }) { return <section className="prism-empty"><span aria-hidden="true">{icon}</span><h3>{title}</h3><p>{description}</p>{action}</section>; }

export function ListItem({ title, description, leading, trailing, ...props }: HTMLAttributes<HTMLDivElement> & { title: string; description?: string; leading?: ReactNode; trailing?: ReactNode }) { return <div {...props} className={cn("prism-list-item", props.className)}>{leading && <div className="prism-list-item__leading">{leading}</div>}<div><b>{title}</b>{description && <p>{description}</p>}</div>{trailing && <div className="prism-list-item__trailing">{trailing}</div>}</div>; }
