import { useState, useEffect } from "react";
import useOptionsStore from "../../store/useOptionsStore.js";
import useCartStore from "../../store/useCartStore.js";
import OptionsItem from "./OptionsItem.jsx";
import { motion, AnimatePresence } from "framer-motion";
import ModalOverlay from "./ModalOverlay.jsx";
import "./OptionsModal.css";

export default function OptionsModal() {
    const { isOptionsOpen, selectedItem, closeModal, options: masterOptions } = useOptionsStore();
    const addItem = useCartStore(state => state.addItem);
    const openCart = useCartStore(state => state.openCart)
    const [selections, setSelections] = useState({});

    const { size: sizeList, ...extrasList } = masterOptions?.options || {};


    const handleSelect = (key, label, modifier = 0) => {
        setSelections(prev => ({
            ...prev,
            [key]: { label, modifier: Number(modifier) || 0 }
        }));
    };

    const handleConfirm = () => {
        const totalExtra = Object.values(selections).reduce((acc, curr) => {
            return acc + (Number(curr.modifier) || 0);
        }, 0);

        const base = Number(selectedItem?.price) || 0;

        const finalProduct = {
            ...selectedItem,
            url: selectedItem.url,
            basePrice: base,
            price: base + totalExtra,
            options: Object.fromEntries(
                Object.entries(selections).map(([k, v]) => [k, v.label])
            ),
        };

        addItem(finalProduct);
        closeModal();
        openCart();
    };

    useEffect(() => {
        if (selectedItem && sizeList) {
            const defaultSize = sizeList.find(s => s.label === "Small") || sizeList[0];
            setSelections({
                size: {
                    label: defaultSize?.label || "Small",
                    modifier: Number(defaultSize?.priceModifier) || 0
                }
            });
        }
    }, [selectedItem, sizeList]);


    const isReady = !!selections?.size?.label;

    return (
        <AnimatePresence>
            {isOptionsOpen && selectedItem && (
                <ModalOverlay onClose={closeModal} className="center-flex">
                    <motion.div
                        className="customizemenu-panel"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                           <button
              className="option-close"
              aria-label="Close Modal"
              onClick={(e) => {
                e.stopPropagation()
                closeModal();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
                        <h3 className="modal-header">Customize {selectedItem?.name}</h3>

                        <div className="size-selector">
                            <h4>Pick a Size:</h4>
                            <div className="size-buttons">
                                {sizeList?.map((s) => (
                                    <button
                                        key={s._id}
                                        className={`size-btn ${selections.size?.label === s.label ? "active" : ""}`}
                                        onClick={() => handleSelect("size", s.label, s.priceModifier)}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="extras-selector">
                            {Object.entries(extrasList).map(([key, values]) => (
                                <OptionsItem
                                    key={key}
                                    optionKey={key}
                                    values={values}
                                    onSelect={(k, val, mod) => handleSelect(k, val, mod)}
                                    selectedValue={selections[key]?.label || ""}
                                />
                            ))}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="confirm-btn"
                                onClick={handleConfirm}
                                disabled={!isReady}
                            >
                                Confirm (£{(Number(selectedItem.price) + Object.values(selections).reduce((a, c) => a + (c.modifier || 0), 0)).toFixed(2)})
                            </button>
                            <button className="cancel-btn" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </ModalOverlay>
            )}
        </AnimatePresence>
    );
}