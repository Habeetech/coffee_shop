
export default function OptionsItem({ optionKey, values, onSelect, selectedValue }) {
    return (
        <div className="option-group">
            <select
                value={selectedValue || ""}
                onChange={(e) => {
                    const selectedOption = values.find(v => v.label === e.target.value);
                    onSelect(optionKey, e.target.value, selectedOption?.priceModifier || 0, selectedOption?._id);
                }}
            >
                <option value="">{`Choose your ${optionKey}`}</option>
                {values.map((option) => (
                    <option key={option._id} value={option.label}>
                        {option.label} {option.priceModifier > 0 ? `(+£${option.priceModifier})` : ""}
                    </option>
                ))}
            </select>
        </div>
    );
}