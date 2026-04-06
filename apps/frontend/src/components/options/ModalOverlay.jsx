import { useEffect, useRef } from "react";
import "./ModalOverlay.css"
import { motion } from "framer-motion";
import useFocusTrap from "../../hooks/useFocusTrap";




export default function ModalOverlay({ children, onClose, className = "" }) {
 const overlayRef = useRef(null);
  useFocusTrap(true, overlayRef , onClose);
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => document.body.style.overflow = "";
  }, [])
  return (
    <motion.div
      className={`shared-overlay ${className}`}
      initial={{ "--bg-opacity": "0%" }}
      animate={{ "--bg-opacity": "60%" }}
      exit={{ "--bg-opacity": "0%" }}
      ref={overlayRef}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}
        className="overlay-child"
      >
        {children}
      </div>
    </motion.div>
  );
}