export default function PaymentTile({
  label,
  icon,
  value,
  selected,
  onSelect
}) {
  return (
    <button
      type="button"
      className={`payment-tile ${selected ? "selected" : ""}`}
      onClick={() => onSelect(value)}
    >
      <figure className="paymentIcon-wrapper">
        <img src={icon} alt={label} />
        <figcaption>{label}</figcaption>
      </figure>
    </button>
  );
}
