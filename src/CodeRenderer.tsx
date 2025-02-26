import { useContext, useState, ReactNode } from "react";
import { Instr } from "./six/instr";
import { CodePointer } from "./six/vm_state";
import { HighlightContext } from "./highlight_context";
import { catClasses } from "./shared/class_name";

interface CodeRendenerAttrs {
  code: Instr[][];
  ip: CodePointer;
}

function CodeRendener(attrs: CodeRendenerAttrs) {
  return (
    <div>
      {attrs.code.map((code, blockId) =>
        <CodeBlockRenderer
          code={code}
          blockId={blockId}
          activeLine={attrs.ip.blockId === blockId ? attrs.ip.instrId : undefined}
        />)}
    </div>
  )
}

interface BlockRendererAttrs {
  blockId: number;
  code: Instr[];
  activeLine?: number;
}

function CodeBlockRenderer(attrs: BlockRendererAttrs) {
  const context = useContext(HighlightContext);

  let className = 'block';
  if (attrs.activeLine !== undefined) {
    className = `${className} block-active`;
  }
  if (context.currBlockId === attrs.blockId) {
    className = `${className} block-highlight`;
  }

  return (
    <div className={className}>
      <h2>Block {attrs.blockId}</h2>
      <ul>
        {attrs.code.map((instr, index) => <CodeLineRenderer
          code={instr}
          isHighlighted={context.currBlockId === attrs.blockId && context.currLineId === index}
          isActive={attrs.activeLine === index} />)}
      </ul>
    </div>
  )
}

interface HighlightLiAttrs {
  highlightId: number;
  children: ReactNode;
  classOverride?: string;
}

function HighlightLi(attrs: HighlightLiAttrs) {
  const context = useContext(HighlightContext);
  const [isActive, setIsActive] = useState(false);

  let className = '';
  if (attrs.classOverride !== undefined) {
    className = attrs.classOverride;
  }
  else if (isActive) {
    className = 'highlight-active';
  }
  else if (context.currBlockId === attrs.highlightId) {
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
  isActive: boolean;
  isHighlighted: boolean;
}

function CodeLineRenderer(attrs: CodeLineRendererAttrs) {
  let className = attrs.isActive ? 'highlight-running' : undefined;
  if (attrs.isHighlighted) {
    className = catClasses(className, 'highlight-border');
  }

  switch (attrs.code.kind) {
    case 'const':
      return <li className={className}>const {attrs.code.value}</li>
    case 'constBool':
      return <li className={className}>const {`${attrs.code.value}`}</li>
    case 'call':
      return <li className={className}>call <span className="prim-function">{attrs.code.name}</span></li>
    case 'fnPointer':
      return <HighlightLi highlightId={attrs.code.value} classOverride={className}>
        pointer {attrs.code.value}
      </HighlightLi>
    case 'callFnPointer':
      return <HighlightLi highlightId={attrs.code.value} classOverride={className}>
        call block {attrs.code.value}
      </HighlightLi>
  }
}

export default CodeRendener
