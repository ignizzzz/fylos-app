import React from 'react';

// Compact pet selector pill — single horizontal scroll list.
// Shows "All" option for surfaces that aggregate (Bookings) and the user's pets.
// Lives at the top of every sub-tab so the pet context follows you.

export default function PetSelectorPill({
  pets = [],
  selectedPetId,
  onSelect,
  showAll = false,
  className = '',
}) {
  if (!pets.length) return null;

  const items = showAll
    ? [{ id: 'all', name: 'All', avatar: null }, ...pets]
    : pets;

  return (
    <div
      className={`flex gap-2 overflow-x-auto -mx-5 px-5 ${className}`}
      style={{ scrollbarWidth: 'none' }}
    >
      {items.map((pet) => {
        const isSelected = pet.id === selectedPetId;
        return (
          <button
            key={pet.id}
            onClick={() => onSelect && onSelect(pet.id)}
            className={`shrink-0 flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full transition-all duration-[180ms] active:scale-[0.97] ${
              isSelected
                ? 'bg-[#111111] text-white'
                : 'bg-white text-[#111111] border border-black/[0.05]'
            }`}
          >
            {pet.avatar ? (
              <img
                src={pet.avatar}
                alt={pet.name}
                className="w-7 h-7 rounded-full object-cover bg-[#F2F2F7]"
              />
            ) : (
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isSelected ? 'bg-white/15 text-white' : 'bg-[#F2F2F7] text-[#6E6E73]'
                }`}
              >
                {pet.name === 'All' ? '·' : pet.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="text-[13px] font-semibold pr-0.5">{pet.name}</span>
          </button>
        );
      })}
    </div>
  );
}
