import { createContext, useContext, useState, useCallback } from 'react';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem('cp-currency') || 'INR'
  );

  const setCurrency = useCallback((c) => {
    setCurrencyState(c);
    localStorage.setItem('cp-currency', c);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
