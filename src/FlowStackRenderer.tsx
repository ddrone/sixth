import { useContext, useState } from "react";
import { CodePointer } from "./six/vm_state"
import { HighlightContext } from "./highlight_context";

interface CodePointerRowAttrs {
  codePointer: CodePointer;
}

function CodePointerRow(attrs: CodePointerRowAttrs) {
  const context = useContext(HighlightContext);
  const [isActive, setIsActive] = useState(false);

  let className = '';
  if (isActive) {
    className = 'highlight-active';
  }
  else if (context.currBlockId === attrs.codePointer.blockId && context.currLineId === attrs.codePointer.instrId) {
    className = 'highlight-passive';
  }

  function handleMouseEnter() {
    setIsActive(true);
    context.setHighlight(attrs.codePointer.blockId, attrs.codePointer.instrId);
  }

  function handleMouseLeave() {
    setIsActive(false);
    context.setHighlight();
  }

  return (
    <tr className={className} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <td>pointer {attrs.codePointer.blockId}; {attrs.codePointer.instrId}</td>
    </tr>
  )
}

interface FlowStackRendererAttrs {
  ip: CodePointer;
  flowStack: CodePointer[];
}

function FlowStackRenderer(attrs: FlowStackRendererAttrs) {
  return (
    <div>
      <table className='stack'>
        <tr>
          <th>Flow stack</th>
        </tr>
        {attrs.flowStack.map(cp => <CodePointerRow codePointer={cp} />)}
        <CodePointerRow codePointer={attrs.ip} />
      </table>
    </div>
  )
}

export default FlowStackRenderer
