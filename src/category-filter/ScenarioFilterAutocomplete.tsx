import type { FC, InputHTMLAttributes } from 'react';
import { InputNaiiveTransform } from '../InputNaiiveTransform';
import { InputNoTransform } from '../InputNoTransform';
import { InputWithExecCommand } from '../InputWithExecCommand';
import { InputWithoutExecCommand } from '../InputWithoutExecCommand';
import { transform } from './transform';

const inputProps = {
  defaultValue: "",
  type: "tel",
  inputMode: "tel",
  autoComplete: "tel",
  pattern: "[0-9]*",
} as const satisfies InputHTMLAttributes<HTMLInputElement>;

export const ScenarioFilterAutocomplete: FC = () => {
  return (
    <div>
      <h3>Scenario: Autocomplete</h3>

      <p>
        These inputs are marked with the "tel" input mode, input type, and autocomplete type.
      </p>

      <p>
        Note that the "tel" autocomplete type includes the international prefix (+) which is
        a forbidden character here and should be removed after the field is filled. Normally
        we would mark this field as "tel-local" but for the sake of example we want the
        browser to autocomplete with disallowed characters.
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
              <InputNoTransform
                {...inputProps}
                autoComplete={`section-a ${inputProps.autoComplete}`}
              />
            </td>
            <td>
              <InputNaiiveTransform
                {...inputProps}
                transform={transform}
                autoComplete={`section-b ${inputProps.autoComplete}`}
              />
            </td>
            <td>
              <InputWithoutExecCommand
                {...inputProps}
                transform={transform}
                autoComplete={`section-c ${inputProps.autoComplete}`}
              />
            </td>
            <td>
              <InputWithExecCommand
                {...inputProps}
                transform={transform}
                autoComplete={`section-d ${inputProps.autoComplete}`}
              />
            </td>
          </tr>
          <tr>
            <td>
              ❌ Does not transform characters.
            </td>
            <td>
              ✅ Transforms characters.
            </td>
            <td>
              ✅ Transforms characters.
            </td>
            <td>
              ✅ Transforms characters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
