import { useState } from "react";
import { getDescription } from "../../utils/getDescription";
import useCartStore from "../../store/useCartStore";
import useOptionsStore from "../../store/useOptionsStore";
import OptionsItem from "../options/OptionsItem";
import "./CartItem.css";

export default function CartItem({ item, isExpanded, onToggle }) {
    const { name, price, quantity, url, options: selectedOptions, notes, identityKey } = item;

    const availableOptions = useOptionsStore(state => state.options?.options || {});
    const { size: availableSizes, ...extras } = availableOptions;

    const { removeItem, increment, decrement, updateOptions, updateNotes, setExpandedId } = useCartStore();
    const [localNote, setLocalNote] = useState(notes || "");

    const handleOptionChange = (key, newValue) => {
        const updatedOptions = { ...selectedOptions, [key]: newValue };

        let totalModifier = 0;
        const selectedSizeObj = availableSizes?.find(s => s.label === updatedOptions.size);
        totalModifier += (Number(selectedSizeObj?.priceModifier) || 0);

        Object.entries(extras).forEach(([extraKey, values]) => {
            const match = values.find(v => v.label === updatedOptions[extraKey]);
            if (match) totalModifier += (Number(match.priceModifier) || 0);
        });

        const base = Number(item.basePrice) || Number(item.price) || 0;
        const newCalculatedPrice = base + totalModifier;

        const newKey = item._id + JSON.stringify(updatedOptions);


        if (isExpanded) {
            setExpandedId(newKey);
        }

        updateOptions(item, updatedOptions, newCalculatedPrice);
    };

    return (
        <div className="cartItem-container">
            <div className="cartItem-wrapper">
                <figure className="item-image-wrapper">
                    <img src={url} alt={getDescription(url)} />
                </figure>
                <div className="item-info">
                    <p className="item-name">{name}</p>
                    <p className="item-price">£{Number(price).toFixed(2)}</p>
                </div>
                <div className="quantity-wrapper">
                    <button onClick={() => decrement(item)}>-</button>
                    <p className="item-quantity">{quantity}</p>
                    <button onClick={() => increment(item)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item)}>Remove</button>
            </div>

            <button className="details-toggle-btn" onClick={onToggle}>
                {isExpanded ? "Hide Details" : "Show Details"}
            </button>

            {isExpanded && (
                <div className="cart-item-details">
                    <div className="cart-item-selectors">
                        <div className="cart-size-selector">
                            <span className="selector-label">Size:</span>
                            <div className="size-buttons">
                                {availableSizes?.map((s) => (
                                    <button
                                        key={s._id}
                                        className={`size-btn-small ${selectedOptions?.size === s.label ? "active" : ""}`}
                                        onClick={() => handleOptionChange("size", s.label)}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {Object.entries(extras).map(([key, values]) => (
                            <OptionsItem
                                key={key}
                                optionKey={key}
                                values={values}
                                selectedValue={selectedOptions ? selectedOptions[key] : ""}
                                onSelect={handleOptionChange}
                            />
                        ))}
                    </div>

                    <div className="cart-item-notes">
                        <label>Special Requests:</label>
                        <textarea
                            value={localNote}
                            onChange={(e) => setLocalNote(e.target.value)}
                            onBlur={() => updateNotes(item, localNote)}
                            maxLength={100}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}