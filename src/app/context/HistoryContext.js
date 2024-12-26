"use client"
import React, { createContext, useContext, useState } from 'react';

const HistoryContext = createContext();

export const useHistoryContext = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [historyLength, setHistoryLength] = useState(0);

  return (
    <HistoryContext.Provider value={{ historyLength, setHistoryLength }}>
      {children}
    </HistoryContext.Provider>
  );
};
