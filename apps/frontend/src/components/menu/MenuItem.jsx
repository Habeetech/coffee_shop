import { getDescription } from "../../utils/getDescription.js";
import "./MenuItem.css";
import placeholder from "../../assets/placeholders/no-photo.png";
import useCartStore from "../../store/useCartStore.js";
import useOptionsStore from "../../store/useOptionsStore.js";

export function MenuItem({ imageUrl, value }) {
    const openCart = useCartStore(state => state.openCart);
    const addItem = useCartStore(state => state.addItem);
    const openModal = useOptionsStore(state => state.openModal);
    const allOptions = useOptionsStore(state => state.options);

    const { name, price, type } = value;

    const handleQuickAdd = () => {
        const base = Number(price) || 0;
        let defaultOptions = {};
        if (type === "drinks" && allOptions?.options?.size) {
            const smallOption = allOptions.options.size.find(
                opt => opt.label === "Small"
            );
            if (smallOption) {
                defaultOptions = { size: smallOption };
            }
        }

        const itemToCart = {
            ...value,
            url: imageUrl,
            basePrice: base,
            price: base,
            options: defaultOptions
        };

        addItem(itemToCart);
        openCart();
    };

    const handleCustomise = () => {
        openModal({ ...value, url: imageUrl });
    };

    return (
        <div className="menuitem-wrapper">
            <figure className="menuitem-image">
                <img
                    src={imageUrl}
                    onError={(e) => {
                        if (e.target.src !== placeholder) {
                            e.target.src = placeholder;
                        }
                    }}
                    alt={getDescription(imageUrl)}
                />
            </figure>

            <p className="menuitem-name">{name}</p>
            <p className="menuitem-price">£ {Number(price).toFixed(2)}</p>

            <div className="orderitem-btn-wrapper">
                <button
                    className="orderitem-btn"
                    onClick={handleQuickAdd}
                >
                    Add to cart
                </button>

                {type === "drinks" && (
                    <button
                        className="orderitem-btn"
                        onClick={handleCustomise}
                    >
                        Customise
                    </button>
                )}
            </div>
        </div>
    );
}