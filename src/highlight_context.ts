import { createContext } from "react";

interface HighlightContextType {
  currBlockId?: number;
  currLineId?: number;
  setHighlight: (newBlockId?: number, newLineId?: number) => void;
}

export const HighlightContext = createContext<HighlightContextType>({
  setHighlight() {
  }
});
