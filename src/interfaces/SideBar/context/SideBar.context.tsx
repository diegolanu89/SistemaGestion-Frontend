import { createContext, useContext } from "react";

interface SideBarContextType {
  // expandible para roles / permisos
}

const SideBarContext = createContext<SideBarContextType | null>(null);

export const useSideBarContext = () => {
  const context = useContext(SideBarContext);
  if (!context) {
    throw new Error("SideBarContext not found");
  }
  return context;
};

export default SideBarContext;
