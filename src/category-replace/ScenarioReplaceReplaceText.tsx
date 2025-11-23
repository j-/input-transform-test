import type { FC, InputHTMLAttributes } from 'react';
import { InputNaiiveTransform } from '../InputNaiiveTransform';
import { InputNoTransform } from '../InputNoTransform';
import { InputWithExecCommand } from '../InputWithExecCommand';
import { InputWithoutExecCommand } from '../InputWithoutExecCommand';
import { transform } from './transform';

const inputProps = {
  defaultValue: "",
  type: "text",
  autoCapitalize: "characters",
} as const satisfies InputHTMLAttributes<HTMLInputElement>;

export const ScenarioReplaceReplaceText: FC = () => {
  return (
    <div>
      <h3>Scenario: Replace text</h3>

      <p>
        These inputs are exactly like the previous scenario. For each example
        try entering some letters, then highlight a portion of the text and
        insert a numeric character (0-9).
      </p>

      <p>
        Also try copying a string with some mix of letters and numbers, like the
        string "submit by 10:30am Monday", and paste it into each input while
        some of the text in that input is highlghted.
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
                No transform is applied, this example is only here for
                comparison.
              </p>
            </td>
            <td>
              <p>
                The input is always correct, however replacing a selection with
                an invalid character causes the selected region to be removed
                and for the cursor to jump to the end of the input.
              </p>
            </td>
            <td>
              <p>
                Pressing an invalid key results in a no-op. The selection range
                is still highlighted and the cursor does not jump to the end of
                the input.
              </p>
              <p>
                The undo stack will not allow the replaced range to be restored.
              </p>
            </td>
            <td>
              <p>
                The invalid key is blocked, the selection range is preserved,
                the cursor does not jump to the end of the input, and the undo
                stack works as expected.
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
              ❌ Highlighted text is <strong>replaced</strong>.
            </td>
            <td>
              ❌ Highlighted text is <strong>removed</strong>.
            </td>
            <td>
              ✅ Highlighted text is <strong>preserved</strong>.
            </td>
            <td>
              ✅ Highlighted text is <strong>preserved</strong>.
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
