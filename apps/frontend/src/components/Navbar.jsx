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

function Navbar() {
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
                    <Link to="/">
                        <img id="logo" src={logo} alt="coffee shop logo" />
                    </Link>
                </div>
                <div className="toplevel-icon">
                    {!showMenu ? <button className="hamburger" onClick={() => setShowMenu(prev => !prev)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button> : <button className="hamburger close" onClick={() => setShowMenu(prev => !prev)}>
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                            <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                    }
                    <div className="cart-icon-container">
                            <CartIcon />
                    </div>
                </div>
            </header>
            <nav className={`navbar ${showMenu == false ? "hidden" : ""}`}>
                <Link to="/"><img className="navbar-icon" src={homeIcon} alt={getDescription(homeIcon)} /></Link>
                <Link to="/menu"><img className="navbar-icon" src={menuIcon} alt={getDescription(menuIcon)} /></Link>
                {user && <Link to="/profile"><img className="navbar-icon" src={profileIcon} alt={getDescription(profileIcon)} /></Link>}
                {!user && <Link to="/login"><img className="navbar-icon" src={loginIcon} alt={getDescription(loginIcon)} /></Link>}
                {user && <button
                 onClick={handleLogoutClick}>
                    <img className="navbar-icon" src={logoutIcon} alt={getDescription(logoutIcon)} /></button>}
                <a href="#contact"><img className="navbar-icon" src={contactIcon} alt={getDescription(contactIcon)} /></a>
            </nav>
        </div>
    )
}
export default Navbar;