import "./settings.css"
import PrimaryButton from "../../buttons/PrimaryButton.jsx"
import DangerButton from "../../buttons/DangerButton.jsx"
import { useState } from "react";
import api from "../../../api/api.js";


export default function ChangePassword() {
    const [step, setStep] = useState(1);
    const [result, setResult] = useState("")
    const [error, setError] = useState("")
    const [passwordForm, setPasswordForm] = useState({
        password: "",
        updatePassword: "",
        confirmPassword: ""
    })
    const [validationError, setValidationError] = useState({
        password: "",
        updatePassword: "",
        confirmPassword: ""
    })
    const handleChange = (name, value) => {
        setPasswordForm((prev) => ({ ...prev, [name]: value }))
        setValidationError((prev) => ({ ...prev, [name]: "" }))
        return
    }
    const handleValidation = async (e) => {
        e.preventDefault();
        if (!passwordForm.password) {
            setValidationError((prev) => ({ ...prev, password: "Please enter your password" }))
            return;
        }
        else if (!passwordForm.updatePassword) {
            setValidationError((prev) => ({ ...prev, updatePassword: "Please enter a new password" }))
            return;
        }
        else if (!passwordForm.confirmPassword) {
            setValidationError((prev) => ({ ...prev, confirmPassword: "Please enter the new password again" }))
            return;
        }
        else if (passwordForm.updatePassword != passwordForm.confirmPassword) {
            setValidationError((prev) => ({ ...prev, confirmPassword: "Password mismatch. Ensure the new password matches" }))
            return;
        }
        try {
            const res = await api.post("/api/auth/confirm-password",
                {
                    password: passwordForm.password
                }
            )
            setStep(2);
        } catch (e) {
            const msg = e.response.data.message || "Unable to confirm your password. Please try again later";
            console.error(msg);
            setValidationError((prev) => ({ ...prev, password: msg }))
        }

        return;
    }

    const confirmPasswordChange = async (e) => {
        e.preventDefault()
        setError("");
        setResult("")
        try {
            const res = await api.put("/api/auth/change-password",
                {
                    password: passwordForm.password,
                    newPassword: passwordForm.updatePassword
                }
            )
            setResult(res.data.message);
        } catch (e) {
            const msg = e.response.data.message || "Password update failed. Please try again later";
            console.error(msg);
            setError(msg);
        } finally {
            setStep(3);
        }
        return;
    }

    return (
        <>
            {step === 1 && <form
                onSubmit={(e) => handleValidation(e)}
            >
                <label htmlFor="password">
                    Enter your password:
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={passwordForm.password}
                    placeholder="Please enter your password"
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {validationError.password && <span className="inline-error">{validationError.password}</span>}
                <label htmlFor="updatePassword">
                    Enter a new password:
                </label>
                <input
                    id="updatePassword"
                    type="password"
                    name="updatePassword"
                    value={passwordForm.updatePassword}
                    placeholder="Please enter a new password"
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {validationError.updatePassword && <span className="inline-error">{validationError.updatePassword}</span>}
                <label htmlFor="confirmPassword">
                    Confirm the new password:
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    placeholder="Please confirm the new password"
                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
                {validationError.confirmPassword && <span className="inline-error">{validationError.confirmPassword}</span>}
                <PrimaryButton
                    type="submit"
                >Confirm</PrimaryButton>
            </form>}

            {step === 2 && <div className="confirm-password-change">
                <h3>Confirm Changes</h3>
                <p>Are you sure you want to change your password?</p>
                <PrimaryButton
                    onClick={(e) => confirmPasswordChange(e)}
                >Proceed</PrimaryButton>
                <DangerButton
                    onClick={() => setStep(1)}
                >Cancel</DangerButton>

            </div>}

            {
                step === 3 && (result ? <div className="password-change-result">
                    {result}
                </div> : <div className="error">{error}</div>)
            } 
        </>
    )
}