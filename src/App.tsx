import { initState } from './six/compiler'
import { example1 } from './six/grammar'
import CodeRendener from './CodeRenderer';
import { evalLoop } from './six/evaluator';
import { SixthError } from './six/vm_state';
import DataStackRenderer from './DataStackRenderer';

function App() {
  const state = initState(example1);
  let error: string | undefined;

  try {
    evalLoop(state);
  }
  catch (e) {
    if (e instanceof SixthError) {
      error = e.message;
    }
  }

  return (
    <>
      {error !== undefined && <span className='error'>{error}</span>}
      <DataStackRenderer stack={state.dataStack} />
      <CodeRendener code={state.code} />
    </>
  )
}

export default App
