import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useId,
} from "react";
import { cn } from "../lib/cn";

export type CommerceTone = "ink" | "violet" | "success" | "warning" | "danger" | "quiet";

/**
 * Formats a monetary value without coupling product surfaces to a cart provider.
 * Pass minor-unit values only after converting them to the units expected by your locale.
 */
export function formatPrice(
  amount: number,
  currency = "USD",
  locale?: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export type PriceProps = {
  amount: number;
  currency?: string;
  locale?: string;
  compareAt?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  unit?: string;
  suffix?: ReactNode;
  className?: string;
};

/** A price lock-up that announces sale context instead of relying on colour alone. */
export function Price({
  amount,
  currency = "USD",
  locale,
  compareAt,
  label = "Price",
  size = "md",
  unit,
  suffix,
  className,
}: PriceProps) {
  const isSale = typeof compareAt === "number" && compareAt > amount;
  const current = formatPrice(amount, currency, locale);
  const original = isSale ? formatPrice(compareAt, currency, locale) : undefined;

  return (
    <span
      className={cn("prism-price", `prism-price--${size}`, isSale && "prism-price--sale", className)}
      aria-label={isSale ? `${label}: ${current}, reduced from ${original}` : `${label}: ${current}`}
    >
      <data className="prism-price__current" value={String(amount)}>{current}</data>
      {original && <del className="prism-price__compare">{original}</del>}
      {unit && <span className="prism-price__unit">{unit}</span>}
      {suffix && <span className="prism-price__suffix">{suffix}</span>}
      {isSale && <span className="prism-visually-hidden">Sale price</span>}
    </span>
  );
}

export type ProductCardProps = {
  name: string;
  price: number;
  currency?: string;
  locale?: string;
  compareAt?: number;
  image?: { src: string; alt: string };
  href?: string;
  eyebrow?: string;
  badge?: string;
  rating?: { value: number; count?: number };
  availability?: "in-stock" | "low-stock" | "sold-out" | "preorder";
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  className?: string;
};

/**
 * A deliberately editorial commerce card. It is presentation-only: checkout and
 * cart state stay in the consuming product application.
 */
export function ProductCard({
  name,
  price,
  currency,
  locale,
  compareAt,
  image,
  href,
  eyebrow,
  badge,
  rating,
  availability,
  actionLabel = "Add to bag",
  onAction,
  actionDisabled,
  className,
}: ProductCardProps) {
  const body = (
    <>
      <div className={cn("prism-product-card__media", !image && "prism-product-card__media--placeholder")}>
        {image ? <img src={image.src} alt={image.alt} loading="lazy" /> : <span aria-hidden="true">✦</span>}
        {badge && <span className="prism-product-card__badge">{badge}</span>}
        {availability === "sold-out" && <span className="prism-product-card__veil">Edition closed</span>}
      </div>
      <div className="prism-product-card__body">
        <div className="prism-product-card__meta">
          {eyebrow && <span>{eyebrow}</span>}
          {rating && <Rating value={rating.value} count={rating.count} size="sm" />}
        </div>
        <h3>{name}</h3>
        <div className="prism-product-card__price-row">
          <Price amount={price} currency={currency} locale={locale} compareAt={compareAt} size="sm" />
          {availability && <StockIndicator availability={availability} compact />}
        </div>
      </div>
    </>
  );

  return (
    <article className={cn("prism-product-card", availability === "sold-out" && "is-unavailable", className)}>
      {href ? <a className="prism-product-card__link" href={href} aria-label={`View ${name}`}>{body}</a> : body}
      {onAction && (
        <button
          className="prism-product-card__action"
          type="button"
          onClick={onAction}
          disabled={actionDisabled || availability === "sold-out"}
        >
          <span>{availability === "sold-out" ? "Sold out" : actionLabel}</span><span aria-hidden="true">↗</span>
        </button>
      )}
    </article>
  );
}

export type VariantOption = {
  value: string;
  label: string;
  swatch?: string;
  description?: string;
  disabled?: boolean;
  inventoryLabel?: string;
};

export type VariantPickerProps = {
  label: string;
  value: string;
  options: readonly VariantOption[];
  onChange: (value: string) => void;
  display?: "pills" | "swatches";
  hint?: string;
  className?: string;
};

/** A real radio group, dressed as tactile sampling chips rather than generic pills. */
export function VariantPicker({
  label,
  value,
  options,
  onChange,
  display = "pills",
  hint,
  className,
}: VariantPickerProps) {
  const groupId = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <fieldset className={cn("prism-variant-picker", `prism-variant-picker--${display}`, className)}>
      <legend>
        <span>{label}</span>
        {selected && <b>{selected.label}</b>}
      </legend>
      {hint && <p className="prism-variant-picker__hint">{hint}</p>}
      <div className="prism-variant-picker__options">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const selectedOption = option.value === value;
          return (
            <label
              key={option.value}
              className={cn("prism-variant-picker__option", selectedOption && "is-selected", option.disabled && "is-disabled")}
              htmlFor={optionId}
              title={option.description}
            >
              <input
                id={optionId}
                name={groupId}
                type="radio"
                value={option.value}
                checked={selectedOption}
                disabled={option.disabled}
                onChange={() => onChange(option.value)}
              />
              {display === "swatches" && <i style={{ background: option.swatch }} aria-hidden="true" />}
              <span>{option.label}</span>
              {option.inventoryLabel && <small>{option.inventoryLabel}</small>}
              {option.disabled && <em className="prism-visually-hidden">Unavailable</em>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
};

/** A bounded, keyboard-native stepper for carts and allocation flows. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  label = "Quantity",
  disabled = false,
  className,
}: QuantityStepperProps) {
  const inputId = useId();
  const safeValue = Math.min(max, Math.max(min, value));
  const decrement = () => onChange(Math.max(min, safeValue - step));
  const increment = () => onChange(Math.min(max, safeValue + step));
  const handleInput = (rawValue: string) => {
    const next = Number(rawValue);
    if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)));
  };

  return (
    <div className={cn("prism-quantity-stepper", disabled && "is-disabled", className)}>
      <label htmlFor={inputId}>{label}</label>
      <div className="prism-quantity-stepper__controls">
        <button type="button" aria-label={`Decrease ${label}`} onClick={decrement} disabled={disabled || safeValue <= min}>−</button>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={safeValue}
          disabled={disabled}
          onChange={(event) => handleInput(event.target.value)}
        />
        <button type="button" aria-label={`Increase ${label}`} onClick={increment} disabled={disabled || safeValue >= max}>+</button>
      </div>
    </div>
  );
}

export type StockIndicatorProps = {
  availability: "in-stock" | "low-stock" | "sold-out" | "preorder";
  quantity?: number;
  compact?: boolean;
  className?: string;
};

const stockCopy: Record<StockIndicatorProps["availability"], string> = {
  "in-stock": "Ready to dispatch",
  "low-stock": "A small run remains",
  "sold-out": "Currently unavailable",
  preorder: "Reserve this edition",
};

export function StockIndicator({ availability, quantity, compact = false, className }: StockIndicatorProps) {
  const quantityCopy = availability === "low-stock" && typeof quantity === "number" ? `${quantity} left` : stockCopy[availability];
  return (
    <span className={cn("prism-stock", `prism-stock--${availability}`, compact && "prism-stock--compact", className)}>
      <i aria-hidden="true" />
      <span>{quantityCopy}</span>
    </span>
  );
}

export type ShippingPromiseProps = {
  title?: string;
  detail: string;
  icon?: ReactNode;
  className?: string;
};

export function ShippingPromise({ title = "Delivery note", detail, icon = "↗", className }: ShippingPromiseProps) {
  return (
    <aside className={cn("prism-shipping-promise", className)}>
      <span aria-hidden="true">{icon}</span>
      <p><b>{title}</b>{detail}</p>
    </aside>
  );
}

export type CartLineItemProps = {
  name: string;
  image?: { src: string; alt: string };
  detail?: string;
  price: number;
  currency?: string;
  locale?: string;
  compareAt?: number;
  quantity: QuantityStepperProps;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
};

export function CartLineItem({
  name,
  image,
  detail,
  price,
  currency,
  locale,
  compareAt,
  quantity,
  onRemove,
  removeLabel = "Remove item",
  className,
}: CartLineItemProps) {
  return (
    <article className={cn("prism-cart-line", className)}>
      <div className={cn("prism-cart-line__image", !image && "prism-cart-line__image--placeholder")}>
        {image ? <img src={image.src} alt={image.alt} /> : <span aria-hidden="true">✦</span>}
      </div>
      <div className="prism-cart-line__content">
        <div className="prism-cart-line__topline">
          <div><h3>{name}</h3>{detail && <p>{detail}</p>}</div>
          <Price amount={price} currency={currency} locale={locale} compareAt={compareAt} size="sm" />
        </div>
        <div className="prism-cart-line__actions">
          <QuantityStepper {...quantity} label={quantity.label ?? `Quantity for ${name}`} />
          {onRemove && <button type="button" onClick={onRemove}>{removeLabel}</button>}
        </div>
      </div>
    </article>
  );
}

export type OrderSummaryItem = {
  label: string;
  value: ReactNode;
  emphasis?: "normal" | "discount" | "total";
};

export type OrderSummaryProps = {
  title?: string;
  items: readonly OrderSummaryItem[];
  children?: ReactNode;
  className?: string;
};

export function OrderSummary({ title = "Order note", items, children, className }: OrderSummaryProps) {
  return (
    <section className={cn("prism-order-summary", className)} aria-label={title}>
      <h2>{title}</h2>
      <dl>
        {items.map((item) => <div key={item.label} className={item.emphasis ? `is-${item.emphasis}` : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
      </dl>
      {children && <div className="prism-order-summary__footer">{children}</div>}
    </section>
  );
}

export type NoticeProps = {
  tone?: CommerceTone;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
};

const noticeMark: Record<CommerceTone, string> = {
  ink: "✦",
  violet: "✦",
  success: "✓",
  warning: "!",
  danger: "×",
  quiet: "i",
};

/** Flexible announcement surface with a polite live region for dynamic feedback. */
export function Notice({
  tone = "violet",
  title,
  children,
  action,
  onDismiss,
  dismissLabel = "Dismiss notice",
  className,
}: NoticeProps) {
  const assertive = tone === "danger" || tone === "warning";
  return (
    <section
      className={cn("prism-notice", `prism-notice--${tone}`, className)}
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
    >
      <span className="prism-notice__mark" aria-hidden="true">{noticeMark[tone]}</span>
      <div className="prism-notice__copy"><strong>{title}</strong>{children && <div>{children}</div>}</div>
      {action && <div className="prism-notice__action">{action}</div>}
      {onDismiss && <button className="prism-notice__dismiss" type="button" onClick={onDismiss} aria-label={dismissLabel}>×</button>}
    </section>
  );
}

export type ActivityItemData = {
  id: string;
  title: ReactNode;
  detail?: ReactNode;
  time: string;
  dateTime?: string;
  tone?: "violet" | "success" | "warning" | "danger" | "quiet";
  icon?: ReactNode;
};

export type ActivityItemProps = ActivityItemData & { className?: string };

export function ActivityItem({ title, detail, time, dateTime, tone = "violet", icon, className }: ActivityItemProps) {
  return (
    <li className={cn("prism-activity-item", `prism-activity-item--${tone}`, className)}>
      <span className="prism-activity-item__mark" aria-hidden="true">{icon ?? "✦"}</span>
      <div className="prism-activity-item__copy"><strong>{title}</strong>{detail && <p>{detail}</p>}</div>
      <time dateTime={dateTime}>{time}</time>
    </li>
  );
}

export type ActivityTimelineProps = {
  items: readonly ActivityItemData[];
  label?: string;
  className?: string;
};

export function ActivityTimeline({ items, label = "Recent activity", className }: ActivityTimelineProps) {
  return <ol className={cn("prism-activity-timeline", className)} aria-label={label}>{items.map((item) => <ActivityItem key={item.id} {...item} />)}</ol>;
}

export type RatingProps = {
  value: number;
  count?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
};

/** Read-only rating with an explicit textual value for assistive technology. */
export function Rating({ value, count, max = 5, size = "md", label = "Rating", className }: RatingProps) {
  const safeValue = Math.max(0, Math.min(max, value));
  const rounded = Math.round(safeValue * 2) / 2;
  return (
    <span className={cn("prism-rating", `prism-rating--${size}`, className)} aria-label={`${label}: ${rounded} out of ${max}${count !== undefined ? ` from ${count} reviews` : ""}`}>
      <span className="prism-rating__stars" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => {
          const fill = Math.max(0, Math.min(1, safeValue - index));
          return <i key={index} style={{ "--prism-rating-fill": `${fill * 100}%` } as React.CSSProperties}>★</i>;
        })}
      </span>
      <b>{rounded.toFixed(1)}</b>
      {count !== undefined && <span className="prism-rating__count">({count})</span>}
    </span>
  );
}

export type ReviewCardProps = {
  author: string;
  date: string;
  dateTime?: string;
  rating: number;
  title?: string;
  children: ReactNode;
  verified?: boolean;
  product?: string;
  response?: { by?: string; children: ReactNode };
  className?: string;
};

export function ReviewCard({ author, date, dateTime, rating, title, children, verified, product, response, className }: ReviewCardProps) {
  return (
    <article className={cn("prism-review-card", className)}>
      <header>
        <div className="prism-review-card__identity"><span aria-hidden="true">{author.slice(0, 1).toUpperCase()}</span><div><b>{author}</b>{verified && <small>Verified collector</small>}</div></div>
        <time dateTime={dateTime}>{date}</time>
      </header>
      <Rating value={rating} size="sm" />
      {title && <h3>{title}</h3>}
      <div className="prism-review-card__body">{children}</div>
      {product && <footer>On <b>{product}</b></footer>}
      {response && <aside><b>{response.by ?? "Varn"}</b><div>{response.children}</div></aside>}
    </article>
  );
}

export type FeedbackPromptProps = {
  value?: number;
  onChange: (value: number) => void;
  label?: string;
  max?: number;
  description?: string;
  disabled?: boolean;
  className?: string;
};

/** Interactive score capture that preserves native radio semantics. */
export function FeedbackPrompt({
  value,
  onChange,
  label = "How was that?",
  max = 5,
  description,
  disabled = false,
  className,
}: FeedbackPromptProps) {
  const id = useId();
  return (
    <fieldset className={cn("prism-feedback-prompt", className)} disabled={disabled}>
      <legend>{label}</legend>
      {description && <p>{description}</p>}
      <div className="prism-feedback-prompt__options">
        {Array.from({ length: max }, (_, index) => {
          const score = index + 1;
          return (
            <label key={score} className={score <= (value ?? 0) ? "is-selected" : undefined}>
              <input id={`${id}-${score}`} name={id} type="radio" value={score} checked={value === score} onChange={() => onChange(score)} />
              <span aria-hidden="true">★</span>
              <span className="prism-visually-hidden">{score} out of {max}</span>
            </label>
          );
        })}
      </div>
      {value !== undefined && <output className="prism-feedback-prompt__output">{value} / {max}</output>}
    </fieldset>
  );
}

export type InlineFeedbackProps = {
  tone?: "success" | "warning" | "danger" | "info";
  children: ReactNode;
  className?: string;
};

export function InlineFeedback({ tone = "info", children, className }: InlineFeedbackProps) {
  const icon = tone === "success" ? "✓" : tone === "warning" ? "!" : tone === "danger" ? "×" : "i";
  return <p className={cn("prism-inline-feedback", `prism-inline-feedback--${tone}`, className)}><i aria-hidden="true">{icon}</i>{children}</p>;
}

export type CommerceActionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "ink" | "violet" | "quiet";
  loading?: boolean;
  children: ReactNode;
};

/** A terse purchase action for product pages and mini carts. */
export function CommerceAction({ tone = "ink", loading = false, disabled, className, children, ...props }: CommerceActionProps) {
  return (
    <button {...props} type={props.type ?? "button"} className={cn("prism-commerce-action", `prism-commerce-action--${tone}`, className)} disabled={disabled || loading} aria-busy={loading || undefined}>
      <span>{loading ? "Working…" : children}</span><span aria-hidden="true">{loading ? "◌" : "↗"}</span>
    </button>
  );
}
