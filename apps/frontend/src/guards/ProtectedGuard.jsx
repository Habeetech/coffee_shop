import useUserStore from "../store/useUserStore.js"
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";


export default function ProtectedGuard () {
 const  { user, setUser } = useUserStore();
 const location = useLocation();
 if(user) {
    return <Outlet />
 }
 return <Navigate 
 to="/login"
 state={{ from: location }} replace
 />
}