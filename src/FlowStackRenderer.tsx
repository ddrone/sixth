import { CodePointer } from "./six/vm_state"

interface CodePointerRowAttrs {
  codePointer: CodePointer;
}

function CodePointerRow(attrs: CodePointerRowAttrs) {
  return (
    <tr>
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
