import ModalOverlay from "../options/ModalOverlay.jsx"
import maleIcon from "../../assets/placeholders/profile-male.png"
import femaleIcon from "../../assets/placeholders/profile-female.png"
import noPhoto from "../../assets/placeholders/no-photo.png"
import { getDescription } from "../../utils/getDescription.js"
import { performLogout } from "../../service/authService.js"
import PrimaryButton from "../../components/buttons/PrimaryButton.jsx"
import { useRef, useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import useFocusTrap from "../../hooks/useFocusTrap.js"
import "./Profile.css"
export default function SideBar({ user, openSidebar, setOpenSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const current = location.pathname;
    const sidebarRef = useRef(null);

    useFocusTrap(openSidebar, sidebarRef, setOpenSidebar);
    useEffect(() => {
        document.body.style.overflow = openSidebar ? "hidden" : "";
    }, [openSidebar]);

    const handleNav = (path) => {
        navigate(`/profile/${path}`)
        setOpenSidebar(false);
    }
    const profileUrl = user?.url
        ? user.url
        : user?.gender === "male"
            ? maleIcon
            : user?.gender === "female"
                ? femaleIcon
                : noPhoto;
 


    return (
        <AnimatePresence>
            {openSidebar && (
                <motion.div
                    className="sidebar-backdrop"
                    initial={{ x: "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    onClick={() => setOpenSidebar(false)}
                     >
                    <aside
                        className="profile-sidebar"
                        onClick={(e) => e.stopPropagation()}
                        ref={sidebarRef}
                        >
                        <div className="profile-details-container">
                            <figure className="sidebar-profileImg-wrapper">
                                <img src={profileUrl} alt={getDescription(profileUrl)} />
                            </figure>
                            <div className="profile-details">
                                <p>{`Hey, ${user?.username}`}</p>
                                <p>Club Points: {user?.loyaltyPoints}</p>
                            </div>
                        </div>

                        <nav className="sidebar-nav">
                            <ul>
                                <li
                                    className={current.includes("dashboard") ? "active" : ""}
                                    onClick={() => handleNav("dashboard")}
                                >Dashboard</li>
                                <li
                                    className={current.includes("edit-profile") ? "active" : ""}
                                    onClick={() => handleNav("edit-profile")}
                                >Edit profile</li>
                                <li
                                    className={current.includes("your-orders") ? "active" : ""}
                                    onClick={() => handleNav("your-orders")}
                                >Your orders</li>
                                {(user?.role === "manager" || user?.role === "admin") && <li
                                    className={current.includes("manage-menu") ? "active" : ""}
                                    onClick={() => handleNav("manage-menu")}
                                >Manage menu</li>}
                                {(user?.role === "manager" || user?.role === "admin") && <li
                                    className={current.includes("manage-order") ? "active" : ""}
                                    onClick={() => handleNav("manage-order")}
                                >Manage order</li>}
                                <li
                                    className={current.includes("settings") ? "active" : ""}
                                    onClick={() => handleNav("settings")}
                                >Settings</li>
                            </ul>
                        </nav>

                        <PrimaryButton
                        onClick={() => {performLogout(navigate)
                            setOpenSidebar(false);
                        }
                        }
                        >Log out</PrimaryButton>
                    </aside>
                </motion.div>

            )}</AnimatePresence>

    )
}