import { ScenarioFilterAutocomplete } from './category-filter/ScenarioFilterAutocomplete';
import { ScenarioFilterDropText } from './category-filter/ScenarioFilterDropText';
import { ScenarioFilterInsertText } from './category-filter/ScenarioFilterInsertText';
import { ScenarioFilterReplaceText } from './category-filter/ScenarioFilterReplaceText';
import { ScenarioReplaceAutocomplete } from './category-replace/ScenarioReplaceAutocomplete';
import { ScenarioReplaceDropText } from './category-replace/ScenarioReplaceDropText';
import { ScenarioReplaceInsertText } from './category-replace/ScenarioReplaceInsertText';
import { ScenarioReplaceReplaceText } from './category-replace/ScenarioReplaceReplaceText';

export const App = () => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h1>Input transform test</h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        margin: '4rem 0',
      }}>
        <div>
          <h2>Category: Filter</h2>

          <p>
            These scenarios use a simple filter which only ever removes characters
            and never replaces existing characters.
          </p>
        </div>

        <ScenarioFilterInsertText />
        <ScenarioFilterReplaceText />
        <ScenarioFilterDropText />
        <ScenarioFilterAutocomplete />

        <div>
          <h2>Category: Replace</h2>

          <p>
            These scenarios use a more complex filter/replace transform which
            removes some characters and replaces other characters.
          </p>
        </div>

        <ScenarioReplaceInsertText />
        <ScenarioReplaceReplaceText />
        <ScenarioReplaceDropText />
        <ScenarioReplaceAutocomplete />
      </div>

      <h2>What is "exec command" API?</h2>

      <p>The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand" target="_blank" rel="nofollow">Document execCommand() method</a> is used to invoke formatting and input manipulation commands as if they were initiated by the end user. It is now deprecated, however not all commands have alternatives.</p>

      <p>In particular we want to use the "insert text" command, which inserts text into the currently focused input control as if it were typed in. Specifically we want to intercept certain keystrokes and clipboard events and manipulate their data before allowing them to be performed, which we do with this command.</p>

      <p>While this <em>can</em> be done without "exec command", doing so introduces complexity in implementation and, worse, overrides the browser's undo stack effectively disabling Cmd+Z / Ctrl+Z.</p>

      <p>However, since it is deprecated, we must implement a solution which is independent of this API. The examples on this page use "exec command" when it is available and degrade gracefully to a fall back approach when not available. This ensures the solution is future-proof and has the added benefit of working almost as well in environments where we do not expect this API to exist (e.g. in unit tests).</p>
    </form>
  );
};
