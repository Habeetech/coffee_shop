import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CartDrawer from "../components/cart/CartDrawer.jsx"
import OptionsModal from "../components/options/OptionsModal.jsx";
import { useEffect } from "react";
import useOptionsStore from "../store/useOptionsStore.js";
import useIdleTimer from "../hooks/useIdleTimer.js";



function MainLayout() {
    useIdleTimer();

const { fetchOptions, hasHydrated, isLoading, options } = useOptionsStore();

    useEffect(() => {
        const noOptions = Object.keys(options || {}).length === 0;
        if (noOptions && !isLoading && hasHydrated){
            fetchOptions();
        }
    }, [fetchOptions, isLoading, hasHydrated, options]);
    return (
        <div className="main-layout">
            <CartDrawer />
            <OptionsModal />
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    )
}

export default MainLayout;