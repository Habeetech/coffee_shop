import { useEffect, useState } from "react";
import api from "../api/api.js";
import SpinnerWrapper from "../components/SpinnerWrapper.jsx";
import Spinner from "../components/Spinner.jsx";
import truncateString from "../utils/truncateString.js";
import TextButton from "../components/buttons/TextButton.jsx";
import "../styles/NotificationPage.css"
import OrderDetailsModal from "../components/notification/OrderDetailsModal.jsx";
import ModalOvarlay from "../components/options/ModalOverlay.jsx";
import useNotificationStore from "../store/useNotificationStore.js"


export default function NotificationPage() {
    const messages = useNotificationStore(s => s.messages)
    const isLoading = useNotificationStore(s => s.isLoading)
    const unread = useNotificationStore(s => s.unread)
    const markAsRead = useNotificationStore(s => s.markAsRead)
    const deleteNotification = useNotificationStore(s => s.deleteNotification)

    const [activeNotification, setActiveNotification] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const handleCloseModal = () => {
        setOpenModal(false);
        setActiveNotification(null);
    };

      if (isLoading) return <SpinnerWrapper spinner={<Spinner />} />;

    return (
        <div className="notifications-wrapper">
            <h3 className="notifications-heading">Messages ({unread.length})</h3>

            {messages.length === 0 ? (
                <p className="no-notifications">You haven't got any message</p>
            ) : (
                <ul className="notifications-list">
                    {messages.map((msg) => {
                        const type = msg?.payload?.eventType;
                        const tag = msg?.payload?.eventTag;
                        const orderId = msg?.payload?.eventVars?.orderId;

                        return (
                            <li key={msg._id} className={`notification-item ${msg?.isRead ? "read" : ""}`}>
                                <div className="notification-info">
                                    <span className="sender-title">
                                        {msg.senderName || "System"}
                                    </span>

                                    <span className="notification-body">
                                        {type === "order" && (
                                            <>
                                                <strong className="status-highlight">
                                                    {tag}
                                                </strong>
                                                : Order #{truncateString(orderId, 10)} status has been updated.
                                            </>
                                        )}
                                        {type === "system" && (
                                            <>
                                                <strong className="status-highlight-alert">Alert</strong>
                                                : {tag}
                                            </>
                                        )}
                                        {type === "promotion" && (
                                            <>
                                                <strong className="status-highlight-promo">Offer</strong>
                                                : Exclusive deal unlocked!
                                            </>
                                        )}
                                    </span>
                                    <span className="quick-action">
                                        <TextButton onClick={(e) => {
                                            markAsRead(msg._id)
                                            setOpenModal(true);
                                            setActiveNotification(msg);
                                        }}>
                                            View
                                        </TextButton>
                                        {!msg.isRead && <TextButton
                                            onClick={() => markAsRead(msg._id)}
                                        >Mark Read</TextButton>}
                                        <TextButton
                                            onClick={() => deleteNotification(msg._id)}
                                        >Delete</TextButton>
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {openModal && activeNotification && (
                <ModalOvarlay onClose={handleCloseModal}>
                    {(() => {
                        const currentType = activeNotification?.payload?.eventType;

                        switch (currentType) {
                            case "order":
                                return (
                                    <OrderDetailsModal
                                        orderId={activeNotification?.payload?.eventVars?.orderId}
                                        onClose={handleCloseModal}
                                    />
                                );

                            case "system":
                                return (<></>);

                            case "promotion":
                                return (<></>);

                            default:
                                return (
                                    <div className="modal-fallback">
                                        <p>Notification content details are unavailable.</p>
                                        <button onClick={handleCloseModal}>Close</button>
                                    </div>
                                );
                        }
                    })()}
                </ModalOvarlay>
            )}
        </div>
    );
}