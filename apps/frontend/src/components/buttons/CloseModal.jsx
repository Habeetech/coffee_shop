export default function CloseModal({onClose, className="modal-close"}) {
    return (<button
        className={className}
        aria-label="Close Modal"
        onClick={onClose}
    >
        <svg width="24" height="24" viewBox="0 0 24 24">
            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
        </svg>
    </button>)
}