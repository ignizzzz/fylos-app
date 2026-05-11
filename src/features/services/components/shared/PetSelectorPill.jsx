import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, PawPrint, Check } from 'lucide-react';

// Pet selector — compact pill that expands inline into a stacked dropdown
// of pet pills (same shape, same width). Tap on any pet selects + collapses.
// Single-pet → renders nothing (section headers carry context).

export default function PetSelectorPill({
  pets = [],
  selectedPetId,
  onSelect,
  showAll = false,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Close when tapping outside
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
    };
  }, [open]);

  if (!pets.length) return null;

  const items = showAll
    ? [{ id: 'all', name: 'All pets', avatar: null }, ...pets]
    : pets;

  if (items.length <= 1) return null;

  const idx = Math.max(0, items.findIndex((p) => p.id === selectedPetId));
  const selected = items[idx] || items[0];

  const renderAvatar = (pet, size = 28) => {
    const isAll = pet.id === 'all';
    if (pet.avatar) {
      return (
        <img
          src={pet.avatar}
          alt={pet.name}
          className="rounded-full object-cover bg-[#F2F2F7] shrink-0"
          style={{ width: size, height: size }}
        />
      );
    }
    if (isAll) {
      return (
        <span
          className="rounded-full flex items-center justify-center shrink-0"
          style={{ width: size, height: size, backgroundColor: '#FFEDE3' }}
        >
          <PawPrint size={Math.round(size * 0.46)} className="text-[#E85D2A]" strokeWidth={2.2} />
        </span>
      );
    }
    return (
      <span
        className="rounded-full flex items-center justify-center font-bold shrink-0"
        style={{
          width: size,
          height: size,
          backgroundColor: '#FFEDE3',
          color: '#E85D2A',
          fontSize: Math.round(size * 0.4),
        }}
      >
        {pet.name.charAt(0).toUpperCase()}
      </span>
    );
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={wrapRef}
      style={{ verticalAlign: 'top' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Pet: ${selected.name}. Tap to switch.`}
        className="inline-flex w-full items-center gap-2.5 pl-1 pr-3.5 py-1.5 bg-white active:bg-[#FAF7F2]"
        style={{
          boxShadow: open ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderTopLeftRadius: 9999,
          borderTopRightRadius: 9999,
          borderBottomLeftRadius: open ? 0 : 9999,
          borderBottomRightRadius: open ? 0 : 9999,
          borderBottomColor: open ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.06)',
          transition:
            'border-radius 220ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 220ms ease, background-color 150ms ease',
        }}
      >
        {renderAvatar(selected, 28)}
        <span className="text-[13px] font-semibold text-[#111111] leading-none">
          {selected.name}
        </span>
        <ChevronDown
          size={13}
          className={`text-[#A09A94] -ml-0.5 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          strokeWidth={2.2}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-30 bg-white overflow-hidden"
          style={{
            width: '100%',
            borderLeft: '1px solid rgba(0,0,0,0.06)',
            borderRight: '1px solid rgba(0,0,0,0.06)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            boxShadow: '0 8px 20px rgba(60,40,25,0.10)',
            animation: 'fylosFadeUp 200ms cubic-bezier(0.34, 1.2, 0.64, 1) both',
          }}
        >
          {items
            .filter((p) => p.id !== selectedPetId)
            .map((pet, i, arr) => (
              <button
                key={pet.id}
                role="option"
                aria-selected={false}
                onClick={() => {
                  onSelect && onSelect(pet.id);
                  setOpen(false);
                }}
                className="relative w-full flex items-center gap-2.5 pl-1 pr-3.5 py-1.5 text-left bg-white active:bg-[#FAF7F2] transition-colors"
              >
                {renderAvatar(pet, 28)}
                <span className="text-[13px] font-semibold leading-none flex-1 text-[#111111]">
                  {pet.name}
                </span>
                {i < arr.length - 1 && (
                  <span
                    className="absolute bottom-0 left-[44px] right-3.5 h-px"
                    style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  />
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
