import { ReactNode, useState } from "react";
import { HighlightContext } from "./highlight_context";

interface HighlightContextWrapperAttrs {
  children?: ReactNode
}

function HighlightContextWrapper(attrs: HighlightContextWrapperAttrs) {
  const [blockId, setBlockId] = useState<number>();
  const [lineId, setLineId] = useState<number>();

  return (
    <HighlightContext.Provider value={{
      currBlockId: blockId,
      currLineId: lineId,
      setHighlight(blockId, lineId) {
        setBlockId(blockId);
        setLineId(lineId);
      }
    }}>
      {attrs.children}
    </HighlightContext.Provider>
  );
}

export default HighlightContextWrapper;
