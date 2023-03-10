import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { SDK } from "@gumhq/react-sdk";

interface GumAppContextProps {
  sdk: SDK;
}

export const GumAppContext = createContext<GumAppContextProps>({} as GumAppContextProps);

export const useGumApp = (): GumAppContextProps => useContext(GumAppContext);

interface GumAppProviderProps {
  children: ReactNode;
  sdk: SDK;
}

export const GumAppProvider = ({
  children,
  sdk,
}: GumAppProviderProps): JSX.Element => {
  
  const value = {
    sdk
  };

  return (
    <GumAppContext.Provider value={value}>{children}</GumAppContext.Provider>
  );
};
