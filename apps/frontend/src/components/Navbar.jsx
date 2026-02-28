import { Link } from "react-router-dom";
import logo from "../assets/brand/CoffeeShop.png"
import "../styles/Navbar.css"

function Navbar() {
    return (
        <header className="header">
            <div className="logo-container">
            <Link to="/">
                <img id="logo" src={logo} alt="coffee shop logo"/>
            </Link>
            </div>
            <button className="hamburger">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
            <nav className="nav-link">
                <Link to="/" className="hover:opacity-80 transition">Home</Link>
                <Link to="/menu" className="hover:opacity-80 transition">Menu</Link>
                <Link to="/contact" className="hover:opacity-80 transition">Contact</Link>
            </nav> 
        </header>
    )
}
export default Navbar;