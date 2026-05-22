import { AnimatePresence, motion } from "framer-motion"
import ModalOverlay from "../../options/ModalOverlay.jsx"
import CloseModal from "../../buttons/CloseModal.jsx"


export default function SettingsModal({ children, onClose }) {
    return (
        <ModalOverlay
            onClose={onClose}
            children={
                <AnimatePresence>
                    <motion.div
                        className="settings-modal"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                        <CloseModal
                        onClose={onClose}
                        className="close"
                        />
                        {children}
                    </motion.div>
                </AnimatePresence>
            }
        />
    )
}