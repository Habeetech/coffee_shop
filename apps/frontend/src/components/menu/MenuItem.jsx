import { getDescription } from "../../utils/getDescription.js"
import "./MenuItem.css"
import placeholder from "../../assets/placeholders/no-photo.png"

export function MenuItem ({imageUrl, itemName, price}) {
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
            <p className="item-name">{itemName}</p>
            <p className="item-price">£ {price}</p>
            <button className="item-order">Add to cart</button>
        </div>
    )
}