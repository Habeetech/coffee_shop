import { useState } from "react";
import InputField from "../../form/InputField";
import PrimaryButton from "../../buttons/PrimaryButton";
import toSentence from "../../../utils/toSentence.js"
import SecondaryButton from "../../buttons/SecondaryButton";
import api from "../../../api/api.js";
import useUserStore from "../../../store/useUserStore";

export default function AccountUpdate ({field, onClose}) {
    const {updateUser} = useUserStore();
    const [change, setChange] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState("");
    const [step, setStep] = useState(1);
    const handleValidation = (e) => {
        e.preventDefault();
        if(!change) {
            setError(`Please enter a new ${field}`);
            return;
        }
        setStep(2);
    }
    const handleConfirm = async (e) => {
        const payload = {
                [field]: change
            }
        e.preventDefault();
        try {
            setIsLoading(true);
            setError("")
            const res = await api.put("api/user/mine", payload )
            if (res.status === 200) {
                updateUser(payload);
            }
        } catch (e) {
            const msg = e?.response?.data?.message || `Unable to update ${field}. Please try again later`;
            console.error(msg);
            setError(msg);
        } finally {
            setIsLoading(false);
            setStep(3);
        }
    }
    return (<div className="account-update-wrapper">
        {step === 1 && <form
        onSubmit={(e) => handleValidation(e)}
        >
            <h3>Enter a new {toSentence(field)}</h3>
            <InputField
            name={field}
            placeholder={`Please enter a new ${field}`}
            value={change}
            onChange={(target) => {
                setChange(target.value)
                setError("")
            }}
            error={error}
            />
            <PrimaryButton
            type="submit"
            >Confirm</PrimaryButton>
        </form>}
        {step === 2 && <div className="confirm-change">
            <h3>Are you sure you want to update your {toSentence(field)}?</h3>
            <div className="confirm-btn-wrapper">
                <PrimaryButton
                onClick={(e) => handleConfirm(e)}
                disabled={isLoading}
                >Proceed</PrimaryButton>
                <SecondaryButton
                onClick={onClose}
                >Cancel</SecondaryButton>
            </div>
        </div>
        }
        {
            step === 3 && <div className="result">
                {error ? <span className="inline-error">{error}</span>:
                <span className="msg">{`${toSentence(field)} updated successfully.`}</span>
                }
            </div>
        }
    </div>);
}