import React, { useState } from 'react';
import { Plus, Lock, CreditCard, Smartphone, Wallet } from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import PrimaryCTA from '../components/shared/PrimaryCTA';
import SectionHeader from '../components/shared/SectionHeader';
import { resolveIcon } from '../components/shared/icons';

// Payment slide-in — picks a saved method + reviews summary + confirms.
// (We never collect new card numbers in the prototype: those flow through
// the wallet surface 57_PAYMENT_WALLET.)

export default function Payment({ draft, paymentMethods = [], onClose, onComplete }) {
  const [methodId, setMethodId] = useState(
    paymentMethods.find((p) => p.isDefault)?.id || paymentMethods[0]?.id || null
  );
  const method = paymentMethods.find((p) => p.id === methodId);

  const subtotal = draft?.service ? (draft.service.price || draft.total) : draft?.total || 0;
  const addOnsTotal = (draft?.addOns || []).reduce((sum, a) => sum + (a.price || 0), 0);
  const fee = 0;
  const total = (draft?.total || 0) + fee;

  return (
    <SubScreenContainer
      title="Payment"
      onClose={onClose}
      bottomCTA={
        <PrimaryCTA onTap={() => onComplete && onComplete({ draft, methodId })} leadIcon={Lock}>
          Pay {draft?.currency || 'CHF'} {total.toFixed(2)}
        </PrimaryCTA>
      }
    >
      <div className="px-5">
        {/* Booking summary card */}
        <section className="mb-6">
          <SectionHeader title="Your booking" />
          <div className="bg-white rounded-[18px] border border-black/[0.04] p-4">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={draft?.provider?.photo}
                alt=""
                className="w-10 h-10 rounded-[12px] object-cover bg-[#F2F2F7]"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[14px] font-semibold text-[#111111] block truncate">
                  {draft?.service?.label}
                </span>
                <span className="text-[11.5px] text-[#8E8E93] block">
                  {draft?.provider?.name} · {draft?.dateTime?.formatted}
                </span>
              </div>
            </div>
            {draft?.pet?.name && (
              <p className="text-[12px] text-[#6E6E73] border-t border-black/[0.04] pt-3">
                For <span className="font-semibold text-[#111111]">{draft.pet.name}</span>
              </p>
            )}
          </div>
        </section>

        {/* Cost breakdown */}
        <section className="mb-6">
          <SectionHeader title="Summary" />
          <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
            <Row label={draft?.service?.label || 'Service'} value={`${draft?.currency || 'CHF'} ${(draft?.service?.price ?? subtotal).toFixed(2)}`} />
            {(draft?.addOns || []).map((a) => (
              <Row key={a.id} label={a.label} value={`+${draft?.currency || 'CHF'} ${a.price.toFixed(2)}`} />
            ))}
            {fee > 0 && (
              <Row label="Service fee" value={`${draft?.currency || 'CHF'} ${fee.toFixed(2)}`} muted />
            )}
            <Row
              label="Total"
              value={`${draft?.currency || 'CHF'} ${total.toFixed(2)}`}
              total
            />
          </div>
        </section>

        {/* Payment method */}
        <section className="mb-6">
          <SectionHeader title="Pay with" />
          <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
            {paymentMethods.map((pm) => {
              const Icon = resolveIcon(pm.icon, CreditCard);
              const selected = methodId === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setMethodId(pm.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:opacity-70"
                >
                  <span className="w-10 h-10 rounded-[12px] bg-[#FFEDE3] flex items-center justify-center shrink-0">
                    <Icon size={17} className="text-[#E85D2A]" strokeWidth={2.2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[13.5px] font-semibold text-[#111111] block truncate">
                      {pm.label}
                      {pm.isDefault && (
                        <span className="ml-2 text-[10px] font-semibold text-[#E85D2A] uppercase tracking-wider">
                          Default
                        </span>
                      )}
                    </span>
                    {pm.expiry && (
                      <span className="text-[11.5px] text-[#8E8E93]">Expires {pm.expiry}</span>
                    )}
                  </div>
                  <span
                    className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                      selected ? 'border-[#E85D2A]' : 'border-[#C4BBB3]'
                    }`}
                  >
                    {selected && <span className="w-2 h-2 bg-[#E85D2A] rounded-full" />}
                  </span>
                </button>
              );
            })}
            <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:opacity-70">
              <span className="w-10 h-10 rounded-[12px] bg-[#F2F2F7] flex items-center justify-center shrink-0">
                <Plus size={17} className="text-[#6E6E73]" strokeWidth={2.2} />
              </span>
              <span className="text-[13.5px] font-semibold text-[#111111]">Add new method</span>
            </button>
          </div>
        </section>

        {/* Reassurance copy */}
        <p className="text-[11.5px] text-[#8E8E93] leading-[1.55] flex items-start gap-2 mb-2">
          <Lock size={11} className="text-[#A09A94] mt-0.5 shrink-0" strokeWidth={2.4} />
          You're charged only after the provider confirms. Free cancellation up to 24h before the booking starts.
        </p>
      </div>
    </SubScreenContainer>
  );
}

function Row({ label, value, total, muted }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span
        className={`${total ? 'text-[14px] font-semibold text-[#111111]' : muted ? 'text-[12.5px] text-[#8E8E93]' : 'text-[13px] text-[#3D3D44]'}`}
      >
        {label}
      </span>
      <span
        className={`${total ? 'text-[16px] font-bold text-[#111111]' : muted ? 'text-[12.5px] text-[#8E8E93]' : 'text-[13px] font-semibold text-[#111111]'}`}
      >
        {value}
      </span>
    </div>
  );
}
