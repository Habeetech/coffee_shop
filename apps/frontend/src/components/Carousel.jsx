import { Promotion } from "./Promotion.jsx"
import "./Carousel.css"
import buyOneGetOne from "../assets/promotions/buy-one-get-one.webp"
import sfColdCoffee from "../assets/promotions/sf-cold-coffe.jpeg"
import startYourDay from "../assets/promotions/start-your-day.jpg"
import { getDescription } from "../helpers/getDescription.js"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export function Carousel() {
    const promotions = [startYourDay, sfColdCoffee, buyOneGetOne]
    const [currentindex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const delayId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % promotions.length);
        }, 3000);

        return () => clearInterval(delayId);
    }, [])
    return (
        <section className="carousel-wrapper">
            <div className="track" style={{ transform: `translateX(-${currentindex * 100}%)` }}>
                {
                    promotions.map((value, i) => <div key={value} className="slide">
                        <Promotion url={promotions[i]} description={getDescription(promotions[i])} />
                    </div>)
                }
            </div>
            <div className="tracker">
                {
                    promotions.map((_, i) =>
                        <span key={i} className={`dot ${i === currentindex ? "active" : ""}`} ></span>
                    )
                }
            </div>
            <Link to="/menu">
                <button className="order-btn">Order Now</button>
            </Link>
        </section>
    )
}