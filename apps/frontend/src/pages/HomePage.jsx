import { useEffect, useState } from "react";
import "../styles/HomePage.css"
import { Carousel } from "../components/Carousel.jsx";
import  MenuPage  from "./MenuPage.jsx";
import { useLocation, useSearchParams } from "react-router-dom";
import MsgModal from "../components/MsgModal.jsx";


function HomePage() {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [searchParams] = useSearchParams();
    const reason = searchParams.get("reason");
    const [msg, setMsg] = useState("")

     useEffect(() => {
        if (reason === "deletion")
            setMsg("Your account has been deleted sucessfully.")
    }, [reason])
    return (
        <>
            <main className="container">
                {msg && <MsgModal 
                    children={<span className="msg">{msg}</span>}
                    onClose={() => setMsg("")}
                />}
                
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
                    <MenuPage />
                </div>
            </main>
        </>
    )
}

export default HomePage;