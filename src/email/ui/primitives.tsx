import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Tone } from '../core/catalog'
import { C, HAIRLINE, RADIUS, SHADOW, TONES } from './tokens'

// ── Badge / status pill ──────────────────────────────────────────────────────

export function Badge({
  tone,
  children,
  live = false,
}: {
  tone: Tone
  children: ReactNode
  live?: boolean
}) {
  const t = TONES[tone]
  return (
    <span
      className="inline-flex items-center gap-1 h-[22px] px-2.5 rounded-full text-[11px] font-semibold border whitespace-nowrap"
      style={{ color: t.fg, background: t.bg, borderColor: t.bd }}
    >
      {live && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: t.fg, animation: 'emailPulse 1.4s ease-in-out infinite' }}
        />
      )}
      {children}
    </span>
  )
}

// ── Section label (warm uppercase) ───────────────────────────────────────────

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-[10.5px] font-bold uppercase tracking-[0.12em]"
      style={{ color: C.sectionLabel }}
    >
      {children}
    </div>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children,
  radius = 'grouped',
  className = '',
  padded = true,
  style,
}: {
  children: ReactNode
  radius?: keyof typeof RADIUS
  className?: string
  padded?: boolean
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`${padded ? 'p-5' : ''} ${className}`}
      style={{
        background: C.surface,
        borderRadius: RADIUS[radius],
        border: `1px solid ${HAIRLINE}`,
        boxShadow: SHADOW.card,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'md' | 'sm'

const BTN_BASE =
  'inline-flex items-center justify-center gap-2 font-semibold tracking-[0.01em] active:scale-[0.98] transition-transform select-none'
const BTN_SIZES: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-[14.5px]',
  sm: 'h-9 px-3.5 text-[13px]',
}

// Single source of truth for button visuals, shared by <Button> and <ButtonLink>.
function buttonStyle(variant: ButtonVariant, disabled: boolean): React.CSSProperties {
  const base: React.CSSProperties = { borderRadius: RADIUS.button }
  if (disabled) return { ...base, background: C.disabledBg, color: C.disabledInk, boxShadow: 'none' }
  if (variant === 'primary')
    return {
      ...base,
      background: C.coral,
      color: '#FFFFFF',
      boxShadow: `${SHADOW.coral}, inset 0 1px 0 rgba(255,255,255,0.2)`,
    }
  if (variant === 'secondary')
    return { ...base, background: C.surface, color: C.ink, border: `1px solid ${C.hair}`, boxShadow: SHADOW.soft }
  if (variant === 'ghost') return { ...base, background: C.chip, color: C.ink }
  return { ...base, background: TONES.red.bg, color: TONES.red.fg, border: `1px solid ${TONES.red.bd}` }
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  leadIcon?: ReactNode
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  full = false,
  leadIcon,
  children,
  disabled = false,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${BTN_BASE} ${BTN_SIZES[size]} ${full ? 'w-full' : ''} ${
        disabled ? 'cursor-not-allowed' : ''
      } ${className}`}
      style={buttonStyle(variant, disabled)}
      disabled={disabled}
      {...rest}
    >
      {leadIcon}
      {children}
    </button>
  )
}

/**
 * A react-router link that looks like a Button. Use this for navigation CTAs so
 * we render a single <a> (never a <button> nested inside an <a>, which is
 * invalid and gives two focus stops).
 */
export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  full = false,
  leadIcon,
  children,
}: {
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  leadIcon?: ReactNode
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      className={`${BTN_BASE} ${BTN_SIZES[size]} ${full ? 'w-full' : ''}`}
      style={buttonStyle(variant, false)}
    >
      {leadIcon}
      {children}
    </Link>
  )
}

// ── Fields ───────────────────────────────────────────────────────────────────

const fieldShell: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: RADIUS.input,
  boxShadow: SHADOW.soft,
  color: C.ink,
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[12px] font-semibold mb-1.5" style={{ color: C.ink2 }}>
      {children}
    </label>
  )
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p className="mt-1.5 text-[12px] font-medium" style={{ color: TONES.red.fg }}>
      {children}
    </p>
  )
}

export function FieldHelp({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p className="mt-1.5 text-[12px]" style={{ color: C.ink3 }}>
      {children}
    </p>
  )
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  ...rest
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'id'>) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 px-3.5 text-[15px] outline-none focus:border-[#E85D2A]"
      style={fieldShell}
      {...rest}
    />
  )
}

export function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 6,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      id={id}
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-3 text-[14px] leading-[1.6] outline-none focus:border-[#E85D2A] resize-y"
      style={fieldShell}
    />
  )
}

export function Select({
  id,
  value,
  onChange,
  options,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 px-3 text-[15px] outline-none focus:border-[#E85D2A]"
      style={fieldShell}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

// ── Toggle switch ────────────────────────────────────────────────────────────

export function Toggle({
  checked,
  onChange,
  label,
  ariaLabel,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label?: ReactNode
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className="relative w-[46px] h-[26px] rounded-full transition-colors shrink-0"
      style={{ background: checked ? C.coral : C.chip }}
    >
      <span
        className="absolute top-[3px] w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: checked ? 23 : 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
      />
      {label}
    </button>
  )
}

// ── Stat tile ────────────────────────────────────────────────────────────────

export function Stat({
  value,
  label,
  sub,
}: {
  value: ReactNode
  label: ReactNode
  sub?: ReactNode
}) {
  return (
    <div>
      <div className="email-num text-[27px] leading-none" style={{ color: C.ink, fontWeight: 500 }}>
        {value}
      </div>
      <div className="mt-2 text-[10.5px] font-bold uppercase tracking-[0.11em]" style={{ color: C.sectionLabel }}>
        {label}
      </div>
      {sub && (
        <div className="mt-1 text-[12px]" style={{ color: C.ink3 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

// ── Simple key/value row ─────────────────────────────────────────────────────

/** A single bordered stat cell, used inside stat grids. */
export function StatCell({
  value,
  label,
  sub,
}: {
  value: ReactNode
  label: ReactNode
  sub?: ReactNode
}) {
  return (
    <div className="border-l pl-3.5" style={{ borderColor: HAIRLINE }}>
      <Stat value={value} label={label} sub={sub} />
    </div>
  )
}

export function KeyValue({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-[13px]" style={{ color: C.ink2 }}>
        {label}
      </span>
      <span className="text-[13px] font-semibold text-right" style={{ color: C.ink }}>
        {children}
      </span>
    </div>
  )
}

export function Divider() {
  return <div className="h-px w-full" style={{ background: HAIRLINE }} />
}
