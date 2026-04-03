import PaymentTile from "./PaymentTile.jsx";
export default function PaymentTileGroup({ options, selected, onSelect }) {
  return (
    <div className="payment-options">
      {options.map(opt => (
        <PaymentTile
          key={opt.value}
          label={opt.label}
          icon={opt.icon}
          value={opt.value}
          selected={selected === opt.value}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
