import { useState, useEffect } from "react";
import useOptionsStore from "../../store/useOptionsStore.js";
import useCartStore from "../../store/useCartStore.js";
import OptionsItem from "./OptionsItem.jsx";
import { motion, AnimatePresence } from "framer-motion";
import ModalOverlay from "./ModalOverlay.jsx";
import "./OptionsModal.css";
import CloseModal from "../buttons/CloseModal.jsx";

export default function OptionsModal() {
    const { isOptionsOpen, selectedItem, closeModal, options: masterOptions } = useOptionsStore();
    const addItem = useCartStore(state => state.addItem);
    const openCart = useCartStore(state => state.openCart)
    const [selections, setSelections] = useState({});

    const { size: sizeList, extras: extrasList, ...others } = masterOptions?.options || {};
    console.log("extras", extrasList);
    console.log("others", others);

    const handleClose = (e) => {
        e.stopPropagation()
        closeModal();
    }
    const handleSelect = (key, label, modifier = 0, id, isExtra = false) => {
        if (!isExtra) {
            setSelections(prev => ({
                ...prev,
                [key]: { label, modifier: Number(modifier) || 0, id }
            }));
            return;
        }
        setSelections(prev => {
            const existing = prev.extras || [];
            const alreadySelected = existing.some(e => e.id === id)
            let updatedExtras;
            if (alreadySelected) {
                updatedExtras = existing.filter(e => e.id !== id)
            } else {
                updatedExtras = [...existing, { label, modifier: Number(modifier), id }];
            }
            return {
                ...prev,
                extras: updatedExtras
            }
        })
    };

    const handleConfirm = () => {
        const totalWithExtras = Number(calculateCurrentTotal());
        const base = Number(selectedItem?.price) || 0;

        const finalProduct = {
            ...selectedItem,
            basePrice: base,
            price: totalWithExtras,
            options: {
                ...Object.entries(selections)
                    .filter(([key]) => key !== 'extras')
                    .reduce((obj, [key, val]) => {
                        obj[key] = {
                            label: val.label,
                            _id: val.id,
                            priceModifier: val.modifier
                        };
                        return obj;
                    }, {}),


                extras: (selections.extras || []).map(e => ({
                    label: e.label,
                    _id: e.id,
                    priceModifier: e.modifier
                }))
            }
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
                    modifier: Number(defaultSize?.priceModifier) || 0,
                    id: defaultSize?._id
                }
            });
        }
    }, [selectedItem, sizeList]);


    const isReady = !!selections?.size?.label;
    const calculateCurrentTotal = () => {
        const base = Number(selectedItem?.price) || 0;
        const extraCharges = Object.entries(selections).reduce((acc, [key, value]) => {
            if (key === 'extras' && Array.isArray(value)) {
                return acc + value.reduce((sum, e) => sum + (Number(e.modifier) || 0), 0);
            }
            return acc + (Number(value.modifier) || 0);
        }, 0);

        return (base + extraCharges).toFixed(2);
    };
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
                        <CloseModal
                            className="close-modal"
                            onClose={handleClose}
                        />
                        <h3 className="modal-header">Customize {selectedItem?.name}</h3>

                        <div className="size-selector">
                            <h4>Pick a Size:</h4>
                            <div className="size-buttons">
                                {sizeList?.map((s) => (
                                    <button
                                        key={s._id}
                                        className={`size-btn ${selections.size?.label === s.label ? "active" : ""}`}
                                        onClick={() => handleSelect("size", s.label, s.priceModifier, s._id)}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="others-selector">
                            {Object.entries(others || {}).map(([key, values]) => (
                                <OptionsItem
                                    key={key}
                                    optionKey={key}
                                    values={values}
                                    onSelect={(k, val, mod, id) => handleSelect(k, val, mod, id)}
                                    selectedValue={selections[key]?.label || ""}
                                />
                            ))}
                        </div>

                        <div className="extras-selector">
                            <h4>Extras: </h4>
                            <div className="extras">
                                {Array.isArray(extrasList) && extrasList.map((value) => (
                                    <label className="extras-item" key={value._id}>
                                        <input
                                            type="checkbox"
                                            checked={selections.extras?.some(e => e.id === value._id) || false}
                                            onChange={() =>
                                                handleSelect(
                                                    "extras",
                                                    value.label,
                                                    value.priceModifier,
                                                    value._id,
                                                    true
                                                )
                                            }
                                        />
                                        {value.label}
                                    </label>
                                ))}
                            </div>
                        </div>


                        <div className="modal-footer">
                            <button className="confirm-btn" onClick={handleConfirm} disabled={!isReady}>
                                Confirm (£{calculateCurrentTotal()})
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