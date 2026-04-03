import toSnakeCase from "../utils/toSnakeCase";

export default function TextAreaField({
  name: providedName,
  label,
  value,
  onChange,
  error,
  placeholder = "",
  disabled = false,
  required = false,
  rows = 4
}) {
  const name = providedName || toSnakeCase(label);
  const id = name;

  return (
    <div className="input-field">
      <label htmlFor={id}>{label}</label>

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
      />

      {error && <div className="input-error">{error}</div>}
    </div>
  );
}
