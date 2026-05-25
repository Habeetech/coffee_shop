import useUserStore from "../../store/useUserStore.js";
import { getDescription } from "../../utils/getDescription.js"
import maleIcon from "../../assets/placeholders/profile-male.png"
import femaleIcon from "../../assets/placeholders/profile-female.png"
import noPhoto from "../../assets/placeholders/no-photo.png"
import FormSection from "../form/FormSection.jsx";
import InputField from "../form/InputField.jsx"
import SelectField from "../form/SelectField.jsx";
import AddressForm from "../form/AddressForm.jsx"
import TextButton from "../buttons/TextButton.jsx"
import PrimaryButton from "../buttons/PrimaryButton.jsx";
import DangerButton from "../buttons/DangerButton.jsx"
import api from "../../api/api.js"
import { subYears } from "date-fns"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const navigate = useNavigate();
    const { user, updateUser } = useUserStore();
    const today = new Date();
    const maxDate = subYears(today, 15).toISOString().split("T")[0]
    const minDate = subYears(today, 100).toISOString().split("T")[0];
    const [userProfile, setUserProfile] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        url: user.url || "",
        address: {
            street: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            country: user.address?.country || "",
            postal: user.address?.postal || ""
        }
    });
    const [userUpdate, setUserUpdate] = useState({})
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null)
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUserProfile({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                gender: user.gender || "",
                dateOfBirth: user.dateOfBirth || "",
                url: user.url || "",
                address: {
                    street: user.address?.street || "",
                    city: user.address?.city || "",
                    state: user.address?.state || "",
                    country: user.address?.country || "",
                    postal: user.address?.postal || ""
                }
            });
        }
    }, [user]);
    const profileUrl =
        previewUrl ?
            previewUrl :
            user.url ?
                user.url
                : user?.gender === "male"
                    ? maleIcon
                    : user?.gender === "female"
                        ? femaleIcon
                        : noPhoto;

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(e.target.files[0]);

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl)
        }

        return;
    }
    const handleImageUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            setError(null);
            setIsLoading(true);

            const res = await api.post("/api/upload/profile-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status === 200 || res.status === 201) {
                handleChange("url", res.data);
                try {
                    setError(null);
                    const updateRes = await api.put("/api/user/mine", { url: res.data})
                    if (updateRes.status === 200) {
                        updateUser({url: res.data});
                        setUserUpdate({})
                    }
                } catch (e) {
                    console.error("Unable to save image", e);
                }

                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                }
            }
        } catch (e) {
            console.error("Failed to upload picture", e);
            setError("Unable to upload profile picture. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // alert("The form should be submitted. Just temporarily terminating the function early");
        // return;

        try {
            setIsLoading(true);
            const res = await api.put("api/user/mine", userUpdate);
            if (res.status === 200) {
                updateUser(userUpdate);
                setUserUpdate({})
            }
        } catch (e) {
            console.error("Failed to update user profile", e);
        }
        finally {
            setIsLoading(false);
        }
    }
    const handleChange = (name, value) => {
        if (name === "city" || name === "state"
            || name === "country" || name === "street"
            || name === "postal"
        ) {
            setUserUpdate(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value
                }
            }))
            return;
        }
        setUserUpdate(prev => ({ ...prev, [name]: value }))
        return;
    }
    return (
        <main className="edit-profile-wrapper">
            {error && <div className="error">
                {error}
            </div>}
            <section className="profile-details">
                <figure className="profile-image-wrapper">
                    <img src={profileUrl} alt={getDescription(profileUrl)} />
                    <div className="upload-picture">
                        <input
                            name="url"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e)}
                        ></input>
                        <PrimaryButton
                            onClick={handleImageUpload}
                            disabled={isLoading}
                        >Upload Picture</PrimaryButton>
                    </div>
                </figure>
                <div className="other-profile-details">
                    <p>{user.role !== "user" ? `${user.username} (${user.role})` : user.username} <TextButton
                    onClick={() => navigate("/profile/settings?reason=update-username")}
                    >Update username</TextButton>
                    </p>
                    <p>Club Points: {user.loyaltyPoints}</p>
                    <p>{user.email} <TextButton
                    onClick={() => navigate("/profile/settings?reason=update-email")}
                    >Update email</TextButton></p>
                    {user.phone && <p>{user.phone} <TextButton
                    onClick={() => navigate("/profile/settings?reason=update-phone")}
                    >Update phone</TextButton></p>}
                </div>
            </section>
            <form
                onSubmit={(e) => handleSubmit(e)}>
                <div className="profile-information">
                    <FormSection
                        title="Personal Information"
                    >
                        <InputField
                            name="firstName"
                            label="First Name"
                            value={userUpdate?.firstName ?? userProfile?.firstName}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </InputField>
                        <InputField
                            name="lastName"
                            label="Last Name"
                            value={userUpdate?.lastName ?? userProfile.lastName}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </InputField>

                        <SelectField
                            name="gender"
                            label="Gender"
                            value={userUpdate?.gender ?? userProfile.gender}
                            options={[
                                { label: "Male", value: "male" },
                                { label: "Female", value: "female" },
                                { label: "Other", value: "other" }
                            ]}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </SelectField>
                        <InputField
                            name="dateOfBirth"
                            label="Date of Birth"
                            type="text"
                            max={maxDate}
                            min={minDate}
                            value={userUpdate?.dateOfBirth ?? 
                                (userProfile?.dateOfBirth ?
                                new Date(userProfile?.dateOfBirth).toISOString().split("T")[0] : "")}
                            onFocus={(e) => (e.target.type = "date")}
                            onBlur={(e) => {
                                if (!e.target.value) e.target.type = "text"
                            }}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </InputField>
                    </FormSection>
                    <FormSection
                        title="Address Information"
                    >
                        <InputField
                            name="street"
                            label="Street"
                            value={userUpdate?.address?.street ?? userProfile?.address?.street}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </InputField>
                        <InputField
                            name="city"
                            label="City"
                            value={userUpdate?.address?.city ?? userProfile?.address?.city}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </InputField>
                        <InputField
                            name="state"
                            label="State"
                            value={userUpdate?.address?.state ?? userProfile?.address?.state}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </InputField>
                        <InputField
                            name="country"
                            label="Country"
                            value={userUpdate?.address?.country ?? userProfile?.address?.country}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </InputField>
                        <InputField
                            name="postal"
                            label="Postal Code"
                            value={userUpdate?.address?.postal ?? userProfile?.address?.postal}
                            onChange={(target) => handleChange(target.name, target.value)}
                        >
                        </InputField>
                    </FormSection>
                </div>
                <div className="btns-wrapper">
                    <PrimaryButton
                        type="submit"
                        disabled={isLoading}
                    >Save Changes</PrimaryButton>
                    <DangerButton
                        onClick={() => setUserUpdate({})}
                    >Discard Changes</DangerButton>
                </div>
            </form>
        </main>
    )
}