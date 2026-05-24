import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom"
import useUserStore from "../store/useUserStore";
import Spinner from "../components/Spinner.jsx"
import api from "../api/api.js";
import useFavoritesStore from "../store/useFavoritesStore.js";


export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const { user, setUser, token, setToken } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("")
    const [userDetails, setUserDetails] = useState({
        username: "",
        password: ""
    })
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const reason = searchParams.get("reason");

    useEffect(() => {
        if (reason === "expired")
            setError("Your session has timed out. Please log in again.")
    }, [reason])

    const handleLogin = async (e) => {
    e.preventDefault();
    if (!userDetails.username || !userDetails.password) return;

    setIsLoading(true);
    setError("");

    api.post("/api/auth/login", {
        usernameOrEmail: userDetails.username,
        password: userDetails.password
    })
    .then(res => {
        const data = res.data; 
        setUser(data?.user);
        setToken(data?.token);
        useFavoritesStore.getState().syncFavorites();
        if (data.user) {
            navigate(from, { replace: true });
        }
    })
    .catch(err => {
        const message = err.response?.data?.message || "Login Failed: Unable to login";
        setError(message);
    })
    .finally(() => setIsLoading(false));
};
    return (
        <main className="login-container">
            <div className="login-section">
                {error && <div className="error"
                    role="alert"
                >{error}</div>}
                <form className="login-form"
                    onSubmit={(e) => handleLogin(e)}
                >
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username or email"
                        value={userDetails.username}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={userDetails.password}
                        onChange={(e) => setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    />
                    <button
                        className="login-btn"
                        type="submit"
                        disabled={isLoading}
                    >Log in {isLoading ? <Spinner size="1rem" /> : ""}</button>
                </form>
                <p className="password-reset">Forgot your password?
                    <Link to="/reset-password">
                        <button
                            className="password-reset-btn"
                        >Reset your password</button>
                    </Link></p>
                <Link
                    to="/register"
                    className="register-link">
                    <button className="register-link-btn"
                    >Create new account</button>
                </Link>
            </div>
        </main>
    )
} 