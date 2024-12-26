"use client"; 

import React, { createContext, useContext } from "react";

const UserSessionContext = createContext(null);

export const UserSessionProvider = ({ session, children }) => {
  return (
    <UserSessionContext.Provider value={session}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => useContext(UserSessionContext);
