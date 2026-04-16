import { Link } from "react-router-dom"
import logo from "../assets/brand/CoffeeShop.png"
import "../styles/UnauthenticatedLayout.css"
export default function AuthNav() {
    return (
        <div className="header-wrapper">
            <header className="header">
                <div className="logo-container">
                    <Link to="/">
                        <img id="logo" src={logo} alt="coffee shop logo" />
                    </Link>
                </div>
                <Link to="/help" className="auth-link">Need Help?</Link>
            </header>
        </div>

    )
}