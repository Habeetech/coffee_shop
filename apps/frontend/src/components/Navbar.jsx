import { Link } from "react-router-dom";
import logo from "../assets/brand/CoffeeShop.png"
import homeIcon from "../assets/icons/home.png";
import loginIcon from "../assets/icons/login.png"
import logoutIcon from "../assets/icons/logout.png"
import CartIcon from "./cart/CartIcon.jsx";
import menuIcon from "../assets/icons/menu.png"
import profileIcon from "../assets/icons/profile.png"
import contactIcon from "../assets/icons/contact.png"
import { getDescription } from "../utils/getDescription.js"
import "./Navbar.css"
import { useState } from "react";
import useUserStore from "../store/useUserStore.js"
import { performLogout } from "../service/authService.js"
import { useNavigate } from "react-router-dom"
import bellIcon from "../assets/icons/bell.png"
import { AnimatePresence, motion } from "framer-motion"

function Navbar({ openSidebar, setOpenSidebar }) {
    const [showMenu, setShowMenu] = useState(false);
    const user = useUserStore(state => state.user);
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        performLogout(navigate, "/");
        setShowMenu(false);
    };

    return (
        <div className="header-wrapper">
            <header className="header">
                <div className="logo-container">
                    {!openSidebar ? <button className="hamburger" onClick={() => setOpenSidebar(prev => !prev)}>
                        <svg
                            width="4rem"
                            height="4rem"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button> : <button className="hamburger close" onClick={() => setOpenSidebar(prev => !prev)}>
                        <svg width="4rem" height="4rem" viewBox="0 0 24 24">
                            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                    }
                    <Link to="/">
                        <img id="logo" src={logo} alt="coffee shop logo" />
                    </Link>
                    <h1 className="title">CoffeeShop</h1>
                </div>
                <div className="toplevel-icon">
                    {!showMenu ? <button className="expand-btn" onClick={() => setShowMenu(prev => !prev)}>
                        <svg width="4rem" height="4rem" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="4" y1="8" x2="12" y2="16" />
                            <line x1="20" y1="8" x2="12" y2="16" />
                        </svg>
                    </button> : <button className="collapse-btn" onClick={() => setShowMenu(prev => !prev)}>

                        <svg width="4rem" height="4rem" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="4" y1="16" x2="12" y2="8" />
                            <line x1="20" y1="16" x2="12" y2="8" />
                        </svg>
                    </button>
                    }
                    <div className="cart-icon-container">
                        <CartIcon />
                    </div>
                    <div className="bell-iconwrapper">
                        <button
                            className="bell-btn"
                        >
                            <img className="bell-icon" src={bellIcon} alt={getDescription(bellIcon)} /></button>
                    </div>
                </div>
            </header>
            <AnimatePresence>
                {showMenu && (
                    <motion.nav
                        key="mobile-nav"
                        className="navbar"
                        initial={{ y: "-100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                        <Link to="/"><img className="navbar-icon" src={homeIcon} alt={getDescription(homeIcon)} /></Link>
                        <Link to="/menu"><img className="navbar-icon" src={menuIcon} alt={getDescription(menuIcon)} /></Link>
                        {user && <Link to="/profile"><img className="navbar-icon" src={profileIcon} alt={getDescription(profileIcon)} /></Link>}
                        {!user && <Link to="/login"><img className="navbar-icon" src={loginIcon} alt={getDescription(loginIcon)} /></Link>}
                        {user && (
                            <button onClick={handleLogoutClick}>
                                <img className="navbar-icon" src={logoutIcon} alt={getDescription(logoutIcon)} />
                            </button>
                        )}
                        <a href="#contact"><img className="navbar-icon" src={contactIcon} alt={getDescription(contactIcon)} /></a>
                    </motion.nav>
                )}
            </AnimatePresence>

        </div>
    )
}
export default Navbar;