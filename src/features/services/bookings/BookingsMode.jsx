import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ListFilter, Compass } from 'lucide-react';
import BookingRow from '../components/shared/BookingRow';
import EmptyServicesState from '../components/shared/EmptyState';
import SectionHeader from '../components/shared/SectionHeader';

// Bookings — Zone R (Revolut-dense). Status sub-tabs · list · calendar.

const STATUS_TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'inProgress', label: 'In progress' },
  { id: 'completed', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function BookingsMode({
  pets,
  selectedPetId,
  data,
  onOpenBooking,
  onOpenDiscover,
}) {
  const [statusTab, setStatusTab] = useState('upcoming');
  const [view, setView] = useState('list'); // 'list' | 'calendar'

  const counts = useMemo(
    () => ({
      upcoming: data.bookingsByStatus('upcoming', selectedPetId).length,
      inProgress: data.bookingsByStatus('inProgress', selectedPetId).length,
      completed: data.bookingsByStatus('completed', selectedPetId).length,
      cancelled: data.bookingsByStatus('cancelled', selectedPetId).length,
    }),
    [data, selectedPetId]
  );

  const list = useMemo(
    () =>
      data.bookingsByStatus(statusTab, selectedPetId).sort((a, b) => {
        const da = new Date(a.dateTime?.start || 0).getTime();
        const db = new Date(b.dateTime?.start || 0).getTime();
        if (statusTab === 'completed' || statusTab === 'cancelled') return db - da;
        return da - db;
      }),
    [data, statusTab, selectedPetId]
  );

  const emptyMeta = {
    upcoming: { title: 'No upcoming bookings', subtext: 'Book a walk, sit or vet visit and it shows up here.', actionLabel: 'Browse providers' },
    inProgress: { title: 'No live sessions', subtext: 'When a booking starts, you can track it from here.' },
    completed: { title: 'No past bookings', subtext: 'Completed sessions and reviews will live here.' },
    cancelled: { title: 'No cancellations', subtext: '' },
  }[statusTab];

  return (
    <div className="px-5 pb-8">
      {/* Status sub-tabs (chips, scroll-able if needed) */}
      <div
        className="flex gap-2 -mx-5 px-5 mb-4 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {STATUS_TABS.map((t) => {
          const active = statusTab === t.id;
          const c = counts[t.id];
          return (
            <button
              key={t.id}
              onClick={() => setStatusTab(t.id)}
              className={`shrink-0 h-[34px] px-3.5 rounded-full text-[12.5px] font-semibold transition-colors flex items-center gap-1.5 ${
                active
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#6E6E73] border border-black/[0.05]'
              }`}
            >
              {t.label}
              {c > 0 && (
                <span
                  className={`min-w-[16px] h-[16px] px-1 rounded-full text-[9.5px] font-bold inline-flex items-center justify-center ${
                    active ? 'bg-white/15 text-white' : 'bg-[#FFEDE3] text-[#E85D2A]'
                  }`}
                >
                  {c}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List/Calendar toggle (only meaningful for upcoming/completed) */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-semibold text-[#111111]">
          {STATUS_TABS.find((t) => t.id === statusTab)?.label}
          <span className="text-[#A09A94] font-normal"> · {list.length}</span>
        </h3>
        <div className="flex items-center gap-1 p-0.5 rounded-full bg-white border border-black/[0.05]">
          <button
            onClick={() => setView('list')}
            className={`h-7 px-2.5 rounded-full text-[11.5px] font-semibold flex items-center gap-1 ${
              view === 'list' ? 'bg-[#111111] text-white' : 'text-[#6E6E73]'
            }`}
          >
            <ListFilter size={11} strokeWidth={2.4} /> List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`h-7 px-2.5 rounded-full text-[11.5px] font-semibold flex items-center gap-1 ${
              view === 'calendar' ? 'bg-[#111111] text-white' : 'text-[#6E6E73]'
            }`}
          >
            <CalendarIcon size={11} strokeWidth={2.4} /> Calendar
          </button>
        </div>
      </div>

      {view === 'list' && (
        <>
          {list.length === 0 ? (
            <EmptyServicesState
              icon={CalendarIcon}
              title={emptyMeta.title}
              subtext={emptyMeta.subtext}
              actionLabel={emptyMeta.actionLabel}
              onAction={emptyMeta.actionLabel ? onOpenDiscover : null}
            />
          ) : (
            <div className="bg-white rounded-[18px] border border-black/[0.04] px-4">
              {list.map((b, i) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  onTap={() => onOpenBooking && onOpenBooking(b.id)}
                  showDivider={i < list.length - 1}
                />
              ))}
            </div>
          )}
        </>
      )}

      {view === 'calendar' && (
        <CalendarView bookings={list} onOpenBooking={onOpenBooking} />
      )}
    </div>
  );
}

function CalendarView({ bookings, onOpenBooking }) {
  const [month, setMonth] = useState(() => {
    const now = new Date('2026-02-22');
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const startWeekday = (new Date(month.getFullYear(), month.getMonth(), 1).getDay() + 6) % 7;

  const bookingsByDay = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      const key = b.dateTime?.date;
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return map;
  }, [bookings]);

  const cells = Array.from({ length: startWeekday + days }, (_, idx) => {
    if (idx < startWeekday) return null;
    const day = idx - startWeekday + 1;
    const y = month.getFullYear();
    const m = String(month.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return { day, key: `${y}-${m}-${d}` };
  });

  const [selected, setSelected] = useState(() => {
    const today = '2026-02-22';
    return today;
  });

  const selectedList = bookingsByDay[selected] || [];

  return (
    <div className="bg-white rounded-[18px] border border-black/[0.04] p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#6E6E73] active:opacity-70"
        >
          ‹
        </button>
        <span className="text-[14px] font-semibold text-[#111111]">{monthLabel}</span>
        <button
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#6E6E73] active:opacity-70"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
          <span key={w} className="text-[10px] font-semibold text-[#A09A94] text-center">
            {w}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">
        {cells.map((c, i) =>
          c == null ? (
            <span key={`gap_${i}`} />
          ) : (
            <button
              key={c.key}
              onClick={() => setSelected(c.key)}
              className={`relative aspect-square rounded-[10px] flex flex-col items-center justify-center text-[12px] font-semibold transition-colors ${
                selected === c.key
                  ? 'bg-[#111111] text-white'
                  : bookingsByDay[c.key]
                  ? 'bg-[#FFEDE3] text-[#E85D2A]'
                  : 'text-[#111111] hover:bg-[#F2F2F7]'
              }`}
            >
              {c.day}
              {bookingsByDay[c.key] && selected !== c.key && (
                <span className="w-1 h-1 rounded-full bg-[#E85D2A] mt-0.5" />
              )}
            </button>
          )
        )}
      </div>

      <div>
        <SectionHeader title={selectedList.length ? formatPretty(selected) : 'No bookings'} />
        {selectedList.length === 0 ? (
          <p className="text-[12.5px] text-[#A09A94]">Tap a day with a dot to see bookings.</p>
        ) : (
          selectedList.map((b, i) => (
            <BookingRow
              key={b.id}
              booking={b}
              onTap={() => onOpenBooking && onOpenBooking(b.id)}
              showDivider={i < selectedList.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}

function formatPretty(key) {
  if (!key) return '';
  const d = new Date(`${key}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
