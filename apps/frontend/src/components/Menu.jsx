import { useState } from "react"
import "../styles/Menu.css"
import { MenuItem } from "./MenuItem";

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
export function Menu() {
    const [activeTab, setActiveTab] = useState("drinks");
    const [filtered, setFiltered] = useState("all");
    const [searchedItem, setSearchedItem] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const displayedDrinks = searchedItem.length > 0
        ? searchedItem
        : drinks.filter(drink =>
            filtered === "all" || drink.category === filtered
        );


    const handleSearch = (searchItem, category, menu) => {
        let result = []
        if (filtered === "all") {
            result = menu.filter(item => item.name.toLowerCase().includes(searchItem.toLowerCase()))
        }
        else {
            result = menu.filter(item => item.category === category)
                .filter(item => item.name.toLowerCase().includes(searchItem.toLowerCase()));
        }
        if (result.length > 0) {
            setSearchedItem(result);
            setNoResults(false);
            return;
        }
        if (searchItem.trim() === "") {
            setSearchedItem([]);
            setNoResults(false);
            return;
        }
        setSearchedItem([])
        setNoResults(true);
    }
    return (
        <section className="menu-wrapper">
            <h2>Menu</h2>
            <div className="menu-tab-warpper">
                <button className={`menu-tabs ${activeTab === "drinks" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("drinks")
                        setSearchedItem([]);
                        setFiltered("all");
                        setSearchTerm("")
                        setNoResults(false);
                    }}

                ><h3>Drinks</h3></button>
                <button className={`menu-tabs ${activeTab === "sandwiches" ? "active" : ""}`} onClick={() => setActiveTab("sandwiches")}><h3>Sandwiches</h3></button>
                <button className={`menu-tabs ${activeTab === "cakes" ? "active" : ""}`} onClick={() => setActiveTab("cakes")}><h3>Cakes</h3></button>
                <button className={`menu-tabs ${activeTab === "buscuits" ? "active" : ""}`} onClick={() => setActiveTab("buscuits")}><h3>Buscuits</h3></button>
                <button className={`menu-tabs ${activeTab === "crisps" ? "active" : ""}`} onClick={() => setActiveTab("crisps")}><h3>Crisps</h3></button>
            </div>
            <div className="menu-section">
                {activeTab === "drinks" ? <div className="menu-items-wrapper">
                    <div className="filter-wrapper">
                        <select onChange={(e) => {
                            setFiltered(e.target.value)
                            setSearchedItem([]);
                            setNoResults(false);
                        }
                        }>
                            <option name="all" value="all" default>All</option>
                            <option name="hot-coffee" value="hot-coffee">Hot Coffee</option>
                            <option name="iced-coffee" value="iced-coffee">Iced Coffee</option>
                            <option name="tea" value="tea">Tea</option>
                            <option name="iced-tea" value="iced-tea">Iced Tea</option>
                            <option name="milkshake" value="milkshake">Milkshake</option>
                            <option name="smoothies" value="smoothies">Smoothies</option>
                        </select>
                        <input type="search"
                            value={searchTerm}
                            placeholder={filtered === "all" ? "Search all drinks" : `Search ${filtered.replaceAll("-", " ")}`}
                            onInput={(e) => {
                                setSearchTerm(e.target.value);
                                handleSearch(e.target.value, filtered, drinks);

                            }}
                            onBlur={() => { setSearchTerm(""); setSearchedItem([]); setNoResults(false); }}
                        />
                    </div>
                    <div className="menu-items">
                        {
                            noResults ? filtered === "all"
                                ? `No items found for "${searchTerm}"`
                                : `No items found for "${searchTerm}" in ${filtered.replaceAll("-", " ")}`
                                :

                                displayedDrinks.map((drink) => (<MenuItem
                                    key={drink.id}
                                    imageUrl={drink.url}
                                    itemName={drink.name}
                                    price={drink.price}
                                />))
                        }
                    </div></div> :
                    activeTab === "sandwiches" ? <div className="menu-items">List of sandwiches</div> :
                        activeTab === "cakes" ? <div className="menu-items">List of cakes</div> :
                            activeTab === "buscuits" ? <div className="menu-items">List of Buscuits</div> :
                                activeTab === "crisps" ? <div className="menu-items">List of Crisps</div> : "No active tab selected"
                }
            </div>
        </section>
    )
}