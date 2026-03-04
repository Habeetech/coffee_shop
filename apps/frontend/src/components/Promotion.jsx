import "./Promotion.css"

export function Promotion({ url, description }) {
    return (
            <figure className="promotion-img-wrapper">
                <img src={url} alt={description} className="promotion-img" />
            </figure>
    );
}