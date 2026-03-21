import "./ModalOverlay.css"
import { motion } from "framer-motion";

export default function ModalOverlay({ children, onClose, className = "" }) {
  return (
    <motion.div
      className={`shared-overlay ${className}`}
      initial={{ "--bg-opacity": "0%" }}
      animate={{ "--bg-opacity": "60%" }}
      exit={{ "--bg-opacity": "0%" }}
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