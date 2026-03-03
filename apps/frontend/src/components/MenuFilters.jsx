import "../styles/MenuFilters.css"
export function MenuFilters({
  itemtype,
  categories = [],
  filtered,
  searchTerm,
  onFilterChange,
  onSearch,
  onBlur
}) {

  const hasCategories = categories.length > 0

  function formatCategory(categoryName) {
    return categoryName
      .replaceAll("-", " ")
      .split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <div className="filter-wrapper">
      {hasCategories && <select value={filtered} onChange={(e) => onFilterChange(e.target.value)}>
        {categories.map((category) => (
          <option key={category} value={category}>
            {formatCategory(category)}
          </option>
        ))}
      </select>}

      <input
        type="search"
        value={searchTerm}
        placeholder={
          filtered === "all"
            ? `Search all ${itemtype}`
            : `Search ${filtered.replaceAll("-", " ")}`
        }
        onInput={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
