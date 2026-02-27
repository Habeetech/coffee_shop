import { useEffect } from "react";
import "./Home.css"
import { Carousel } from "../components/Carousel.jsx";
function Home () {
    return (
        <div className="container">
            <div className="promotion">
                <Carousel />
            </div>
        </div>
    )
}

export default Home;