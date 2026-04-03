import "./buttons.css"
export default function DangerButton({
  children,
  onClick,
  type = "button",
  disabled = false
}) {
  return (
    <button
      type={type}
      className="btn btn-danger"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
