import { getDescription } from "../../utils/getDescription.js"
import "./MenuItem.css"
import placeholder from "../../assets/placeholders/no-photo.png"
import useCartStore from "../../store/useCartStore.js"
import { Link } from "react-router-dom";

export function MenuItem ({imageUrl, value}) {
    const openCart = useCartStore(state => state.openCart);
    const {name, price} = value;
    const item = {...value, url: imageUrl}
    const addItem = useCartStore(state => state.addItem)
    return (
        <div className="menuitem-wrapper">
            <figure className="item-image">
                <img src={imageUrl} onError={(e) =>
                    {
                        if (e.target.src !== placeholder){
                            e.target.src = placeholder;
                        }
                    }
                } alt={getDescription(imageUrl)} />
            </figure>
            <p className="item-name">{name}</p>
            <p className="item-price">£ {price}</p>
            <Link to="/cart">
            <button className="item-order"
                onClick={() =>{ addItem(item); openCart()}}
            >Add to cart</button>
            </Link>
        </div>
    )
}