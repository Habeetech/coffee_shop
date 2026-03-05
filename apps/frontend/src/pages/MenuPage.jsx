import { useEffect, useState } from "react"
import "../styles/MenuPage.css"
import { foods } from "../seeds/foods.js"
import { cakes } from "../seeds/cakes.js"
import { buscuits } from "../seeds/buscuitsAndCrisps.js"
import { crisps } from "../seeds/buscuitsAndCrisps.js"
import { MenuSection } from "../components/Menu/MenuSection";


function MenuPage() {
    const [activeTab, setActiveTab] = useState("drinks");
    const [drinks, setDrinks] = useState([])

    useEffect( () => {

        fetch("http://localhost:3000/api/drinks")
        .then(res => res.json())
        .then(data => setDrinks(data))
        .catch(err => console.error(err));
        return;
    },[])
    return (
        <section className="menu-wrapper">
            <h2>Menu</h2>
            {console.log(drinks)}
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