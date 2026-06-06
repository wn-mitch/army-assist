/**
 * The canonical button treatment (see DESIGN.md "Buttons").
 *
 * - standard:   neutral action, modal dismissal
 * - accent:     the primary action of a surface (at most one per view)
 * - danger:     destructive action; always a quiet tint, never solid red
 * - ghost-icon: toolbar / inline icon button; the icon child carries its
 *               own size (e.g. `h-8 w-8`)
 *
 * Most call sites should use the <Button> component. `buttonClasses()` exists
 * for elements that can't be a <button> of their own (HeadlessUI Menu.Item
 * render props, links styled as buttons).
 */
import clsx from "clsx";

export type ButtonVariant = "standard" | "accent" | "danger" | "ghost-icon";
export type ButtonSize = "sm" | "md";

const FOCUS_DISABLED =
  "focus:outline-none focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none";

const BASE = `rounded font-medium transition-colors ${FOCUS_DISABLED}`;

const SIZE: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-sm", // full-width modal CTAs
};

const VARIANT: Record<Exclude<ButtonVariant, "ghost-icon">, string> = {
  standard: "text-text bg-panel hover:bg-panel-hover",
  accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
  danger: "text-danger bg-danger/5 hover:bg-danger/15",
};

// Sizing comes from the icon child plus `p-2`, so `size` does not apply.
const GHOST_ICON =
  "rounded p-2 text-text-muted hover:bg-panel-hover hover:text-text " +
  `transition-colors ${FOCUS_DISABLED}`;

export function buttonClasses(
  variant: ButtonVariant = "standard",
  size: ButtonSize = "sm",
  extra?: string,
): string {
  if (variant === "ghost-icon") return clsx(GHOST_ICON, extra);
  return clsx(BASE, SIZE[size], VARIANT[variant], extra);
}
