import { MenuItem } from "./MenuItem.jsx";

import "./MenuList.css"
export function MenuList({ noResults, filtered, searchTerm, items }) {
  
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
            value={item}
          />
        ))
      )}
    </div>
  )
}