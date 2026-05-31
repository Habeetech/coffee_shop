import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CartDrawer from "../components/cart/CartDrawer.jsx"
import OptionsModal from "../components/options/OptionsModal.jsx";
import { useEffect, useState } from "react";
import useOptionsStore from "../store/useOptionsStore.js";
import useUserStore from "../store/useUserStore.js";
import SideBar from "../components/profile/SideBar.jsx";
import TextButton from "../components/buttons/TextButton.jsx";
import { Link } from "react-router-dom"




function ProtectedLayout() {
    const [openSidebar, setOpenSidebar] = useState(false);
    const user = useUserStore(state => state.user)
    const { fetchOptions, hasHydrated, isLoading, options } = useOptionsStore();

    useEffect(() => {
        const noOptions = Object.keys(options || {}).length === 0;
        if (noOptions && !isLoading && hasHydrated) {
            fetchOptions();
        }
    }, [fetchOptions, isLoading, hasHydrated, options]);
   
    return (
        <div className="main-layout">
            <CartDrawer />
            <OptionsModal />

            <SideBar
                user={user}
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
            />
            <Navbar
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
            />
            <Outlet />
            <Footer />
        </div>
    )
}

export default ProtectedLayout;