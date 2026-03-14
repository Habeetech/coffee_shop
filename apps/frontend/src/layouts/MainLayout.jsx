import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CartDrawer from "../components/cart/CartDrawer.jsx"

function MainLayout() {
    return (
        <div className="main-layout">
            <CartDrawer />
        <Navbar />
        <Outlet />
        <Footer />
        </div>
    )
}

export default MainLayout;