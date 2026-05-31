import useNotificationStore from "../../store/useNotificationStore.js"
import { useNavigate } from "react-router-dom";
import bellIcon from "../../assets/icons/bell.png"
import { getDescription } from "../../utils/getDescription.js";

export default function NotificationIcon() {
    const navigate = useNavigate();
    const unread = useNotificationStore(s => s.unread);

    return (
        <button
            className={`bell-btn  ${unread.length > 0 ? "unread": ""}`}
            onClick={() => navigate("/notification")}
        ><figure className="notification-icon-wrapper">
                <img className="bell-icon" src={bellIcon} alt={getDescription(bellIcon)} />
            </figure>
           {(unread.length > 0) && <div className="msg-count"
            aria-live="polite"
            >{unread.length}</div>}
        </button>

    )
}