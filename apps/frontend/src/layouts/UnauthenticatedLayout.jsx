import { Outlet } from "react-router-dom"
import "../styles/UnauthenticatedLayout.css"
import AuthFooter from "../components/AuthFooter.jsx"
import AuthNav from "../components/AuthNav.jsx"
export default function UnAuthenticatedLayout () {
    return(<div className="unauthenticated-layout">
        <AuthNav />
        <Outlet />
        <AuthFooter />
    </div>)
} 