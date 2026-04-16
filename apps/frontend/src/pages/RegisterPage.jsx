import { useState } from "react"
import TextButton from "../components/buttons/TextButton.jsx"
import PrimaryButton from "../components/buttons/PrimaryButton.jsx";
import api from "../api/api.js"
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../store/useUserStore";
export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const {setToken, setUser} = useUserStore();
    const [registerRequest, setRegisterRequest] = useState({
        username: "", //required
        email: "", //required
        password: "", //required
        confirmPassword: "", //required
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            country: "",
            postal: ""
        }
    })
    const [step, setStep] = useState(1);
    const [formError, setFormError] = useState(null);
    const handleNext = () => {
        const errors = {};
        if (!registerRequest.username)
            errors.username = "Username is required"
        if (!registerRequest.email)
            errors.email = "Email is required"
        if (!registerRequest.password)
            errors.password = "Password is required"
        if (!registerRequest.confirmPassword)
            errors.confirmPassword = "Confirm password is required"
        else if (registerRequest.password !== registerRequest.confirmPassword)
            errors.confirmPassword = "Password do not not match"

        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            return;
        }

        setStep(prev => prev + 1);
        setFormError(null)
        return;
    }
    const handleRequestChange = (target) => {
        setRegisterRequest(prev => ({ ...prev, [target.name]: target.value }))
    }
    const handleRequestAddressChange = (target) => {
        setRegisterRequest(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [target.name]: target.value
            }
        }))
    }
    const handleRegister = async (e) => {
        e.preventDefault();
        const payload = {
            username: registerRequest.username,
            email: registerRequest.email,
            password: registerRequest.password,
            confirmPassword: registerRequest.confirmPassword
        }
        if (registerRequest.firstName) payload.firstName = registerRequest.firstName
        if (registerRequest.lastName) payload.lastName = registerRequest.lastName
        if (registerRequest.phone) payload.phone = registerRequest.phone
        if (registerRequest.dateOfBirth) payload.dateOfBirth = new Date(registerRequest.dateOfBirth).toISOString();
        const address = {};
        if (registerRequest.address.street) address.street = registerRequest.address.street
        if (registerRequest.address.city) address.city = registerRequest.address.city
        if (registerRequest.address.state) address.state = registerRequest.address.state
        if (registerRequest.address.country) address.country = registerRequest.address.country
        if (registerRequest.address.postal) address.postal = registerRequest.address.postal

        if(Object.keys(address).length > 0) payload.address = address;
        try {
            console.log(payload);
            const res = await api.post("/api/auth/register", payload);
            const user = res.data.user
            if (user) {
                console.log(user)
                const loginRes = await api.post("/api/auth/login", {
                    usernameOrEmail: registerRequest.username,
                    password: registerRequest.password
                })
                const loggedData = loginRes.data;
                setUser(loggedData?.user);
                setToken(loggedData?.token);
                if (loggedData.token) {
                    navigate(from, { replace: true });
                }
            }
        } catch (err) {
            const msg = err?.response?.data?.message || "Unable to create account";
            setFormError({ general: msg });
            console.error("Failed to create account", msg);
        } finally {

        }
        return;
    }

    return (<main className="register-container">

        <div className="register-section">
            <form
                className="register-form"
                onSubmit={(e) => handleRegister(e)}
            >
                {
                    step === 1 && <>
                        <h2>Account Details</h2>
                        <input
                            type="text"
                            name="username"
                            value={registerRequest.username}
                            placeholder="Please provide a username"
                            onChange={(e) => handleRequestChange(e.target)}
                        />
                        {formError?.username && <p className="inline-error">{formError.username}</p>}
                        <input
                            type="text"
                            name="email"
                            value={registerRequest.email}
                            placeholder="Please provide an email"
                            onChange={(e) => handleRequestChange(e.target)}
                        />
                        {formError?.email && <p className="inline-error">{formError.email}</p>}
                        <input
                            type="password"
                            name="password"
                            value={registerRequest.password}
                            placeholder="Please provide a password"
                            onChange={(e) => handleRequestChange(e.target)}
                        />
                        {formError?.password && <p className="inline-error">{formError.password}</p>}
                        <input
                            type="password"
                            name="confirmPassword"
                            value={registerRequest.confirmPassword}
                            placeholder="Please confirm the provided password"
                            onChange={(e) => handleRequestChange(e.target)}
                        />
                        {formError?.confirmPassword && <p className="inline-error">{formError.confirmPassword}</p>}
                        <div className="nav-btn">
                            <TextButton
                                onClick={() => setStep(prev => prev - 1)}
                                disabled={step <= 1}
                            >{"<< prev"}</TextButton>
                            <TextButton
                                onClick={handleNext}
                                disabled={step === 3}
                            >{"next >>"}</TextButton>
                        </div>
                    </>
                }
                {
                    step === 2 && <>
                        <h2>Personal Information</h2>
                        <input
                            type="text"
                            name="firstName"
                            value={registerRequest.firstName}
                            placeholder="Please enter your firstname"
                            onChange={(e) => handleRequestChange(e.target)}
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={registerRequest.lastName}
                            placeholder="Please enter your lastname"
                            onChange={(e) => handleRequestChange(e.target)}
                        />
                        <input
                            type="date"
                            name="dateOfBirth"
                            max="2010-01-01"
                            value={registerRequest.dateOfBirth}
                            onChange={(e) => handleRequestChange(e.target)}
                        />
                        <input
                            type="text"
                            name="phone"
                            value={registerRequest.phone}
                            placeholder="Please enter your phone number"
                            onChange={(e) => handleRequestChange(e.target)}
                        />
                        <div className="nav-btn">
                            <TextButton
                                onClick={() => setStep(prev => prev - 1)}
                                disabled={step <= 1}
                            >{"<< prev"}</TextButton>
                            <TextButton
                                onClick={() => setStep(prev => prev + 1)}
                                disabled={step === 3}
                            >{"next >>"}</TextButton>
                        </div>
                    </>
                }
                {
                    step === 3 && <>
                        <h2>Address Information</h2>
                        <input
                            type="text"
                            name="street"
                            value={registerRequest.address.street}
                            placeholder="Please enter your street"
                            onChange={(e) => handleRequestAddressChange(e.target)}
                        />
                        <input
                            type="text"
                            name="city"
                            value={registerRequest.address.city}
                            placeholder="Please enter your city"
                            onChange={(e) => handleRequestAddressChange(e.target)}
                        />
                        <input
                            type="text"
                            name="state"
                            value={registerRequest.address.state}
                            placeholder="Please enter your state"
                            onChange={(e) => handleRequestAddressChange(e.target)}
                        />
                        <input
                            type="text"
                            name="country"
                            value={registerRequest.address.country}
                            placeholder="Please enter your country"
                            onChange={(e) => handleRequestAddressChange(e.target)}
                        />
                        <input
                            type="text"
                            name="postal"
                            value={registerRequest.address.postal}
                            placeholder="Please enter your postal code"
                            onChange={(e) => handleRequestAddressChange(e.target)}
                        />
                        <div className="nav-btn">
                            <TextButton
                                onClick={() => setStep(prev => prev - 1)}
                                disabled={step <= 1}
                            >{"<< prev"}</TextButton>
                            <TextButton
                                onClick={() => setStep(prev => prev + 1)}
                                disabled={step === 3}
                            >{"next >>"}</TextButton>

                        </div>
                        <PrimaryButton
                            type="submit"
                        >Register</PrimaryButton>

                    </>
                }
            </form>
        </div>
    </main>)
}