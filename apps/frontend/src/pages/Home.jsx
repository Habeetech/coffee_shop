import { useEffect } from "react";
import "../styles/Home.css"
import { Carousel } from "../components/Carousel.jsx";
import { Menu } from "../components/Menu.jsx";
function Home() {
    return (
        <>
            <main className="container">
                <div className="welcome-text">
                    <p>Start your day with an excellent cup of coffee expertly crafted by our highly skilled Barista.
                        Have it hot, cold, swap the milk, add syrups or sauces to suite your pallete.
                        Accompany it with hot sandwiches and sweet treats, buscuit and impulses.
                        We've got you covered from every end.
                    </p>
                </div>
                <div className="promotion">
                    <Carousel />
                </div>
                <div className="home-menu">
                    <Menu />
                </div>
            </main>
        </>
    )
}

export default Home;