// Overlays: dropdown Menu, right-side Drawer, centered Modal, ConfirmDialog.
// Close on Escape and on outside click. No animation library needed.

import { useEffect, useRef, useState, useCallback, useId } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { X, Check } from 'lucide-react';
import { tokens, shadows, radii } from '../../theme';
import { Button, IconButton } from './primitives';

function useEscape(active: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, onClose]);
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/** Focus into a dialog on open, trap Tab within it, restore focus on close. */
function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () =>
      node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null) : [];
    (focusables()[0] ?? node)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !node) return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    node?.addEventListener('keydown', onKey);
    return () => {
      node?.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [active]);
  return ref;
}

// ── Menu ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  checked?: boolean;
}

export function Menu({ trigger, items, align = 'right', width = 200 }: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  items: Array<MenuItem | 'separator'>;
  align?: 'left' | 'right';
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  useEscape(open, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      {trigger({ open, toggle })}
      {open && (
        <div
          role="menu"
          className="absolute z-50 mt-1 py-1"
          style={{
            [align]: 0,
            width,
            background: tokens.surface,
            border: `1px solid ${tokens.border}`,
            borderRadius: radii.md,
            boxShadow: shadows.pop,
          } as CSSProperties}
        >
          {items.map((item, i) =>
            item === 'separator' ? (
              <div key={`sep-${i}`} className="my-1 h-px" style={{ background: tokens.divider }} />
            ) : (
              <button
                key={item.label}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  setOpen(false);
                  item.onClick?.();
                }}
                className="w-full flex items-center gap-2 px-3 h-8 text-[13px] text-left transition-colors disabled:opacity-40 hover:bg-[#F6F2ED]"
                style={{ color: item.danger ? '#B23B30' : tokens.ink }}
              >
                {item.icon && <span className="shrink-0" style={{ color: item.danger ? '#B23B30' : tokens.ink3 }}>{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.checked && <Check size={14} style={{ color: tokens.coral }} />}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}

// ── Backdrop ────────────────────────────────────────────────────────────────

function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40"
      style={{ background: 'rgba(31,26,23,0.36)' }}
      onClick={onClick}
      aria-hidden
    />
  );
}

// ── Drawer ──────────────────────────────────────────────────────────────────

export function Drawer({ open, onClose, title, subtitle, children, footer, width = 520 }: {
  open: boolean; onClose: () => void; title: ReactNode; subtitle?: ReactNode;
  children: ReactNode; footer?: ReactNode; width?: number;
}) {
  useEscape(open, onClose);
  const ref = useFocusTrap<HTMLElement>(open);
  const titleId = useId();
  if (!open) return null;
  return (
    <>
      <Backdrop onClick={onClose} />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col outline-none"
        style={{ width: `min(${width}px, 100vw)`, background: tokens.surface, boxShadow: shadows.pop }}
      >
        <header className="flex items-start gap-3 px-5 py-4 border-b shrink-0" style={{ borderColor: tokens.border }}>
          <div className="flex-1 min-w-0">
            <div id={titleId} className="text-[16px] font-bold truncate" style={{ color: tokens.ink }}>{title}</div>
            {subtitle && <div className="text-[12.5px] mt-0.5 truncate" style={{ color: tokens.ink3 }}>{subtitle}</div>}
          </div>
          <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <footer className="px-5 py-3 border-t shrink-0 flex items-center justify-end gap-2" style={{ borderColor: tokens.border, background: tokens.surfaceAlt }}>
            {footer}
          </footer>
        )}
      </aside>
    </>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, subtitle, children, footer, width = 520 }: {
  open: boolean; onClose: () => void; title: ReactNode; subtitle?: ReactNode;
  children: ReactNode; footer?: ReactNode; width?: number;
}) {
  useEscape(open, onClose);
  const ref = useFocusTrap<HTMLDivElement>(open);
  const titleId = useId();
  if (!open) return null;
  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ pointerEvents: 'none' }}>
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="mt-[8vh] flex flex-col w-full outline-none"
          style={{ maxWidth: width, background: tokens.surface, borderRadius: radii.xl, boxShadow: shadows.pop, pointerEvents: 'auto' }}
        >
          <header className="flex items-start gap-3 px-5 py-4 border-b" style={{ borderColor: tokens.border }}>
            <div className="flex-1 min-w-0">
              <div id={titleId} className="text-[16px] font-bold" style={{ color: tokens.ink }}>{title}</div>
              {subtitle && <div className="text-[12.5px] mt-0.5" style={{ color: tokens.ink3 }}>{subtitle}</div>}
            </div>
            <IconButton label="Close" onClick={onClose}><X size={18} /></IconButton>
          </header>
          <div className="px-5 py-4">{children}</div>
          {footer && (
            <footer className="px-5 py-3 border-t flex items-center justify-end gap-2" style={{ borderColor: tokens.border, background: tokens.surfaceAlt, borderBottomLeftRadius: radii.xl, borderBottomRightRadius: radii.xl }}>
              {footer}
            </footer>
          )}
        </div>
      </div>
    </>
  );
}

// ── ConfirmDialog ───────────────────────────────────────────────────────────

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: ReactNode; confirmLabel?: string; danger?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={420}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-[13.5px] leading-relaxed" style={{ color: tokens.ink2 }}>{message}</p>
    </Modal>
  );
}
