import "./buttons.css"

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false
}) {
  return (
    <button
      type={type}
      className="btn btn-primary"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
