import { createContext, useContext, useState, ReactNode } from "react";
import { Instr } from "./six/instr";

interface HighlightContextType {
  currId?: number;
  setHighlight: (newId?: number) => void;
}

const HighlightContext = createContext<HighlightContextType>({
  setHighlight() {
  }
});

interface CodeRendenerAttrs {
  code: Instr[][];
}

function CodeRendener(attrs: CodeRendenerAttrs) {
  const [currId, setCurrId] = useState<number | undefined>();

  return (
    <div>
      <HighlightContext.Provider value={{
        currId,
        setHighlight: setCurrId
      }}>
        {attrs.code.map((code, blockId) => <CodeBlockRenderer code={code} blockId={blockId} />)}
      </HighlightContext.Provider>
    </div>
  )
}

interface BlockRendererAttrs {
  blockId: number;
  code: Instr[];
}

function CodeBlockRenderer(attrs: BlockRendererAttrs) {
  return (
    <div>
      <h2>Block {attrs.blockId}</h2>
      <ul>
        {attrs.code.map(instr => <CodeLineRenderer code={instr} />)}
      </ul>
    </div>
  )
}

interface HighlightLiAttrs {
  highlightId: number;
  children: ReactNode;
}

function HighlightLi(attrs: HighlightLiAttrs) {
  const context = useContext(HighlightContext);
  const [isActive, setIsActive] = useState(false);

  let className = '';
  if (isActive) {
    className = 'highlight-active';
  }
  else if (context.currId === attrs.highlightId) {
    className = 'highlight-passive';
  }

  function handleMouseEnter() {
    setIsActive(true);
    context.setHighlight(attrs.highlightId);
  }

  function handleMouseLeave() {
    setIsActive(false);
    context.setHighlight(undefined);
  }

  return (
    <li className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {attrs.children}
    </li>
  );
}

interface CodeLineRendererAttrs {
  code: Instr;
}

function CodeLineRenderer(attrs: CodeLineRendererAttrs) {
  switch (attrs.code.kind) {
    case 'const':
      return <li>const {attrs.code.value}</li>
    case 'constBool':
      return <li>const {`${attrs.code.value}`}</li>
    case 'call':
      return <li>call <span className="prim-function">{attrs.code.name}</span></li>
    case 'fnPointer':
      return <HighlightLi highlightId={attrs.code.value}>
        pointer {attrs.code.value}
      </HighlightLi>
    case 'callFnPointer':
      return <HighlightLi highlightId={attrs.code.value}>
        pointer {attrs.code.value}
      </HighlightLi>
  }
}

export default CodeRendener
