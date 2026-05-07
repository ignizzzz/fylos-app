// FYLOS · Services · Payment methods
//
// Mock saved payment methods. Real implementation would come from the wallet
// surface (57_PAYMENT_WALLET).

export const SAVED_PAYMENT_METHODS = [
  {
    id: 'pm_001',
    type: 'visa',
    label: 'Visa · 4411',
    last4: '4411',
    expiry: '08/27',
    isDefault: true,
    icon: 'CreditCard',
  },
  {
    id: 'pm_002',
    type: 'mastercard',
    label: 'Mastercard · 0192',
    last4: '0192',
    expiry: '02/28',
    isDefault: false,
    icon: 'CreditCard',
  },
  {
    id: 'pm_003',
    type: 'apple-pay',
    label: 'Apple Pay',
    last4: null,
    expiry: null,
    isDefault: false,
    icon: 'Smartphone',
  },
  {
    id: 'pm_004',
    type: 'twint',
    label: 'TWINT',
    last4: null,
    expiry: null,
    isDefault: false,
    icon: 'Wallet',
  },
];
