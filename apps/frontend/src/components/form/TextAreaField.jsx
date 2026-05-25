import toSnakeCase from "../../utils/toSnakeCase.js";

export default function TextAreaField({
  name: providedName,
  label,
  value,
  onChange,
  error,
  placeholder = "",
  disabled = false,
  required = false,
  rows = 4,
  min = 0
}) {
  const name = providedName || toSnakeCase(label);
  const id = name;

  return (
    <div className="input-field">
     {label && <label htmlFor={id}>{label}{required? "*": ""} : </label>}

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        minLength={min}
      />

      {error && <div className="input-error">{error}</div>}
    </div>
  );
}
