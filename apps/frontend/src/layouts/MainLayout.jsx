import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CartDrawer from "../components/cart/CartDrawer.jsx"
import OptionsModal from "../components/options/OptionsModal.jsx";
import { useEffect } from "react";
import useOptionsStore from "../store/useOptionsStore.js";



function MainLayout() {
    
const fetchOptions = useOptionsStore(state => state.fetchOptions)
const isLoading = useOptionsStore(state => state.isLoading)
    useEffect(() => {
        if (!isLoading){
            fetchOptions();
        }
    }, [fetchOptions, isLoading]);
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