import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// A mobile nav drawer that pushes the whole page aside instead of just
// overlaying on top of it, with a slight 3D tilt and a shaded hinge edge
// on the panel itself. All animation lives here so <PushDrawerBody> (wraps
// the rest of the page) and <PushDrawerContent> (the panel) only need to
// read the same `open` boolean to stay in sync - nothing page-specific.
const TRANSITION = "420ms cubic-bezier(0.22,1,0.36,1)";

// Mirrors the panel's own width classes below (w-3/4, max-w-sm) so the
// page push always matches the panel's rendered width, without having to
// measure the (portaled, conditionally-mounted) panel DOM node itself.
const PANEL_MAX_WIDTH_PX = 384;
function getPanelWidth() {
  return Math.min(window.innerWidth * 0.75, PANEL_MAX_WIDTH_PX);
}

// modal=false: since the "push" is the whole point (the rest of the page
// stays visible and interactive, just shifted aside, rather than being
// fully blocked by a modal overlay), Radix's modal machinery only gets in
// the way here - its Overlay refuses to render at all without it, but its
// modal variant also permanently aria-hides every sibling the first time
// it mounts (cleanup only runs on unmount, which force-mounting - needed
// below for the exit transition - would prevent from ever happening) and
// hard-codes pointer-events:auto on itself. Non-modal skips all of that;
// we build our own dismiss-on-outside-click scrim instead of Radix's.
export function PushDrawer(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root modal={false} {...props} />;
}
export const PushDrawerTrigger = DialogPrimitive.Trigger;
export const PushDrawerTitle = DialogPrimitive.Title;

type PushDrawerContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  open: boolean;
};

export function PushDrawerContent({
  open,
  className,
  style,
  children,
  ...props
}: PushDrawerContentProps) {
  return (
    <DialogPrimitive.Portal forceMount>
      {/* Our own scrim, not Radix's <Overlay> (that one no-ops when
          modal=false). Wrapping it in <Close asChild> gives free
          click-to-dismiss without threading a separate callback prop. */}
      <DialogPrimitive.Close asChild>
        <div
          aria-hidden
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity",
            open ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          style={{ transitionDuration: TRANSITION.split(" ")[0] }}
        />
      </DialogPrimitive.Close>
      <DialogPrimitive.Content
        {...props}
        forceMount
        // Force-mounted so the closing transform transition can actually
        // play (Radix otherwise unmounts Content the instant `open` goes
        // false); `inert` removes it from focus/tab order and hit-testing
        // while closed, so that doesn't silently regress.
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-3/4 max-w-sm flex-col overflow-y-auto overflow-x-hidden",
          "border-l border-brand-gold/25 bg-brand-black text-brand-gold",
          "shadow-[-32px_0_64px_-24px_rgba(0,0,0,0.75)]",
          !open && "pointer-events-none",
          className
        )}
        style={{
          ...style,
          transformOrigin: "right center",
          transform: open ? "translateX(0) rotateY(0deg)" : "translateX(100%) rotateY(20deg)",
          transition: `transform ${TRANSITION}`,
        }}
      >
        {/* Shaded hinge edge: a subtle inner shadow along the panel's left
            side, where a physical panel opening toward the viewer would
            catch the least light. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black/45 to-transparent"
        />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

type PushDrawerBodyProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
};

// Wraps the rest of the page (header + main + footer). Shifts left by
// exactly the drawer panel's width and scales down a touch, so the page
// visibly "slides aside" for the drawer rather than being covered by it.
export function PushDrawerBody({ open, children, className }: PushDrawerBodyProps) {
  const [panelWidth, setPanelWidth] = React.useState(0);

  React.useEffect(() => {
    const updateWidth = () => setPanelWidth(getPanelWidth());
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      className={cn("min-h-screen", className)}
      style={{
        transform: open ? `translateX(-${panelWidth}px) scale(0.97)` : "translateX(0) scale(1)",
        transition: `transform ${TRANSITION}`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
