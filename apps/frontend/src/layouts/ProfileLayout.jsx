import { Outlet } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import useOrderStore from "../store/useOrdersStore.js"

function ProfileLayout() {
    const { fetchOrders, hasHydrated } = useOrderStore();
    const hasFetched = useRef(false);
    useEffect(() => {
        if (hasHydrated && !hasFetched.current) {
            fetchOrders();
            hasFetched.current = true;
        }

    }, [hasHydrated])
    return (
        <Outlet />
    )
}

export default ProfileLayout;