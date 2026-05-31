import { useState, useRef, useEffect } from "react";
import "../styles/SurveyPage.css"
import pascalToSentence from "../utils/pascalToSentence";
import api from "../api/api.js"
import ModalOverlay from "../components/options/ModalOverlay.jsx";
import CloseModal from "../components/buttons/CloseModal.jsx"

export default function SurveyPage() {
    const [formData, setFormData] = useState({
        ageGroup: "",
        gender: "",
        employmentStatus: "",
        experience: "",
        drinkQuality: "",
        staffFriendliness: "",
        drinkType: "",
        visitFrequency: "",
        influence: "",
        contactPermission: ""
    });
    const [error, setError] = useState({});
    const [failed, setFailed] = useState("")
    const failedRef = useRef(null);


    const [msg, setMsg] = useState("")
    const [success, setSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
        setError((prev) => ({
            ...prev,
            [key]: ""
        }))
    };
const validateForm = () => {
        const localErrors = {};
        
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) {
                localErrors[key] = `${pascalToSentence(key)} is required`;
            }
        });

        setError(localErrors);

        return Object.keys(localErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("")
        setFailed("")
        if (validateForm()) {
            try {
                setIsSubmitting(true);
                await new Promise((resolve) => setTimeout(resolve, 5000))
              
                const res = await api.post("/api/survey-form", formData);
                if (res.status === 200) {
                    setMsg("Thanks for filling the form. Your response has been recieved")
                    setSuccess(true)

                }

            } catch (e) {
                const errMsg = e?.response?.data?.message || "Unable to submit your response. Please try again later";
                console.error(errMsg)
                setFailed(errMsg);
                setTimeout(() => {
                    if (failedRef.current) {
                        failedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                        failedRef.current.focus({ preventScroll: true });
                    }
                }, 50);
            } finally {
                setIsSubmitting(false)
            }
        }
        return;
    };

    return (
        <main className="survey-form-container">
            {success &&
                <ModalOverlay
                    onClose={() => setSuccess(false)}
                    children={<div className="survey-response">
                        <CloseModal
                        className="close-msg"
                            onClose={() => setSuccess(false)}
                        />
                        <p> {msg}</p>
                    </div>}
                />}
            {failed && <div className="error"
            ref={failedRef}
            tabIndex={-1}
            >
                {failed}
            </div>}
            <form onSubmit={handleSubmit} className="survey-form">
                <fieldset>
                    <legend>Demographic Information</legend>

                    <div className="survey-input-group">
                        <h3>Age group:</h3>
                        <label>
                            <input
                                type="radio"
                                name="ageGroup"
                                value="below 18"
                                checked={formData.ageGroup === "below 18"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Below 18
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="ageGroup"
                                value="18-35"
                                checked={formData.ageGroup === "18-35"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            18 - 35
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="ageGroup"
                                value="above 35"
                                checked={formData.ageGroup === "above 35"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Above 35
                        </label>
                        {error.ageGroup && <span className="inline-error">{error.ageGroup}</span>}
                    </div>

                    <div className="survey-input-group">
                        <h3>Gender Identity:</h3>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === "male"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Male
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === "female"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Female
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="gender"
                                value="other"
                                checked={formData.gender === "other"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Other
                        </label>
                        {error.gender && <span className="inline-error">{error.gender}</span>}
                    </div>

                    <div className="survey-input-group">
                        <h3>Employment Status:</h3>

                        <label>
                            <input
                                type="radio"
                                name="employmentStatus"
                                value="student"
                                checked={formData.employmentStatus === "student"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Student
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="employmentStatus"
                                value="employed"
                                checked={formData.employmentStatus === "employed"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Employed
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="employmentStatus"
                                value="self-employed"
                                checked={formData.employmentStatus === "self-employed"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Self Employed
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="employmentStatus"
                                value="unemployed"
                                checked={formData.employmentStatus === "unemployed"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Unemployed
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="employmentStatus"
                                value="other"
                                checked={formData.employmentStatus === "other"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Other (Specify):

                        </label>
                        {formData.employmentStatus === "other" && <input
                            type="text"
                            name="employmentStatusOther"
                            placeholder="Please specify your employment status"
                            value={formData.employmentStatusOther || ""}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                        }
                        {error.employmentStatus && <span className="inline-error">{error.employmentStatus}</span>}
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Customer Experience</legend>

                    <div className="survey-input-group">
                        <h3>Overall Experience:</h3>

                        <label>
                            <input
                                type="radio"
                                name="experience"
                                value="very satisfied"
                                checked={formData.experience === "very satisfied"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Very satisfied
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="experience"
                                value="satisfied"
                                checked={formData.experience === "satisfied"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Satisfied
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="experience"
                                value="neutral"
                                checked={formData.experience === "neutral"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Neutral
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="experience"
                                value="unsatisfied"
                                checked={formData.experience === "unsatisfied"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Unsatisfied
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="experience"
                                value="very unsatisfied"
                                checked={formData.experience === "very unsatisfied"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Very unsatisfied
                        </label>
                        {error.experience && <span className="inline-error">{error.experience}</span>}
                    </div>

                    <div className="survey-input-group">
                        <h3>Drink Quality:</h3>

                        <label>
                            <input
                                type="radio"
                                name="drinkQuality"
                                value="excellent"
                                checked={formData.drinkQuality === "excellent"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Excellent
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="drinkQuality"
                                value="good"
                                checked={formData.drinkQuality === "good"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Good
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="drinkQuality"
                                value="average"
                                checked={formData.drinkQuality === "average"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Average
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="drinkQuality"
                                value="poor"
                                checked={formData.drinkQuality === "poor"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Poor
                        </label>
                        {error.drinkQuality && <span className="inline-error">{error.drinkQuality}</span>}
                    </div>

                    <div className="survey-input-group">
                        <h3>Staff Friendliness:</h3>

                        <label>
                            <input
                                type="radio"
                                name="staffFriendliness"
                                value="excellent"
                                checked={formData.staffFriendliness === "excellent"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Excellent
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="staffFriendliness"
                                value="good"
                                checked={formData.staffFriendliness === "good"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Good
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="staffFriendliness"
                                value="average"
                                checked={formData.staffFriendliness === "average"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Average
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="staffFriendliness"
                                value="poor"
                                checked={formData.staffFriendliness === "poor"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Poor
                        </label>
                        {error.staffFriendliness && <span className="inline-error">{error.staffFriendliness}</span>}
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Preferences</legend>

                    <div className="survey-input-group">
                        <h3>Most Ordered Drink:</h3>

                        <label>
                            <input
                                type="radio"
                                name="drinkType"
                                value="coffee"
                                checked={formData.drinkType === "coffee"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Coffee
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="drinkType"
                                value="tea"
                                checked={formData.drinkType === "tea"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Tea
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="drinkType"
                                value="iced drinks"
                                checked={formData.drinkType === "iced drinks"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Iced Drinks
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="drinkType"
                                value="smoothies"
                                checked={formData.drinkType === "smoothies"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Smoothies
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="drinkType"
                                value="other"
                                checked={formData.drinkType === "other"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Other
                        </label>
                        {error.drinkType && <span className="inline-error">{error.drinkType}</span>}
                    </div>

                    <div className="survey-input-group">
                        <h3>How often do you visit coffee shops:</h3>

                        <label>
                            <input
                                type="radio"
                                name="visitFrequency"
                                value="daily"
                                checked={formData.visitFrequency === "daily"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Daily
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="visitFrequency"
                                value="weekly"
                                checked={formData.visitFrequency === "weekly"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Weekly
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="visitFrequency"
                                value="monthly"
                                checked={formData.visitFrequency === "monthly"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Monthly
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="visitFrequency"
                                value="rarely"
                                checked={formData.visitFrequency === "rarely"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Rarely
                        </label>
                        {error.visitFrequency && <span className="inline-error">{error.visitFrequency}</span>}
                    </div>

                    <div className="survey-input-group">
                        <h3>What influences your drink choice the most:</h3>

                        <label>
                            <input
                                type="radio"
                                name="influence"
                                value="taste"
                                checked={formData.influence === "taste"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Taste
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="influence"
                                value="price"
                                checked={formData.influence === "price"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Price
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="influence"
                                value="speed"
                                checked={formData.influence === "speed"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Speed
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="influence"
                                value="recommendations"
                                checked={formData.influence === "recommendations"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Recommendations
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="influence"
                                value="health options"
                                checked={formData.influence === "health options"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Health options
                        </label>
                        {error.influence && <span className="inline-error">{error.influence}</span>}
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Suggestions</legend>

                    <div className="survey-input-group">
                        <h3>What new drink or food item would you like us to add:</h3>

                        <input
                            type="text"
                            name="newItemSuggestion"
                            value={formData.newItemSuggestion || ""}
                            placeholder="Type your suggestion…"
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </div>

                    <div className="survey-input-group">
                        <h3>Any additional comments or suggestions:</h3>

                        <textarea
                            name="comments"
                            value={formData.comments || ""}
                            placeholder="Your feedback…"
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Contact Permission</legend>

                    <div className="survey-input-group">
                        <h3>Would you like us to contact you about your survey?</h3>

                        <label>
                            <input
                                type="radio"
                                name="contactPermission"
                                value="yes"
                                checked={formData.contactPermission === "yes"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            Yes
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="contactPermission"
                                value="no"
                                checked={formData.contactPermission === "no"}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />{" "}
                            No
                        </label>
                    </div>

                    {formData.contactPermission === "yes" && (
                        <div className="survey-input-group">
                            <h3>Your Contact Information:</h3>

                            <label htmlFor="fullName">Full Name:</label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                placeholder="Your name goes here..."
                                value={formData.fullName || ""}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />

                            <label htmlFor="email">Email Address:</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Your email goes here..."
                                value={formData.email || ""}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />

                            <label htmlFor="phone">Phone Number:</label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="Your phone number goes here..."
                                value={formData.phone || ""}
                                onChange={(e) => handleChange(e.target.name, e.target.value)}
                            />
                        </div>
                    )}
                </fieldset>

                <button
                    disabled={isSubmitting}
                    type="submit">Submit</button>
            </form>
        </main>
    );
}
