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

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
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
                        <Link to="/cart">
                            <CartIcon />
                        </Link>
                    </div>
                </div>
            </header>
            <nav className={`navbar ${showMenu == false ? "hidden" : ""}`}>
                <Link to="/"><img className="navbar-icon" src={homeIcon} alt={getDescription(homeIcon)} /></Link>
                <Link to="/menu"><img className="navbar-icon" src={menuIcon} alt={getDescription(menuIcon)} /></Link>
                {isLogin && <Link to="/profile"><img className="navbar-icon" src={profileIcon} alt={getDescription(profileIcon)} /></Link>}
                {!isLogin && <Link to="/login"><img className="navbar-icon" src={loginIcon} alt={getDescription(loginIcon)} /></Link>}
                {isLogin && <Link to="/logout"><img className="navbar-icon" src={logoutIcon} alt={getDescription(logoutIcon)} /></Link>}
                <a href="#contact"><img className="navbar-icon" src={contactIcon} alt={getDescription(contactIcon)} /></a>
            </nav>
        </div>
    )
}
export default Navbar;