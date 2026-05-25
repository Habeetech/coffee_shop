import { useState } from "react";
import useUserStore from "../../../store/useUserStore.js";
import ContactForm from "../../ContactForm.jsx";
import VerifyPassword from "../../VerifyPassword.jsx";
import api from "../../../api/api.js";
import PrimaryButton from "../../buttons/PrimaryButton.jsx";
import DangerButton from "../../buttons/DangerButton.jsx";
import SecondaryButton from "../../buttons/SecondaryButton.jsx"
import { useNavigate } from "react-router-dom";
import { performLogout } from "../../../service/authService.js";

export default function ({ close }) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const { user } = useUserStore();
    const handleDelete = async (e) => {
        e.preventDefault();
        setError("");
        try {
            setIsLoading(true);
            const res = await api.delete("/api/user/mine");
            console.log("deletion", res);
            if (res.status === 204) {
                console.log("Loging out....")
                await performLogout(navigate, "/?reason=deletion")
            }
        } catch (e) {
            const message = e?.response?.data?.message || "We are unable to delete your account. Please try again later";
            console.error(message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
        return
    }


    return (<div className="delete-account-container">
        {step === 1 && <div className="delete-account step1">
            <h3>We are sorry to see you go</h3>
            <p>Please tell us why you're deleting your account</p>
            <ContactForm
                user={user}
                action={() => setStep(2)}
            />
        </div>}
        {step === 2 && <div className="delete-account step2">
            <h3>Please provide your password</h3>
            <VerifyPassword
                action={() => setStep(3)}
            />
        </div>
        }
        {step === 3 && <div className="delete-account step3">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete your account?</p>
            {error && <div className="inline-error">{error}</div>}
            <div className="delete-account-btn-wrapper">
                <DangerButton
                    onClick={(e) => handleDelete(e)}
                >Proceed</DangerButton>
                <PrimaryButton
                    onClick={close}
                >Cancel</PrimaryButton>
            </div>

        </div>
        }
    </div>)
}