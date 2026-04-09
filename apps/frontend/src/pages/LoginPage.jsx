import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import useUserStore from "../store/useUserStore";
import Spinner from "../components/Spinner.jsx"

export default function LoginPage() {
    const { user, setUser, token, setToken } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("")
    const [userDetails, setUserDetails] = useState({
        username: "",
        password: ""
    })
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!userDetails.username || !userDetails.password) return;
        setIsLoading(true);
        setError("")
       /*  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(5000); */


        await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usernameOrEmail: userDetails.username,
                password: userDetails.password
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else if (res.status === 500) {
                    throw new Error("Login Failed: Please try again")
                }
                else if(res.status === 400) {
                    throw new Error("Login failed: Invalid login credentials")
                }
                throw new Error("Login Failed: Unable to login")
            })
            .then(data => {
                setUser(data?.user)
                setToken(data?.token)
                if (data.user)
                    navigate("/")
            })
            .catch(e => setError(e.message))
            .finally(() => setIsLoading(false));

    }

    // if(user) navigate("/")

    return (
        <div className="login-container">
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
                    ><span>Log in </span>{isLoading ? <Spinner size="1rem" /> : ""}</button>
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
        </div>
    )
} 