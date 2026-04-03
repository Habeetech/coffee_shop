import toSnakeCase from "../utils/toSnakeCase";

export default function SelectField({
  name: providedName,
  label,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  required = false
}) {
  const name = providedName || toSnakeCase(label);
  const id = name;

  return (
    <div className="input-field">
      <label htmlFor={id}>{label}</label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target)}
        disabled={disabled}
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <div className="input-error">{error}</div>}
    </div>
  );
}
