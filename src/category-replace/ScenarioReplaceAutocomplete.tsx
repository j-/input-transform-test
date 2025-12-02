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
  autoComplete: "name",
} as const satisfies InputHTMLAttributes<HTMLInputElement>;

export const ScenarioReplaceAutocomplete: FC = () => {
  return (
    <div>
      <h3>Scenario: Autocomplete</h3>

      <p>
        These inputs are marked with the "text" input type and "name" autocomplete type.
        They should automatically capitalize any input that is autocompleted.
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
                autoComplete={`section-e ${inputProps.autoComplete}`}
              />
            </td>
            <td>
              <InputNaiiveTransform
                {...inputProps}
                transform={transform}
                autoComplete={`section-f ${inputProps.autoComplete}`}
              />
            </td>
            <td>
              <InputWithoutExecCommand
                {...inputProps}
                transform={transform}
                autoComplete={`section-g ${inputProps.autoComplete}`}
              />
            </td>
            <td>
              <InputWithExecCommand
                {...inputProps}
                transform={transform}
                autoComplete={`section-h ${inputProps.autoComplete}`}
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
