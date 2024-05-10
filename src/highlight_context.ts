import { createContext } from "react";

interface HighlightContextType {
  currId?: number;
  setHighlight: (newId?: number) => void;
}

export const HighlightContext = createContext<HighlightContextType>({
  setHighlight() {
  }
});
