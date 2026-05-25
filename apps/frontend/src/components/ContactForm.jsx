import { useState } from "react";
import InputField from "./form/InputField.jsx"
import TextAreaField from "./form/TextAreaField.jsx"
import PrimaryButton from "./buttons/PrimaryButton.jsx";
import api from "../api/api.js";


export default function ({user, action = null}) {
    const [error, setError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [isLoading, setisLoading] = useState(false);
      const [contactForm, setContactForm] = useState({
        username: user?.username || "",
        email: user?.email || "",
        message: ""
      })

    const handleChange = (name, value) => {
        setContactForm((prev) => ({...prev, [name]: value}));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setisLoading(true);
        try {
            const res = await api.post("/api/contact-support", contactForm);
            setSuccessMsg(res?.data)
        } catch (e) {
            const msg = e?.response?.data?.message || "Unable to send your message. Please try again later";
            console.error(msg);
            setError(msg);
        } finally {
            setisLoading(false);
        }
        
        if(action){
            action();
        }
        return;
    }

    return (
        <form className="contact-form"
        onSubmit={(e) => handleSubmit(e)}
        >
            <InputField
                name="username"
                label="Name"
                value={contactForm?.username ?? ""}
                onChange={(target) => handleChange(target.name, target.value)}
                placeholder="Please enter your name"
                required={true}
            />
             <InputField
                name="email"
                label="Email"
                value={contactForm?.email ?? ""}
                onChange={(target) => handleChange(target.name, target.value)}
                placeholder="Please enter your email"
                required={true}
            />
              <TextAreaField
                name="message"
                label="Message"
                value={contactForm.message ?? ""}
                onChange={(target) => handleChange(target.name, target.value)}
                placeholder="Please provide your message"
                required={true}
                min={20}
            />
            <PrimaryButton
            type="submit"
            disabled={isLoading}
            >Submit</PrimaryButton>
        </form>)
}