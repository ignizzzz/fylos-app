import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Plus,
  TrendingUp,
  Shield,
  Check,
} from 'lucide-react';

/**
 * 57_PAYMENT_WALLET_v1.jsx
 * Payment wallet screen for the Fylos pet care app.
 * Warm minimal design system.
 */

const PAYMENT_METHODS = [
  { id: 'visa', label: 'Visa', last4: '4242', isDefault: true },
  { id: 'mc', label: 'Mastercard', last4: '8523', isDefault: false },
  { id: 'applepay', label: 'Apple Pay', last4: null, isDefault: false },
];

const TRANSACTIONS = [
  { id: 'tx1', title: 'Dog Walking', subtitle: 'Sarah M.', date: 'Today', amount: -35 },
  { id: 'tx2', title: 'Refund', subtitle: 'Cancelled booking', date: 'Yesterday', amount: 32 },
  { id: 'tx3', title: 'Grooming', subtitle: 'Pet Salon Zuri', date: 'Mar 12', amount: -65 },
  { id: 'tx4', title: 'Subscription', subtitle: null, date: 'Mar 10', amount: -9.9 },
];

const formatAmount = (amount) => {
  const abs = Math.abs(amount);
  const formatted = abs % 1 === 0 ? abs.toString() : abs.toFixed(2);
  return amount > 0 ? `+CHF ${formatted}` : `-CHF ${formatted}`;
};

/* Brand tile for card networks */
const CardBrandTile = ({ brand }) => {
  if (brand === 'Visa') {
    return (
      <div className="w-[30px] h-[20px] rounded-[4px] bg-[#1A1F71] flex items-center justify-center">
        <span className="text-[8px] font-extrabold text-white tracking-wide italic">VISA</span>
      </div>
    );
  }
  if (brand === 'Mastercard') {
    return (
      <div className="w-[30px] h-[20px] rounded-[4px] bg-[#111] flex items-center justify-center relative overflow-hidden">
        <div className="absolute left-[4px] w-[10px] h-[10px] rounded-full bg-[#EB001B] opacity-90" />
        <div className="absolute right-[4px] w-[10px] h-[10px] rounded-full bg-[#F79E1B] opacity-90" />
      </div>
    );
  }
  /* Apple Pay fallback */
  return (
    <div className="w-[30px] h-[20px] rounded-[4px] bg-[#111] flex items-center justify-center">
      <span className="text-[7px] font-bold text-white"></span>
    </div>
  );
};

const PaymentWalletScreen = () => {
  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center font-sans antialiased" style={{ padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* iPhone Frame */}
      <div
        className="relative"
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F7F5F2',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[100]"
          style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
          style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent pt-14 pb-6 px-5">
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={() => window.history.back()}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] transition-all duration-[120ms]"
              style={{ background: '#F3EFEB' }}
            >
              <ChevronLeft size={22} color="#111" />
            </button>
            <h2 className="text-[17px] font-semibold text-[#111]">Wallet</h2>
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Scroll Content */}
        <div className="absolute inset-0 overflow-y-auto pt-[110px] pb-[140px] px-5" style={{ scrollbarWidth: 'none' }}>
          <div className="flex flex-col gap-6">

            {/* Balance Card */}
            <div
              className="rounded-[20px] p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)' }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-[30px] -right-[30px] w-[120px] h-[120px] rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="absolute -bottom-[20px] right-[40px] w-[80px] h-[80px] rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Shield size={14} color="rgba(255,255,255,0.7)" strokeWidth={2} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Available Balance
                  </span>
                </div>

                <div className="text-[36px] font-extrabold text-white tracking-tight leading-none mb-1" style={{ letterSpacing: '-1px' }}>
                  CHF 45.00
                </div>

                <div className="text-[13px] mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  From credits &amp; refunds
                </div>

                <button
                  className="active:scale-[0.97] transition-all duration-[120ms] inline-flex items-center gap-1.5 rounded-full text-white text-[14px] font-semibold py-2.5 px-5"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(4px)',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
                  Top Up
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <span className="text-[12px] font-semibold text-[#A09A94] uppercase tracking-wider block mb-2.5 ml-1">
                Payment Methods
              </span>

              <div className="rounded-[20px] bg-[#F3EFEB] border border-[#EDE8E2] overflow-hidden">
                {PAYMENT_METHODS.map((method, i) => (
                  <div key={method.id} className="relative">
                    <div
                      className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer active:bg-black/5 transition-colors"
                    >
                      <CardBrandTile brand={method.label} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-semibold text-[#111]">
                            {method.label}
                            {method.last4 && (
                              <span className="font-normal text-[#6E6058]">
                                {' '}{method.last4}
                              </span>
                            )}
                          </span>
                          {method.isDefault && (
                            <span className="bg-[#111] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={16} color="#A09A94" />
                    </div>
                    {i < PAYMENT_METHODS.length - 1 && (
                      <div className="absolute bottom-0 left-[52px] right-4 border-t border-dashed border-[#CFCFD4]" />
                    )}
                  </div>
                ))}

                {/* Add Payment Method */}
                <div className="border-t border-dashed border-[#CFCFD4]">
                  <div
                    className="flex items-center gap-3.5 px-4 py-3.5 cursor-pointer active:bg-black/5 transition-colors"
                  >
                    <div className="w-[30px] h-[20px] rounded-[4px] flex items-center justify-center" style={{ background: 'rgba(232,93,42,0.1)' }}>
                      <Plus size={14} color="#E85D2A" strokeWidth={2.5} />
                    </div>
                    <span className="text-[15px] font-semibold text-[#E85D2A] flex-1">
                      Add Payment Method
                    </span>
                    <ChevronRight size={16} color="#E85D2A" />
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <div className="flex items-center justify-between mb-2.5 mx-1">
                <span className="text-[12px] font-semibold text-[#A09A94] uppercase tracking-wider">
                  Transaction History
                </span>
                <span className="text-[13px] font-medium text-[#6E6058]">
                  This Month
                </span>
              </div>

              <div className="rounded-[20px] bg-[#F3EFEB] border border-[#EDE8E2] overflow-hidden">
                {TRANSACTIONS.map((tx, i) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <div key={tx.id} className="relative">
                      <div
                        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-black/5 transition-colors"
                      >
                        {/* Icon */}
                        <div
                          className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0"
                          style={{ background: isPositive ? '#E5F9ED' : '#F7F5F2' }}
                        >
                          <TrendingUp
                            size={17}
                            color={isPositive ? '#34C759' : '#6E6058'}
                            style={{ transform: isPositive ? 'none' : 'rotate(180deg)' }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-semibold text-[#111] truncate">
                            {tx.title}
                            {tx.subtitle && (
                              <span className="font-normal text-[#6E6058]">
                                {' -- '}{tx.subtitle}
                              </span>
                            )}
                          </div>
                          <div className="text-[13px] text-[#A09A94] mt-0.5">
                            {tx.date}
                          </div>
                        </div>

                        {/* Amount */}
                        <span
                          className="text-[15px] font-semibold shrink-0"
                          style={{
                            color: isPositive ? '#34C759' : '#111',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {formatAmount(tx.amount)}
                        </span>
                      </div>
                      {i < TRANSACTIONS.length - 1 && (
                        <div className="absolute bottom-0 left-[62px] right-4 border-t border-dashed border-[#CFCFD4]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWalletScreen;
