import { useState } from "react"
import "../styles/MenuPage.css"
import { MenuSection } from "../components/Menu/MenuSection";

const drinks = [
    {
        id: 1,
        name: "Flatwhite",
        url: "example/path.png",
        price: 3.45,
        category: "hot-coffee"
    },
    {
        id: 2,
        name: "Latte",
        url: "example/path.png",
        price: 3.99,
        category: "hot-coffee"
    },
    {
        id: 3,
        name: "Mocha",
        url: "example/path.png",
        price: 4.65,
        category: "hot-coffee"
    },
    {
        id: 4,
        name: "Hot Chocolate",
        url: "example/path.png",
        price: 4.65,
        category: "tea"
    },
    {
        id: 5,
        name: "Americano",
        url: "example/path.png",
        price: 3.65,
        category: "hot-coffee"
    },
    {
        id: 6,
        name: "Iced Latte",
        url: "example/path.png",
        price: 3.99,
        category: "iced-coffee"
    },
    {
        id: 7,
        name: "Mango Passion Fruit Cooler",
        url: "example/path.png",
        price: 3.20,
        category: "smoothies"
    },
    {
        id: 8,
        name: "Peach Iced Tea",
        url: "example/path.png",
        price: 3.99,
        category: "iced-tea"
    },
    {
        id: 9,
        name: "Salted Caramel Frappe",
        url: "example/path.png",
        price: 4.95,
        category: "milkshake"
    }
];
const foods = [
    {
        id: 1,
        name: "Cajun Chicken",
        url: "example/path.png",
        price: 5.45,
        category: "non-vegetarian"
    },
    {
        id: 2,
        name: "Vegan Ham and Cheese",
        url: "example/path.png",
        price: 3.99,
        category: "vegan"
    },
    {
        id: 3,
        name: "Beans and Cheese",
        url: "example/path.png",
        price: 4.65,
        category: "vegetarian"
    }]
const cakes = [
    {
        id: 1,
        name: "Carrot Cake",
        url: "example/path.png",
        price: 3.99,
        category: "whole-cake"
    },
    {
        id: 2,
        name: "Lemon Drizzle Loaf",
        url: "example/path.png",
        price: 3.45,
        category: "loaf-cake"
    },
    {
        id: 3,
        name: "Millionaire Shortbread",
        url: "example/path.png",
        price: 4.65,
        category: "shortbreads"
    },
    {
        id: 4,
        name: "Cinnamon Bun",
        url: "example/path.png",
        price: 2.95,
        category: "pastries"
    }
]
const buscuits = [
    {
        id: 1,
        name: "Oaty Flapjack",
        url: "example/path.png",
        price: 1.99,
    },
    {
        id: 2,
        name: "Spicy Ginger",
        url: "example/path.png",
        price: 2.45,
    },
    {
        id: 3,
        name: "Fruit and Oat",
        url: "example/path.png",
        price: 2.65,
    },
    {
        id: 4,
        name: "Bounce Protein Ball",
        url: "example/path.png",
        price: 1.95,
    }
]
const crisps = [
    {
        id: 1,
        name: "Pombear original",
        url: "example/path.png",
        price: 1.05,
    },
    {
        id: 2,
        name: "Mature Cheddar and Onion",
        url: "example/path.png",
        price: 1.45,
    },
    {
        id: 3,
        name: "Sea Salt and Vinegar",
        url: "example/path.png",
        price: 1.45,
    },
    {
        id: 4,
        name: "Lightly Sea Salted",
        url: "example/path.png",
        price: 1.45,
    }
]
function MenuPage() {
    const [activeTab, setActiveTab] = useState("drinks");
    return (
        <section className="menu-wrapper">
            <h2>Menu</h2>
            <div className="menu-tab-warpper">
                <button className={`menu-tabs ${activeTab === "drinks" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("drinks")
                    }}

                ><h3>Drinks</h3></button>
                <button className={`menu-tabs ${activeTab === "sandwiches" ? "active" : ""}`} onClick={() => setActiveTab("sandwiches")}><h3>Sandwiches</h3></button>
                <button className={`menu-tabs ${activeTab === "cakes" ? "active" : ""}`} onClick={() => setActiveTab("cakes")}><h3>Cakes</h3></button>
                <button className={`menu-tabs ${activeTab === "buscuits" ? "active" : ""}`} onClick={() => setActiveTab("buscuits")}><h3>Buscuits</h3></button>
                <button className={`menu-tabs ${activeTab === "crisps" ? "active" : ""}`} onClick={() => setActiveTab("crisps")}><h3>Crisps</h3></button>
            </div>
            <div className="menu-section">
                {activeTab === "drinks" && (
                    <MenuSection
                        key="drinks"
                        itemtype="drinks"
                        items={drinks}
                        categories={["all", "hot-coffee", "iced-coffee", "tea", "iced-tea", "milkshake", "smoothies"]}
                    />
                )}

                {activeTab === "sandwiches" && (
                    <MenuSection
                        key="sandwiches"
                        itemtype="sandwiches"
                        items={foods}
                        categories={["all", "vegan", "vegetarian", "non-vegetarian"]}
                    />
                )}

                {activeTab === "cakes" && (
                    <MenuSection
                        key="cakes"
                        itemtype="cakes"
                        items={cakes}
                        categories={["all", "whole-cake", "loaf-cake", "pastries", "shortbreads"]}
                    />
                )}

                {activeTab === "buscuits" && (
                    <MenuSection
                        key="buscuits"
                        itemtype="buscuits"
                        items={buscuits}
                    />
                )}

                {activeTab === "crisps" && (
                    <MenuSection
                        key="crisps"
                        itemtype="crisps"
                        items={crisps}
                    />
                )}

            </div>
        </section>
    )
}
export default MenuPage;