import { Link } from "react-router-dom";
import logo from "../assets/brand/CoffeeShop.png"
import "../styles/Navbar.css"
import { useState } from "react";

function Navbar() {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className="header-wrapper">
            <header className="header">
                <div className="logo-container">
                    <Link to="/">
                        <img id="logo" src={logo} alt="coffee shop logo" />
                    </Link>
                </div>
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
            </header>
            <nav className={`navbar ${showMenu == false ? "hidden" : ""}`}>
                <Link to="/" className="navbar-link">Home</Link>
                <Link to="/menu" className="navbar-link">Menu</Link>
                <a href="#contact" className="navbar-link">Contact</a>
            </nav>
        </div>
    )
}
export default Navbar;