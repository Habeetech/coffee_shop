import toSnakeCase from "../../utils/toSnakeCase";
import "./formField.css"
export default function InputField({
    name: providedName,
    label,
    type,
    value,
    onChange,
    error,
    placeholder = "",
    disabled = false,
    required = false }) {
    const name = providedName || toSnakeCase(label)
    const id = name;
    return (<div className="input-field">
        <label htmlFor={id}>{label}{required? "*": ""} : </label>
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target)}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
        />
        {error && <div className="input-error">
            {error}
        </div>}
    </div>)
}