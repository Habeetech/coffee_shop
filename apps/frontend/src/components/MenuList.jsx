import { MenuItem } from "./MenuItem.jsx";
import "../styles/MenuList.css"
export function MenuList ({noResults, filtered, searchTerm, items}) {
    return (
        <div className="menu-items">
        {noResults ? (
          filtered === "all" ? (
            `No items found for "${searchTerm}"`
          ) : (
            `No items found for "${searchTerm}" in ${filtered.replaceAll(
              "-",
              " "
            )}`
          )
        ) : (
          items.map((item) => (
            <MenuItem
              key={item.id}
              imageUrl={item.url}
              itemName={item.name}
              price={item.price}
            />
          ))
        )}
      </div>
    )
}