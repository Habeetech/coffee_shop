export default function RadioGroup({ name, options, value, onChange, error }) {
  return (
    <div className="radio-group-container">
    <fieldset className="radio-group">
      {options.map(opt => (
        <div className="radio-option" key={opt.value}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target)}
          />
        <label>
          {opt.label}
        </label>
        </div>
      ))}
    </fieldset>
    {error && <p className="input-error">{error}</p>}
    </div>
  );
}
