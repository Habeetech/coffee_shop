import { getDescription } from "../../utils/getDescription.js";
import "./MenuItem.css";
import placeholder from "../../assets/placeholders/no-photo.png";
import useCartStore from "../../store/useCartStore.js";
import useOptionsStore from "../../store/useOptionsStore.js";
import useFavoritesStore from "../../store/useFavoritesStore.js";
import { Heart } from "lucide-react";
import api from "../../api/api.js"

export function MenuItem({ value }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const openCart = useCartStore(state => state.openCart);
    const addItem = useCartStore(state => state.addItem);
    const openModal = useOptionsStore(state => state.openModal);
    const allOptions = useOptionsStore(state => state.options);
    const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
    const favorites = useFavoritesStore(state => state.favorites);
    const { name, price, type, url } = value;
    const imageUrl= !url ? placeholder : `${API_URL}/images${url}`;
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
            basePrice: base,
            price: base,
            options: defaultOptions
        };

        addItem(itemToCart);
        openCart();
    };

    const handleCustomise = () => {
        openModal(value);
    };

    return (
        <div className="menuitem-wrapper">
            <button
                className="add-to-favorite"
                onClick={() => toggleFavorite(value._id)}
            >{(favorites?.some(item => item._id === value._id))
                ?
                <Heart
                    size="2em"
                    fill="var(--coffee-darker)"
                /> :
                <Heart
                    size="2em"
                />}
            </button>
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
                    Quick Add
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