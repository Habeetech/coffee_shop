import { MenuItem } from "./MenuItem.jsx";
import placholder from "../../assets/placeholders/no-photo.png"
import "./MenuList.css"
export function MenuList({ noResults, filtered, searchTerm, items }) {
  const API_URL = import.meta.env.VITE_API_URL;
  return (
    <div className="menu-items">
      {noResults ? (
        filtered === "all" ? (<div className="no-results">
          No items found for "{searchTerm}"
        </div>
        ) : (<div className="no-results">
          No items found for "{searchTerm}" in {filtered.replaceAll("-", " ")}
        </div>
        )
      ) : (
        items.map((item) => (
          <MenuItem
            key={item._id}
            imageUrl={!item.url ? placholder : `${API_URL}/images${item.url}`}
            itemName={item.name}
            price={item.price}
          />
        ))
      )}
    </div>
  )
}