import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeDatabase } from "./client";

interface DatabaseContextType {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({ isReady: false });

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => setIsReady(true))
      .catch(console.error);
  }, []);

  if (!isReady) {
    return null; // Or a loading spinner
  }

  return (
    <DatabaseContext.Provider value={{ isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
