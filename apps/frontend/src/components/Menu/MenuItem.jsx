import { getDescription } from "../../helpers/getDescription.js"
import "./MenuItem.css"

export function MenuItem ({imageUrl, itemName, price}) {
    return (
        <div className="menuitem-wrapper">
            <figure className="item-image">
                <img src={imageUrl} alt={getDescription(imageUrl)} />
            </figure>
            <p className="item-name">{itemName}</p>
            <p className="item-price">£ {price}</p>
            <button className="item-order">Add to cart</button>
        </div>
    )
}