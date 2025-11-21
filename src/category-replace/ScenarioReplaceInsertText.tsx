import type { FC } from 'react';
import { InputNaiiveTransform } from '../InputNaiiveTransform';
import { InputNoTransform } from '../InputNoTransform';
import { InputWithExecCommand } from '../InputWithExecCommand';
import { InputWithoutExecCommand } from '../InputWithoutExecCommand';
import { transform } from './transform';

const inputProps = {
  defaultValue: "",
  type: "text",
  autoCapitalize: "characters",
} as const;

export const ScenarioReplaceInsertText: FC = () => {
  return (
    <div>
      <h3>Scenario: Insert text</h3>

      <p>
        This transform function removes everything but letters, spaces, and
        quotes. It will also convert all letters to UPPERCASE.
      </p>

      <table>
        <thead>
          <tr>
            <th>No transform</th>
            <th>Naiive transform</th>
            <th>Without exec command</th>
            <th>With exec command</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <InputNoTransform {...inputProps} />
            </td>
            <td>
              <InputNaiiveTransform {...inputProps} transform={transform} />
            </td>
            <td>
              <InputWithoutExecCommand {...inputProps} transform={transform} />
            </td>
            <td>
              <InputWithExecCommand {...inputProps} transform={transform} />
            </td>
          </tr>
          <tr>
            <td>
              <p>
                No transform is applied. This is a plain HTML input without any
                JS logic attached.
              </p>
            </td>
            <td>
              <p>
                Inserting letters works as expected. Inserting numbers causes
                the cursor to jump to the end of the input.
              </p>
            </td>
            <td>
              <p>
                Inserting letters works as expected. Disallowed characters are
                prevented, and the cursor position works as expected, however
                the undo stack does not work.
              </p>
            </td>
            <td>
              <p>
                Inserting letters works as expected. Disallowed characters are
                prevented, and the cursor position works as expected. The undo
                stack is preserved.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              ❌ Allows invalid characters.
            </td>
            <td>
              ✅ Disallows invalid characters.
            </td>
            <td>
              ✅ Disallows invalid characters.
            </td>
            <td>
              ✅ Disallows invalid characters.
            </td>
          </tr>
          <tr>
            <td>
              ✅ Correct cursor position.
            </td>
            <td>
              ❌ Incorrect cursor position.
            </td>
            <td>
              ✅ Correct cursor position.
            </td>
            <td>
              ✅ Correct cursor position.
            </td>
          </tr>
          <tr>
            <td>
              ✅ Preserves undo stack.
            </td>
            <td>
              ❌ Loses undo stack.
            </td>
            <td>
              ❌ Loses undo stack.
            </td>
            <td>
              ✅ Preserves undo stack.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
