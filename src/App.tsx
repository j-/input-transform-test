import { useState } from 'react';
import { ExampleNumeric } from './ExampleNumeric';
import { ExampleUppercase } from './ExampleUppercase';

const supportsExecCommand = typeof document.execCommand === 'function';

export const App = () => {
  const [useExecCommand, setUseExecCommand] = useState(supportsExecCommand);
  const execCommand = useExecCommand ? document.execCommand : null;
  
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h1>Input transform test</h1>

      <label
        style={{
          display: 'inline-block',
          boxSizing: 'border-box',
          padding: '1rem',
          marginBottom: '0.5rem',
          border: '1px solid #ccc',
        }}
      >
        <input
          type="checkbox"
          checked={useExecCommand}
          onChange={(e) => setUseExecCommand(e.currentTarget.checked)}
          disabled={!supportsExecCommand}
        />
        {' '}
        <span>Use <strong>exec command</strong> API</span>
      </label>

      <p>Things to try for each of the tests below:</p>

      <ol>
        <li>Insert valid/invalid characters at the start of the input, the end of the input, and within the middle of the input value.</li>

        <li>Highlight part of the input value and try to insert valid/invalid characters.</li>

        <li>Backspace or delete from the middle of the input value or with characters highlighted.</li>

        <li>Try cutting+pasting text into the middle of the textbox.</li>

        <li>Click to drag+drop text into the textbox.</li>

        <li>Try Undo+Redo (Cmd+Z etc).</li>
      </ol>

      <h2>Numeric input field example</h2>

      <p>Only numbers allowed. Max length of 10 digits.</p>
      
      <ExampleNumeric execCommand={execCommand} />

      <h2>Uppercase input field example</h2>

      <p>Letters, spaces, and quotes allowed. Letters will be made uppercase. Quotes will be normalized.</p>
      
      <ExampleUppercase execCommand={execCommand} />

      <h2>Standard input</h2>

      <p>For reference, a regular HTML input element with no transform rules.</p>

      <input type="text" defaultValue="" />

      <h2>What is "exec command" API?</h2>

      <p>The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand" target="_blank" rel="nofollow">Document execCommand() method</a> is used to invoke formatting and input manipulation commands as if they were initiated by the end user. It is now deprecated, however not all commands have alternatives.</p>

      <p>In particular we want to use the "insert text" command, which inserts text into the currently focused input control as if it were typed in. Specifically we want to intercept certain keystrokes and clipboard events and manipulate their data before allowing them to be performed, which we do with this command.</p>

      <p>While this <em>can</em> be done without "exec command", doing so introduces complexity in implementation and, worse, overrides the browser's undo stack effectively disabling Cmd+Z / Ctrl+Z.</p>

      <p>However, since it is deprecated, we must implement a solution which is independent of this API. The examples on this page use "exec command" when it is available and degrade gracefully to a fall back approach when not available. This ensures the solution is future-proof and has the added benefit of working almost as well in environments where we do not expect this API to exist (e.g. in unit tests).</p>
    </form>
  );
};
