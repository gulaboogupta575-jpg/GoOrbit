// Currency conversion rates against base INR (₹)
export const CURRENCIES = {
  INR: { symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rate: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.011, label: 'EUR (€)' },
  AED: { symbol: 'AED ', rate: 0.044, label: 'AED (د.إ)' }
};

export const formatPrice = (inrAmount, currencyCode = 'INR') => {
  if (inrAmount === undefined || inrAmount === null || isNaN(inrAmount)) return '₹0';
  const curr = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const converted = inrAmount * curr.rate;
  
  if (currencyCode === 'INR') {
    return `${curr.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }
  
  return `${curr.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};
