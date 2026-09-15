import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn";

/** A column definition keeps row shape inference intact for a data table. */
export type DataTableColumn<Row> = {
  id: string;
  header: ReactNode;
  cell: (row: Row, index: number) => ReactNode;
  align?: "start" | "center" | "end";
  width?: CSSProperties["width"];
  sortable?: boolean;
  headerLabel?: string;
};

export type DataTableSort = {
  columnId: string;
  direction: "ascending" | "descending";
};

export type DataTableProps<Row> = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  columns: readonly DataTableColumn<Row>[];
  rows: readonly Row[];
  getRowId: (row: Row, index: number) => string;
  caption?: ReactNode;
  emptyState?: ReactNode;
  loading?: boolean;
  sort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  selectedRowIds?: ReadonlySet<string>;
  onSelectedRowIdsChange?: (next: Set<string>) => void;
  isRowSelectable?: (row: Row, index: number) => boolean;
  density?: "comfortable" | "compact";
};

const emptyRowIds: ReadonlySet<string> = new Set<string>();

/**
 * A semantic table with optional controlled sorting and bulk row selection.
 * Sorting stays controlled so consumers can choose local, remote, or URL-based data.
 */
export function DataTable<Row>({
  columns,
  rows,
  getRowId,
  caption,
  emptyState = "No records match this view.",
  loading = false,
  sort = null,
  onSortChange,
  selectedRowIds = emptyRowIds,
  onSelectedRowIdsChange,
  isRowSelectable = () => true,
  density = "comfortable",
  className,
  ...props
}: DataTableProps<Row>) {
  const selectableRows = rows.filter((row, index) => isRowSelectable(row, index));
  const selectableIds = selectableRows.map((row) => getRowId(row, rows.indexOf(row)));
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedRowIds.has(id));
  const someSelected = !allSelected && selectableIds.some((id) => selectedRowIds.has(id));
  const selectionEnabled = Boolean(onSelectedRowIdsChange);

  const toggleAll = () => {
    if (!onSelectedRowIdsChange) return;
    const next = new Set(selectedRowIds);
    if (allSelected) selectableIds.forEach((id) => next.delete(id));
    else selectableIds.forEach((id) => next.add(id));
    onSelectedRowIdsChange(next);
  };

  const toggleRow = (id: string) => {
    if (!onSelectedRowIdsChange) return;
    const next = new Set(selectedRowIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedRowIdsChange(next);
  };

  const requestSort = (columnId: string) => {
    if (!onSortChange) return;
    if (sort?.columnId !== columnId) {
      onSortChange({ columnId, direction: "ascending" });
      return;
    }
    if (sort.direction === "ascending") {
      onSortChange({ columnId, direction: "descending" });
      return;
    }
    onSortChange(null);
  };

  return (
    <div
      {...props}
      className={cn("prism-data-table", `prism-data-table--${density}`, className)}
      aria-busy={loading || undefined}
    >
      <div className="prism-data-table__scroll">
        <table>
          {caption && <caption>{caption}</caption>}
          <colgroup>
            {selectionEnabled && <col className="prism-data-table__selection-column" />}
            {columns.map((column) => <col key={column.id} style={column.width ? { width: column.width } : undefined} />)}
          </colgroup>
          <thead>
            <tr>
              {selectionEnabled && (
                <th className="prism-data-table__select-cell" scope="col">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    aria-checked={someSelected ? "mixed" : allSelected}
                    checked={allSelected}
                    disabled={selectableIds.length === 0}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((column) => {
                const direction = sort?.columnId === column.id ? sort.direction : "none";
                const label = column.headerLabel ?? (typeof column.header === "string" ? column.header : column.id);
                const nextDirection = direction === "ascending" ? "descending" : direction === "descending" ? "none" : "ascending";
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={column.sortable ? direction : undefined}
                    className={`prism-data-table__cell--${column.align ?? "start"}`}
                  >
                    {column.sortable ? (
                      <button
                        className="prism-data-table__sort"
                        type="button"
                        onClick={() => requestSort(column.id)}
                        aria-label={`Sort by ${label}, next ${nextDirection}`}
                      >
                        <span>{column.header}</span>
                        <i aria-hidden="true">{direction === "ascending" ? "↑" : direction === "descending" ? "↓" : "↕"}</i>
                      </button>
                    ) : column.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr><td className="prism-data-table__empty" colSpan={columns.length + (selectionEnabled ? 1 : 0)}>Loading records…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="prism-data-table__empty" colSpan={columns.length + (selectionEnabled ? 1 : 0)}>{emptyState}</td></tr>
            ) : rows.map((row, index) => {
              const id = getRowId(row, index);
              const selectable = isRowSelectable(row, index);
              return (
                <tr key={id} data-selected={selectedRowIds.has(id) || undefined}>
                  {selectionEnabled && (
                    <td className="prism-data-table__select-cell">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${index + 1}`}
                        checked={selectedRowIds.has(id)}
                        disabled={!selectable}
                        onChange={() => toggleRow(id)}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.id} className={`prism-data-table__cell--${column.align ?? "start"}`}>
                      {column.cell(row, index)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DataTableToolbar({
  children,
  label = "Table actions",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode; label?: string }) {
  return <div {...props} className={cn("prism-data-toolbar", className)} role="toolbar" aria-label={label}>{children}</div>;
}

export type StepState = "complete" | "current" | "upcoming" | "error";

export type StepperStep = {
  id: string;
  label: string;
  description?: ReactNode;
  state?: StepState;
  disabled?: boolean;
};

export type StepperProps = Omit<HTMLAttributes<HTMLOListElement>, "children"> & {
  steps: readonly StepperStep[];
  currentStep: string;
  onStepChange?: (stepId: string) => void;
  allowFutureSteps?: boolean;
  orientation?: "horizontal" | "vertical";
  label?: string;
};

function stateForStep(step: StepperStep, index: number, currentIndex: number): StepState {
  if (step.state) return step.state;
  if (index < currentIndex) return "complete";
  if (index === currentIndex) return "current";
  return "upcoming";
}

/** A progress navigator that remains a plain, readable ordered list without JavaScript. */
export function Stepper({
  steps,
  currentStep,
  onStepChange,
  allowFutureSteps = false,
  orientation = "horizontal",
  label = "Progress",
  className,
  ...props
}: StepperProps) {
  const currentIndex = Math.max(0, steps.findIndex((step) => step.id === currentStep));
  return (
    <ol {...props} className={cn("prism-stepper", `prism-stepper--${orientation}`, className)} aria-label={label}>
      {steps.map((step, index) => {
        const state = stateForStep(step, index, currentIndex);
        const interactive = Boolean(onStepChange) && !step.disabled && (allowFutureSteps || state !== "upcoming");
        const summary = `Step ${index + 1} of ${steps.length}: ${step.label}, ${state}`;
        const content = (
          <>
            <span className="prism-stepper__marker" aria-hidden="true">
              {state === "complete" ? "✓" : state === "error" ? "!" : index + 1}
            </span>
            <span className="prism-stepper__copy"><strong>{step.label}</strong>{step.description && <small>{step.description}</small>}</span>
          </>
        );
        return (
          <li key={step.id} data-state={state}>
            {interactive ? (
              <button
                type="button"
                aria-label={summary}
                aria-current={state === "current" ? "step" : undefined}
                onClick={() => onStepChange?.(step.id)}
              >
                {content}
              </button>
            ) : (
              <span aria-label={summary} aria-current={state === "current" ? "step" : undefined}>{content}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export type TimelineItem = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  dateTime?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  tone?: "neutral" | "violet" | "success" | "warning" | "danger";
};

export function Timeline({
  items,
  label = "Activity timeline",
  className,
  ...props
}: Omit<HTMLAttributes<HTMLOListElement>, "children"> & { items: readonly TimelineItem[]; label?: string }) {
  return (
    <ol {...props} className={cn("prism-timeline", className)} aria-label={label}>
      {items.map((item) => (
        <li key={item.id} data-tone={item.tone ?? "neutral"}>
          <span className="prism-timeline__mark" aria-hidden="true">{item.leading ?? ""}</span>
          <div className="prism-timeline__body">
            <div className="prism-timeline__heading"><h3>{item.title}</h3>{item.timestamp && <time dateTime={item.dateTime}>{item.timestamp}</time>}</div>
            {item.description && <p>{item.description}</p>}
          </div>
          {item.trailing && <div className="prism-timeline__trailing">{item.trailing}</div>}
        </li>
      ))}
    </ol>
  );
}

export type ListBoxOption<Value extends string> = {
  value: Value;
  label: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
};

export type ListBoxProps<Value extends string> = Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> & {
  options: readonly ListBoxOption<Value>[];
  value: Value | null;
  onValueChange: (value: Value) => void;
  label?: string;
  description?: ReactNode;
  emptyMessage?: ReactNode;
};

/** A single-select listbox with roving focus, including Home/End and arrow navigation. */
export function ListBox<Value extends string>({
  options,
  value,
  onValueChange,
  label,
  description,
  emptyMessage = "No options are available.",
  className,
  ...props
}: ListBoxProps<Value>) {
  const generatedId = useId();
  const listBoxId = `${generatedId}-listbox`;
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;
  const enabledOptions = useMemo(() => options.filter((option) => !option.disabled), [options]);
  const [focusedValue, setFocusedValue] = useState<Value | undefined>(value ?? enabledOptions[0]?.value);
  const optionRefs = useRef(new Map<Value, HTMLButtonElement>());

  useEffect(() => {
    if (value && enabledOptions.some((option) => option.value === value)) setFocusedValue(value);
  }, [enabledOptions, value]);

  const moveFocus = (from: Value, movement: "next" | "previous" | "first" | "last") => {
    if (enabledOptions.length === 0) return;
    const currentIndex = Math.max(0, enabledOptions.findIndex((option) => option.value === from));
    const index = movement === "first" ? 0 : movement === "last" ? enabledOptions.length - 1 : movement === "next"
      ? (currentIndex + 1) % enabledOptions.length
      : (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
    const next = enabledOptions[index].value;
    setFocusedValue(next);
    optionRefs.current.get(next)?.focus();
  };

  const onOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, option: ListBoxOption<Value>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(option.value, "next");
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(option.value, "previous");
    } else if (event.key === "Home") {
      event.preventDefault();
      moveFocus(option.value, "first");
    } else if (event.key === "End") {
      event.preventDefault();
      moveFocus(option.value, "last");
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onValueChange(option.value);
    }
  };

  const focusableValue = value && enabledOptions.some((option) => option.value === value) ? value : focusedValue;
  return (
    <section className={cn("prism-listbox-field", className)}>
      {label && <div id={labelId} className="prism-listbox-field__label">{label}</div>}
      {description && <div id={descriptionId} className="prism-listbox-field__description">{description}</div>}
      <div
        {...props}
        id={listBoxId}
        className="prism-listbox"
        role="listbox"
        aria-label={label ? undefined : "Options"}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={description ? descriptionId : undefined}
      >
        {options.length === 0 ? <p className="prism-listbox__empty">{emptyMessage}</p> : options.map((option) => (
          <button
            key={option.value}
            ref={(element) => {
              if (element) optionRefs.current.set(option.value, element);
              else optionRefs.current.delete(option.value);
            }}
            className="prism-listbox__option"
            type="button"
            role="option"
            aria-selected={value === option.value}
            tabIndex={focusableValue === option.value ? 0 : -1}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            onFocus={() => setFocusedValue(option.value)}
            onKeyDown={(event) => onOptionKeyDown(event, option)}
          >
            <span className="prism-listbox__check" aria-hidden="true">✓</span>
            <span className="prism-listbox__copy"><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
            {option.meta && <span className="prism-listbox__meta">{option.meta}</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

export type MenuItem = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  shortcut?: readonly string[];
  disabled?: boolean;
  tone?: "default" | "danger";
  separatorBefore?: boolean;
};

export type MenuProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  items: readonly MenuItem[];
  onAction: (id: string, item: MenuItem) => void;
  onClose?: () => void;
  label?: string;
};

export function KeyboardShortcut({ keys, label }: { keys: readonly string[]; label?: string }) {
  return <span className="prism-keyboard-shortcut" aria-label={label ?? keys.join(" plus ")}>{keys.map((key) => <kbd key={key}>{key}</kbd>)}</span>;
}

/** An action menu with roving focus; use inside an already positioned popover or sheet. */
export function Menu({ items, onAction, onClose, label = "Actions", className, ...props }: MenuProps) {
  const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items]);
  const [focusedId, setFocusedId] = useState<string | undefined>(enabledItems[0]?.id);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (!enabledItems.some((item) => item.id === focusedId)) setFocusedId(enabledItems[0]?.id);
  }, [enabledItems, focusedId]);

  const moveFocus = (from: string, movement: "next" | "previous" | "first" | "last") => {
    if (enabledItems.length === 0) return;
    const currentIndex = Math.max(0, enabledItems.findIndex((item) => item.id === from));
    const index = movement === "first" ? 0 : movement === "last" ? enabledItems.length - 1 : movement === "next"
      ? (currentIndex + 1) % enabledItems.length
      : (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    const next = enabledItems[index].id;
    setFocusedId(next);
    itemRefs.current.get(next)?.focus();
  };

  const onItemKeyDown = (event: KeyboardEvent<HTMLButtonElement>, item: MenuItem) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(item.id, "next");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(item.id, "previous");
    } else if (event.key === "Home") {
      event.preventDefault();
      moveFocus(item.id, "first");
    } else if (event.key === "End") {
      event.preventDefault();
      moveFocus(item.id, "last");
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose?.();
    }
  };

  return (
    <div {...props} className={cn("prism-menu", className)} role="menu" aria-label={label}>
      {items.map((item) => (
        <div key={item.id}>
          {item.separatorBefore && <div className="prism-menu__separator" role="separator" />}
          <button
            ref={(element) => {
              if (element) itemRefs.current.set(item.id, element);
              else itemRefs.current.delete(item.id);
            }}
            className="prism-menu__item"
            type="button"
            role="menuitem"
            data-tone={item.tone ?? "default"}
            tabIndex={focusedId === item.id ? 0 : -1}
            disabled={item.disabled}
            onFocus={() => setFocusedId(item.id)}
            onKeyDown={(event) => onItemKeyDown(event, item)}
            onClick={() => onAction(item.id, item)}
          >
            {item.leading && <span className="prism-menu__leading" aria-hidden="true">{item.leading}</span>}
            <span className="prism-menu__copy"><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>
            {item.shortcut && <KeyboardShortcut keys={item.shortcut} />}
          </button>
        </div>
      ))}
    </div>
  );
}

export type CommandMenuItem = {
  id: string;
  label: string;
  description?: string;
  keywords?: readonly string[];
  group?: string;
  shortcut?: readonly string[];
  leading?: ReactNode;
  disabled?: boolean;
};

export type CommandMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string, command: CommandMenuItem) => void;
  commands: readonly CommandMenuItem[];
  label?: string;
  placeholder?: string;
  emptyMessage?: ReactNode;
  className?: string;
};

/** A controlled command palette using the combobox + listbox pattern. */
export function CommandMenu({
  open,
  onOpenChange,
  onSelect,
  commands,
  label = "Command menu",
  placeholder = "Type a command…",
  emptyMessage = "No commands found.",
  className,
}: CommandMenuProps) {
  const generatedId = useId();
  const listId = `${generatedId}-commands`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const visibleCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return commands;
    return commands.filter((command) => [command.label, command.description ?? "", ...(command.keywords ?? [])]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery));
  }, [commands, query]);
  const enabledCommands = useMemo(() => visibleCommands.filter((command) => !command.disabled), [visibleCommands]);
  const [activeId, setActiveId] = useState<string | undefined>(enabledCommands[0]?.id);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      setQuery("");
      setActiveId(undefined);
    }
  }, [open]);

  useEffect(() => {
    setActiveId((current) => enabledCommands.some((command) => command.id === current) ? current : enabledCommands[0]?.id);
  }, [enabledCommands]);

  if (!open) return null;

  const moveActive = (movement: "next" | "previous" | "first" | "last") => {
    if (enabledCommands.length === 0) return;
    const currentIndex = Math.max(0, enabledCommands.findIndex((command) => command.id === activeId));
    const index = movement === "first" ? 0 : movement === "last" ? enabledCommands.length - 1 : movement === "next"
      ? (currentIndex + 1) % enabledCommands.length
      : (currentIndex - 1 + enabledCommands.length) % enabledCommands.length;
    setActiveId(enabledCommands[index].id);
  };

  const choose = (command: CommandMenuItem | undefined) => {
    if (!command || command.disabled) return;
    onSelect(command.id, command);
    onOpenChange(false);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive("next");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive("previous");
    } else if (event.key === "Home") {
      event.preventDefault();
      moveActive("first");
    } else if (event.key === "End") {
      event.preventDefault();
      moveActive("last");
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(enabledCommands.find((command) => command.id === activeId));
    } else if (event.key === "Escape") {
      event.preventDefault();
      onOpenChange(false);
    }
  };

  const groups = visibleCommands.reduce<Array<{ name: string; commands: CommandMenuItem[] }>>((all, command) => {
    const name = command.group ?? "Commands";
    const group = all.find((candidate) => candidate.name === name);
    if (group) group.commands.push(command);
    else all.push({ name, commands: [command] });
    return all;
  }, []);

  return (
    <div className="prism-command-menu__backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) onOpenChange(false); }}>
      <section className={cn("prism-command-menu", className)} role="dialog" aria-modal="true" aria-label={label}>
        <div className="prism-command-menu__input-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            value={query}
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded="true"
            aria-activedescendant={activeId ? `${listId}-${activeId}` : undefined}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
          />
          <button type="button" className="prism-command-menu__close" onClick={() => onOpenChange(false)} aria-label="Close command menu">×</button>
        </div>
        <div className="prism-command-menu__results" id={listId} role="listbox" aria-label="Command results">
          {groups.length === 0 ? <p className="prism-command-menu__empty">{emptyMessage}</p> : groups.map((group) => (
            <section key={group.name} role="group" aria-label={group.name} className="prism-command-menu__group">
              <h3>{group.name}</h3>
              {group.commands.map((command) => (
                <button
                  key={command.id}
                  id={`${listId}-${command.id}`}
                  className="prism-command-menu__option"
                  type="button"
                  role="option"
                  aria-selected={activeId === command.id}
                  disabled={command.disabled}
                  onMouseEnter={() => !command.disabled && setActiveId(command.id)}
                  onClick={() => choose(command)}
                >
                  {command.leading && <span className="prism-command-menu__leading" aria-hidden="true">{command.leading}</span>}
                  <span className="prism-command-menu__copy"><strong>{command.label}</strong>{command.description && <small>{command.description}</small>}</span>
                  {command.shortcut && <KeyboardShortcut keys={command.shortcut} />}
                </button>
              ))}
            </section>
          ))}
        </div>
        <footer className="prism-command-menu__footer"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> select</span><span><kbd>esc</kbd> close</span></footer>
      </section>
    </div>
  );
}

export type PaginationNavigatorProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  label?: string;
  showEdgeControls?: boolean;
  disabled?: boolean;
};

export type PaginationRangeItem = number | "start-ellipsis" | "end-ellipsis";

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

/** Builds a compact, stable page range with distinct ellipses for assistive labels. */
export function getPaginationRange(
  page: number,
  totalPages: number,
  siblingCount = 1,
  boundaryCount = 1,
): PaginationRangeItem[] {
  const count = Math.max(1, Math.floor(totalPages));
  const current = Math.min(Math.max(1, Math.floor(page)), count);
  const siblings = Math.max(0, Math.floor(siblingCount));
  const boundaries = Math.max(0, Math.floor(boundaryCount));
  const visibleCount = boundaries * 2 + siblings * 2 + 3;
  if (count <= visibleCount) return range(1, count);

  const startPages = range(1, boundaries);
  const endPages = range(count - boundaries + 1, count);
  const siblingsStart = Math.max(Math.min(current - siblings, count - boundaries - siblings * 2 - 1), boundaries + 2);
  const siblingsEnd = Math.min(Math.max(current + siblings, boundaries + siblings * 2 + 2), count - boundaries - 1);
  const middleStart = siblingsStart > boundaries + 2 ? ["start-ellipsis" as const] : range(boundaries + 1, siblingsStart - 1);
  const middleEnd = siblingsEnd < count - boundaries - 1 ? ["end-ellipsis" as const] : range(siblingsEnd + 1, count - boundaries);
  return [...startPages, ...middleStart, ...range(siblingsStart, siblingsEnd), ...middleEnd, ...endPages];
}

/** A fuller page navigator than the compact atomic Pagination, including edge controls and ellipsis labels. */
export function PaginationNavigator({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  label = "Pagination",
  showEdgeControls = true,
  disabled = false,
  className,
  ...props
}: PaginationNavigatorProps) {
  const count = Math.max(1, Math.floor(totalPages));
  const current = Math.min(Math.max(1, Math.floor(page)), count);
  const items = getPaginationRange(current, count, siblingCount, boundaryCount);
  const changePage = (next: number) => onPageChange(Math.min(Math.max(1, next), count));
  return (
    <nav {...props} className={cn("prism-pagination-navigator", className)} aria-label={label}>
      {showEdgeControls && <button type="button" aria-label="First page" disabled={disabled || current === 1} onClick={() => changePage(1)}>⇤</button>}
      <button type="button" aria-label="Previous page" disabled={disabled || current === 1} onClick={() => changePage(current - 1)}>←</button>
      <ol>
        {items.map((item, index) => typeof item === "number" ? (
          <li key={item}><button type="button" aria-label={`Page ${item}`} aria-current={item === current ? "page" : undefined} disabled={disabled} onClick={() => changePage(item)}>{item}</button></li>
        ) : (
          <li key={`${item}-${index}`}><span aria-hidden="true">…</span><span className="prism-visually-hidden">More pages</span></li>
        ))}
      </ol>
      <button type="button" aria-label="Next page" disabled={disabled || current === count} onClick={() => changePage(current + 1)}>→</button>
      {showEdgeControls && <button type="button" aria-label="Last page" disabled={disabled || current === count} onClick={() => changePage(count)}>⇥</button>}
    </nav>
  );
}
