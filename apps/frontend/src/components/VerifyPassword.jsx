import PrimaryButton from "./buttons/PrimaryButton.jsx"
import DangerButton from "./buttons/DangerButton.jsx"
import { useState } from "react";
import api from "../api/api.js";


export default function VerifyPassword({action}) {
    const [password, setPassword] = useState("")
    const [validationError, setValidationError] = useState("")
    const [isLoading, setisLoading] = useState(false);
    const handleChange = (value) => {
        setPassword(value);
        setValidationError("")
        return
    }
    const handleVerification = async (e) => {
        e.preventDefault();
        
        if (!password) {
            setValidationError("Please enter your password")
            return false;
        }
        try {
            setisLoading(true);
            const res = await api.post("/api/auth/confirm-password",
                {
                    password: password
                }
            )
            action();
            return true;
        } catch (e) {
            const msg = e?.response?.data?.message || "Unable to confirm your password. Please try again later";
            console.error(msg);
            setValidationError(msg)
            return false
        } finally {
            setisLoading(false);
        }
    }


    return (<form
                onSubmit={(e) => handleVerification(e)}
            >
                <label htmlFor="password">
                    Enter your password:
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    placeholder="Please enter your password"
                    onChange={(e) => handleChange(e.target.value)}
                />
                {validationError && <div className="inline-error">{validationError}</div>}
                <PrimaryButton
                    type="submit"
                    disabled={isLoading}
                >Confirm</PrimaryButton>
            </form>
    )
}