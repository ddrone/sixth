import { initState } from './six/compiler'
import { example1 } from './six/grammar'
import CodeRendener from './CodeRenderer';
import { stepProgram } from './six/evaluator';
import { SixthError } from './six/vm_state';
import DataStackRenderer from './DataStackRenderer';
import FlowStackRenderer from './FlowStackRenderer';
import { useRef, useState } from 'react';

function App() {
  const state = useRef(initState(example1));

  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | undefined>();
  // Step counter is just a hack to force React to re-render the application
  const [step, setStep] = useState(0);

  function handleStepClick() {
    try {
      setFinished(!stepProgram(state.current));
      setStep(step + 1);
    }
    catch (e) {
      if (e instanceof SixthError) {
        setError(e.message);
        setFinished(true);
      }
    }
  }

  return (
    <div className='horizontal'>
      <CodeRendener code={state.current.code} ip={{...state.current.ip}} />
      <FlowStackRenderer flowStack={[...state.current.flowStack]} ip={{...state.current.ip}} />
      <DataStackRenderer stack={[...state.current.dataStack]} />
      <div>
        {!finished && <>
          <button onClick={handleStepClick}>Step</button>
          <br />
        </>}
        {error !== undefined && <span className='error'>{error}</span>}
      </div>
    </div>
  )
}

export default App
