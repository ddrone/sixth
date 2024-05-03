import { Value } from "./six/value";

interface ValueRendererAttrs {
  value: Value;
}

function ValueRenderer(attrs: ValueRendererAttrs) {
  const v = attrs.value;

  switch (v.kind) {
    case 'boolean':
      return `${v.value}`;
    case 'number':
      return v.value;
    case 'fnPointer':
      return <>
        pointer {v.blockId}; {v.instrId}
      </>
  }
}

interface DataStackRendererAttrs {
  stack: Value[];
}

function DataStackRenderer(attrs: DataStackRendererAttrs) {
  return (
    <div>
      <table className='stack'>
        <tr>
          <th>Stack</th>
        </tr>
        {attrs.stack.map(val => <tr>
          <td>
            <ValueRenderer value={val} />
          </td>
        </tr>)}
      </table>
    </div>
  );
}

export default DataStackRenderer
