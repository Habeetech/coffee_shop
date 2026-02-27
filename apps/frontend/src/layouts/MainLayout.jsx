import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function MainLayout() {
    return (
        <div className="main-layout">
        <Navbar />
        <Outlet />
        <Footer />
        </div>
    )
}

export default MainLayout;