import { initState } from './six/compiler'
import { example1 } from './six/grammar'
import CodeRendener from './CodeRenderer';

function App() {
  const initialState = initState(example1);

  return (
    <>
      <CodeRendener code={initialState.code} />
    </>
  )
}

export default App
