import React, { createContext } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  return (
    <SettingsContext.Provider value={null}>{children}</SettingsContext.Provider>
  );
};
