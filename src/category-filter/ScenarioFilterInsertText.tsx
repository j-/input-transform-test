import type { FC, InputHTMLAttributes } from 'react';
import { InputNaiiveTransform } from '../InputNaiiveTransform';
import { InputNoTransform } from '../InputNoTransform';
import { InputWithExecCommand } from '../InputWithExecCommand';
import { InputWithoutExecCommand } from '../InputWithoutExecCommand';
import { transform } from './transform';

const inputProps = {
  defaultValue: "",
  type: "text",
  inputMode: "numeric",
  pattern: "[0-9]*",
} as const satisfies InputHTMLAttributes<HTMLInputElement>;

export const ScenarioFilterInsertText: FC = () => {
  return (
    <div>
      <h3>Scenario: Insert text</h3>

      <p>
        Start with a simple transform which filters out nonnumeric characters
        i.e. only the digits 0 to 9 are allowed. Each input field is type "text"
        with input mode "numeric" and pattern "[0-9]*". For each example try
        inserting numbers and letters at the end of the input field, the start,
        and in the middle.
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
              <p>
                Despite being marked with the numeric input mode it will allow
                any input, including letters and punctuation.
              </p>
            </td>
            <td>
              <p>
                A simple transform is applied. This will replace the input field
                value on change with a new version that has all nonnumeric
                characters removed. It does not allow letters and punctuation.
              </p>
              <p>
                Note that when the field has numeric characters in it and the
                cursor is at the beginning of the input inserting a nonnumeric
                character will move the cursor to the end of the input.
              </p>
            </td>
            <td>
              <p>
                A complex transform is applied without the use of the deprecated
                "exec command" API. It behaves similarly to the naiive
                transform, however it solves for the problem of inserting
                nonnumeric characters at the beginning of the input value
                without moving the cursor to the end of the input.
              </p>
            </td>
            <td>
              <p>
                A complex transform is applied with the use of the "exec
                command" API. This will also prevent the cursor from being moved
                to the end of the input when nonnumeric characters are inserted
                at the start.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              ❌ Allows nonnumeric characters.
            </td>
            <td>
              ✅ Disallows nonnumeric characters.
            </td>
            <td>
              ✅ Disallows nonnumeric characters.
            </td>
            <td>
              ✅ Disallows nonnumeric characters.
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
        </tbody>
      </table>
    </div>
  );
};
