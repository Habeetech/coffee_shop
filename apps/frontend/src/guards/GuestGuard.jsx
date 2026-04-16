import useUserStore from "../store/useUserStore.js"
import { Link, Outlet, Navigate } from "react-router-dom";


export default function GuestGuard() {
    const user = useUserStore((state) => state.user);
    if (user) {
        return <Navigate
            to="/" replace />
    }

    return <Outlet />
}