import { type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

type Gap = "0" | "1" | "2" | "3" | "4" | "5" | "6";
const style = (gap: Gap, align?: CSSProperties["alignItems"], justify?: CSSProperties["justifyContent"]): CSSProperties => ({ "--prism-gap": `var(--prism-space-${gap})`, alignItems: align, justifyContent: justify } as CSSProperties);
export function Stack({ children, gap = "3", align, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; gap?: Gap; align?: CSSProperties["alignItems"] }) { return <div {...props} className={cn("prism-stack", className)} style={{ ...style(gap, align), ...props.style }}>{children}</div>; }
export function Inline({ children, gap = "2", align = "center", justify, wrap = true, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; gap?: Gap; align?: CSSProperties["alignItems"]; justify?: CSSProperties["justifyContent"]; wrap?: boolean }) { return <div {...props} className={cn("prism-inline", !wrap && "prism-inline--no-wrap", className)} style={{ ...style(gap, align, justify), ...props.style }}>{children}</div>; }
export function Grid({ children, columns = 2, gap = "3", className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; columns?: 1 | 2 | 3 | 4; gap?: Gap }) { return <div {...props} className={cn("prism-grid", className)} style={{ "--prism-columns": columns, ...style(gap), ...props.style } as CSSProperties}>{children}</div>; }
export function Cluster({ children, gap = "2", className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; gap?: Gap }) { return <div {...props} className={cn("prism-cluster", className)} style={{ ...style(gap), ...props.style }}>{children}</div>; }
export function VisuallyHidden({ children }: { children: ReactNode }) { return <span className="prism-visually-hidden">{children}</span>; }
