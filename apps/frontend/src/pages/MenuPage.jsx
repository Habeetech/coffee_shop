import { useCallback, useEffect, useMemo, useState, useRef } from "react"
import "../styles/MenuPage.css"
import { MenuSection } from "../components/Menu/MenuSection";
import useMenuData from "../hooks/useMenuData";
import { CATEGORY_MAP } from "../config/categorymap.js"
import { TABS } from "../config/tabs.js"

function MenuPage() {
    const tabRefs = useRef([]);
    const [focusedIndex, setFocusedIndex] = useState(0)
    const handleKeyDown = (e, index) => {
        const total = tabRefs.current.length
        const lastIndex = total - 1;
        const next = index + 1;
        const prev = index - 1;
        if (e.key === "Home") {
            e.preventDefault();
            setFocusedIndex(0)
        }
        else if (e.key === "End") {
            e.preventDefault();
            setFocusedIndex(lastIndex)
        }
        else if (e.key === "ArrowRight") {
            setFocusedIndex((next + total) % total)
        }
        else if (e.key === "ArrowLeft") {
            setFocusedIndex((prev + total) % total)
        }
        else if (e.key === "Enter" || e.key === " ") {
            setFocusedIndex(index);
            setActiveTab(TABS[index].key)
        }
    }
    useEffect(() => {
        tabRefs.current[focusedIndex]?.focus();
    }, [focusedIndex])
    const [activeTab, setActiveTab] = useState("drinks")
    const endpoint = `http://localhost:3000/api/${activeTab}`
    const { result, isLoading, errors } = useMenuData(endpoint);
    return (
        <section className="menu-wrapper">
            <h2>Menu</h2>
            <div className="menu-tab-warpper" role="tablist">
                {

                    TABS.map((tabItem, index) => (
                        <button key={tabItem.key}
                            id={`tab-${tabItem.key}`}
                            role="tab"
                            aria-selected={activeTab === tabItem.key}
                            aria-controls={`panel-${tabItem.key}`}
                            tabIndex={focusedIndex === index ? 0 : -1}
                            className={`menu-tabs ${activeTab === tabItem.key ? "active" : ""}`}
                            ref={(el) => (tabRefs.current[index] = el)}
                            onClick={() => {
                                setActiveTab(tabItem.key)
                                setFocusedIndex(index)
                            }
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        >
                            {tabItem.label}
                        </button>
                    ))
                }
            </div>
            <div
                role="tabpanel"
                id={`panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
                className="menu-section"
                aria-hidden="false"
            >
                {
                    isLoading ? <div className="spinner"></div>
                        : errors ? <div className="error">
                            <p>{`An error occured: Could not get ${activeTab} from the server`}</p>
                            <button className="close" >X</button>
                        </div> :
                            <MenuSection
                                key={activeTab}
                                itemtype={activeTab}
                                items={result}
                                categories={CATEGORY_MAP[activeTab]}
                            />}
            </div>
        </section>
    )
}
export default MenuPage;