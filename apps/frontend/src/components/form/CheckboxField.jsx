import toSnakeCase from "../../utils/toSnakeCase.js";
import "./formField.css"
export default function CheckboxField({
  name: providedName,
  label,
  checked,
  onChange,
  error,
  disabled = false,
  required = false
}) {
  const name = providedName || toSnakeCase(label);
  const id = name;

  return (
    <div className="checkbox-container">
      <div className="checkbox-field">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target)}
          disabled={disabled}
          required={required}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && <div className="input-error">{error}</div>}
    </div>
  );
}
