import { AnimatePresence, motion } from "framer-motion"
import ModalOverlay from "./options/ModalOverlay.jsx"
import CloseModal from "./buttons/CloseModal.jsx"

export default function MsgModal({ children, onClose }) {
    return (
        <ModalOverlay
            onClose={onClose}
            children={
                <AnimatePresence>
                    <motion.div
                        className="message-panel"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                        <CloseModal
                        onClose={onClose}
                        className="close-msg"
                        />
                        {children}
                    </motion.div>
                </AnimatePresence>
            }
        />
    )
}