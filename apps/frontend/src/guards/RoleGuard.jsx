import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "../store/useUserStore";

export default function RoleGuard({ allowed }) {
    const user = useUserStore(state => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowed.includes(user.role)) {
        return <Navigate to="/profile/dashboard" replace />;
    }

    return <Outlet />;
}
