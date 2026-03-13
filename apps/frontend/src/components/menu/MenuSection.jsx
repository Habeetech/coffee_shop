import { useEffect, useState } from "react";
import { MenuList} from "./MenuList.jsx"
import { MenuFilters } from "./MenuFilters.jsx";
import "./MenuSection.css"

export function MenuSection({ itemtype, items, categories = [] }) {
    const [filtered, setFiltered] = useState(categories[0] ?? "all");
    const [searchedResults, setSearchedResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setFiltered(categories[0] ?? "all");
        setSearchTerm("");
        setSearchedResults([]);
        setNoResults(false);
    }, [items]);

    const handleSearch = (searchItem) => {
        const term = searchItem.toLowerCase();

        let result =
            filtered === "all"
                ? items.filter((item) => item.name.toLowerCase().includes(term))
                : items
                    .filter((item) => item.category === filtered)
                    .filter((item) => item.name.toLowerCase().includes(term));

        if (result.length > 0) {
            setSearchedResults(result);
            setNoResults(false);
            return;
        }

        if (searchItem.trim() === "") {
            setSearchedResults([]);
            setNoResults(false);
            return;
        }

        setSearchedResults([]);
        setNoResults(true);
    };

    const displayedItems =
        searchedResults.length > 0
            ? searchedResults
            : items.filter(
                (item) => filtered === "all" || item.category === filtered
            );

    return (
        <>

         <MenuFilters
                itemtype={itemtype}
                categories={categories}
                filtered={filtered}
                searchTerm={searchTerm}
                onFilterChange={(value) => {
                    setFiltered(value);
                    setSearchTerm("");
                    setSearchedResults([]);
                    setNoResults(false);
                }}
                onSearch={(value) => {
                    setSearchTerm(value);
                    handleSearch(value);
                }}
            />
            <MenuList
                items={displayedItems}
                noResults={noResults}
                searchTerm={searchTerm}
                filtered={filtered}
            />

        </>
    );
}
