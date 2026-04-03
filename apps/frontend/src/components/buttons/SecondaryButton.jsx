import "./buttons.css"
export default function SecondaryButton({
  children,
  onClick,
  type = "button",
  disabled = false
}) {
  return (
    <button
      type={type}
      className="btn btn-secondary"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
