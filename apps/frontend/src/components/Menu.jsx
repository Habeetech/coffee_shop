import { useState } from "react"
import "../styles/Menu.css"
import { MenuItem } from "./MenuItem";

const drinks  = [
    {
        id: 1,
        name: "Flatwhite",
        url: "example/path.png",
        price: 3.45
    },
    {
        id: 2,
        name: "Latte",
        url: "example/path.png",
        price: 3.99
    },
    {
        id: 3,
        name: "Mocha",
        url: "example/path.png",
        price: 4.65
    },
    {
        id: 4,
        name: "Hot Chocolate",
        url: "example/path.png",
        price: 4.65
    },
    {
        id: 5,
        name: "Americano",
        url: "example/path.png",
        price: 3.65
    },
    {
        id: 6,
        name: "Macha Latte",
        url: "example/path.png",
        price: 3.99
    }
]; 
export function Menu() {
    const [activeTab, setActiveTab] = useState("drinks");
    return (
        <section className="menu-wrapper">
            <h2>Menu</h2>
            <div className="menu-tab-warpper">
                <button className={`menu-tabs ${activeTab === "drinks" ? "active" : ""}`} onClick={() => setActiveTab("drinks")}><h3>Drinks</h3></button>
                <button className={`menu-tabs ${activeTab === "sandwiches" ? "active" : ""}`} onClick={() => setActiveTab("sandwiches")}><h3>Sandwiches</h3></button>
                <button className={`menu-tabs ${activeTab === "cakes" ? "active" : ""}`} onClick={() => setActiveTab("cakes")}><h3>Cakes</h3></button>
                <button className={`menu-tabs ${activeTab === "buscuits" ? "active" : ""}`} onClick={() => setActiveTab("buscuits")}><h3>Buscuits</h3></button>
                <button className={`menu-tabs ${activeTab === "crisps" ? "active" : ""}`} onClick={() => setActiveTab("crisps")}><h3>Crisps</h3></button>
                </div>
                <div className="menu-section">
                    {activeTab === "drinks" ? <div className="menu-items">
                        {drinks.map((drink) => (<MenuItem 
                            key={drink.id}
                            imageUrl={drink.url}
                            itemName={drink.name}
                            price={drink.price}
                            />) )}
                    </div> :
                        activeTab === "sandwiches" ? <div className="menu-items">List of sandwiches</div> :
                            activeTab === "cakes" ? <div className="menu-items">List of cakes</div> :
                                activeTab === "buscuits" ? <div className="menu-items">List of Buscuits</div> :
                                    activeTab === "crisps" ? <div className="menu-items">List of Crisps</div> : () => setActiveTab("drinks")
                    }
            </div>
        </section>
    )
}