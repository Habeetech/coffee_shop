import "./buttons.css"
export default function TextButton({
  children,
  onClick,
  type = "button",
  disabled = false
}) {
  return (
    <button
      type={type}
      className="btn btn-text"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
