// Growth Admin UI primitives. Tailwind handles layout/spacing; brand colours
// come from inline styles driven by theme tokens so they stay exact.

import { forwardRef, useId, isValidElement, cloneElement } from 'react';
import type {
  ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes,
  TextareaHTMLAttributes, ReactNode, ReactElement, CSSProperties,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { tokens, shadows, radii, toneStyles } from '../../theme';
import type { Tone } from '../../theme';

// ── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  block?: boolean;
}

const buttonBase: Record<ButtonVariant, CSSProperties> = {
  primary: { background: tokens.coral, color: '#fff', border: '1px solid transparent', boxShadow: '0 2px 10px rgba(232,93,42,0.26)' },
  secondary: { background: tokens.surface, color: tokens.ink, border: `1px solid ${tokens.borderStrong}` },
  ghost: { background: 'transparent', color: tokens.ink2, border: '1px solid transparent' },
  danger: { background: toneStyles.red.bg, color: toneStyles.red.fg, border: `1px solid ${toneStyles.red.border}` },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', icon, block, className = '', style, children, ...rest },
  ref,
) {
  const pad = size === 'sm' ? 'h-8 px-2.5 text-[13px]' : 'h-9 px-3.5 text-[13.5px]';
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-1.5 font-semibold rounded-[10px] whitespace-nowrap transition-all duration-150 hover:brightness-[1.03] active:brightness-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${pad} ${block ? 'w-full' : ''} ${className}`}
      style={{ ...buttonBase[variant], borderRadius: radii.md, ...style }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
});

// ── IconButton ──────────────────────────────────────────────────────────────

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, active, className = '', style, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-[10px] transition-colors ${className}`}
      style={{
        background: active ? tokens.coralSoft : 'transparent',
        color: active ? tokens.coral : tokens.ink2,
        border: `1px solid ${active ? tokens.coralBorder : 'transparent'}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
});

// ── Card / Panel ────────────────────────────────────────────────────────────

export function Card({ children, className = '', style, padded = true }: {
  children: ReactNode; className?: string; style?: CSSProperties; padded?: boolean;
}) {
  return (
    <div
      className={`${padded ? 'p-4' : ''} ${className}`}
      style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: radii.lg, boxShadow: shadows.card, ...style }}
    >
      {children}
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────────────────────

export function Badge({ tone = 'neutral', children, dot, className = '' }: {
  tone?: Tone; children: ReactNode; dot?: boolean; className?: string;
}) {
  const t = toneStyles[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full text-[12px] font-semibold whitespace-nowrap ${className}`}
      style={{ background: t.bg, color: t.fg, border: `1px solid ${t.border}` }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.fg }} />}
      {children}
    </span>
  );
}

// ── Avatar ──────────────────────────────────────────────────────────────────

export function Avatar({ name, color, size = 28 }: { name: string; color?: string; size?: number }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
  return (
    <span
      className="inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0"
      style={{ width: size, height: size, background: color ?? tokens.coral, fontSize: size * 0.38 }}
      title={name}
    >
      {initials}
    </span>
  );
}

// ── Field + Input + Select + Textarea ───────────────────────────────────────

const controlStyle = (invalid?: boolean): CSSProperties => ({
  backgroundColor: tokens.surface,
  border: `1px solid ${invalid ? toneStyles.red.border : tokens.borderStrong}`,
  borderRadius: radii.md,
  color: tokens.ink,
});

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className = '', style, invalid, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={`h-9 px-3 text-[13.5px] w-full outline-none focus:ring-2 focus:ring-[rgba(232,93,42,0.28)] placeholder:text-[#B3A99E] ${className}`}
        style={{ ...controlStyle(invalid), ...style }}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function Textarea({ className = '', style, invalid, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={`px-3 py-2 text-[13.5px] w-full outline-none focus:ring-2 focus:ring-[rgba(232,93,42,0.28)] placeholder:text-[#B3A99E] ${className}`}
        style={{ ...controlStyle(invalid), ...style }}
        {...rest}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(
  function Select({ className = '', style, invalid, children, ...rest }, ref) {
    // The caret is a positioned icon (not a background image) so the style
    // object never mixes background shorthand and longhand.
    return (
      <div className="relative" style={style}>
        <select
          ref={ref}
          className={`h-9 pl-3 pr-8 text-[13.5px] w-full outline-none focus:ring-2 focus:ring-[rgba(232,93,42,0.28)] appearance-none cursor-pointer ${className}`}
          style={controlStyle(invalid)}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown size={15} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tokens.ink3 }} />
      </div>
    );
  },
);

export function Field({ label, htmlFor, error, hint, required, children, className = '' }: {
  label?: string; htmlFor?: string; error?: string; hint?: string; required?: boolean; children: ReactNode; className?: string;
}) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  // Associate the label with a single control child by injecting an id when
  // the caller has not set one, so every form control has an accessible name.
  const describedById = error ? `${controlId}-error` : hint ? `${controlId}-hint` : undefined;
  const control =
    !htmlFor && isValidElement(children) && !(children as ReactElement<{ id?: string }>).props.id
      ? cloneElement(children as ReactElement<{ id?: string; 'aria-describedby'?: string }>, {
          id: controlId,
          'aria-describedby': describedById,
        })
      : children;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={controlId} className="block mb-1 text-[12px] font-semibold" style={{ color: tokens.ink2 }}>
          {label}
          {required && <span style={{ color: tokens.coral }}> *</span>}
        </label>
      )}
      {control}
      {error ? (
        <p id={describedById} className="mt-1 text-[12px]" style={{ color: toneStyles.red.fg }}>{error}</p>
      ) : hint ? (
        <p id={describedById} className="mt-1 text-[12px]" style={{ color: tokens.ink3 }}>{hint}</p>
      ) : null}
    </div>
  );
}

// ── Spinner ─────────────────────────────────────────────────────────────────

export function Spinner({ size = 16, color = tokens.coral }: { size?: number; color?: string }) {
  return (
    <span
      className="inline-block rounded-full animate-spin align-[-2px]"
      style={{ width: size, height: size, border: `2px solid ${color}33`, borderTopColor: color }}
      role="status"
      aria-label="Loading"
    />
  );
}

// ── Segmented control (tabs) ────────────────────────────────────────────────

export function Segmented<T extends string>({ value, options, onChange }: {
  value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex p-0.5 rounded-[10px]" style={{ background: tokens.surfaceAlt, border: `1px solid ${tokens.border}` }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="h-7 px-3 text-[12.5px] font-semibold rounded-[8px] transition-colors"
            style={{
              background: active ? tokens.surface : 'transparent',
              color: active ? tokens.ink : tokens.ink2,
              boxShadow: active ? shadows.sm : 'none',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
