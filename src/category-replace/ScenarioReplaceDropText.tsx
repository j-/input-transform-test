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

export const ScenarioReplaceDropText: FC = () => {
  return (
    <div>
      <h3>Scenario: Drop text</h3>

      <p>
        These inputs are exactly like the previous scenario and as such are
        expected to only ever uppercase letters, quotes, and spaces.
      </p>

      <p>
        For each example try entering some letters, then click+drag some text
        into the middle of that field and drop it.
      </p>

      <p
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData(
            'text/plain',
            e.currentTarget.textContent ?? '',
          );
        }}
        style={{
          display: 'inline-block',
          border: '1px solid #888',
          padding: '0.5rem',
          borderRadius: '0.25rem',
          cursor: 'move',
          backgroundColor: 'inherit',
        }}
      >
        This document was written in November 2025.
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
                All text is inserted, no transform is applied.
              </p>
            </td>
            <td>
              <p>
                Only the letters and spaces are inserted. If the dropped data
                contained invalid characters then the cursor will move to the
                end of the input.
              </p>
              <p>
                If the dropped data contained valid characters only then the
                field will behave correctly and will match the behaviour of the
                native input example.
              </p>
            </td>
            <td>
              <p>
                Only the valid characters are inserted. The dropped data will
                be highlighted matching the behaviour of the native input
                example.
              </p>
              <p>
                If the dropped data contained invalid characters then the undo
                stack will not allow the inserted text to be removed.
              </p>
            </td>
            <td>
              <p>
                Only the valid characters are inserted. The dropped data will
                be highlighted matching the behaviour of the native input
                example, and the undo stack works as expected.
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
              ❌ Highlighted text is replaced.
            </td>
            <td>
              ❌ Highlighted text is removed.
            </td>
            <td>
              ✅ Highlighted text is preserved.
            </td>
            <td>
              ✅ Highlighted text is preserved.
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
