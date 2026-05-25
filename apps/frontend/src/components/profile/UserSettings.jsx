import useUserStore from "../../store/useUserStore.js"
import ModalOverlay from "../../components/options/ModalOverlay.jsx"
import { useState } from "react";
import SettingsModal from "./settings/SettingsModal.jsx";
import ChangePassword from "./settings/ChangePassword.jsx";
import DeleteAccount from "./settings/DeleteAccount.jsx";


export default function UserSettings() {
    const { user } = useUserStore();
    const freeDrink = Math.floor(user.loyaltyPoints / 10)
    const [updateUsername, setUpdateUsername] = useState(false);
    const [updateEmail, setUpdateEmail] = useState(false);
    const [updatePhone, setUpdatePhone] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [deleteAccount, setDeleteAccount] = useState(false);

    return (<main className="user-settings">

        {updateUsername && <ModalOverlay
            children={<p>This is update username</p>}
            onClose={() => setUpdateUsername(false)}
        />}
        {updateEmail && <ModalOverlay
            children={<p>This is update Email</p>}
            onClose={() => setUpdateEmail(false)}
        />}
        {updatePhone && <ModalOverlay
            children={<p>This is update Phone</p>}
            onClose={() => setUpdatePhone(false)}
        />}
        {changePassword &&
            <SettingsModal
                children={<ChangePassword />}
                onClose={() => setChangePassword(false)}
            />}
        {deleteAccount &&  <SettingsModal
                children={<DeleteAccount
                close={() => setDeleteAccount(false)}
                />}
                onClose={() => setDeleteAccount(false)}
            />}
        <section className="settings-section">
            <h3>Account Settings</h3>
            <button className="setting-wrapper clickable"
                onClick={() => setUpdateUsername(true)}
            >
                <span className="setting-sub">Username</span>
                <span className="setting-content">{user.username}</span>
            </button>
            <button className="setting-wrapper clickable"
                onClick={() => setUpdateEmail(true)}
            >
                <span className="setting-sub">Email</span>
                <span className="setting-content">{user.email}</span>
            </button>
            <button className="setting-wrapper clickable"
                onClick={() => setUpdatePhone(true)}
            >
                <span className="setting-sub">Phone number</span>
                <span className="setting-content">{user.phone || "No phone number"}</span>
            </button>
        </section>

        <section className="settings-section">
            <h3>Rewards</h3>
            <div className="setting-wrapper">
                <span className="setting-sub">Free drink</span>
                <span className="setting-content">{freeDrink}</span>
            </div>
            <div className="setting-wrapper">
                <span className="setting-sub">Club points</span>
                <span className="setting-content">{user.loyaltyPoints}</span>
            </div>
        </section>
        <section className="settings-section">
            <h3>Security Settings</h3>
            <button className="setting-wrapper clickable"
                onClick={() => setChangePassword(true)}
            >
                <span className="setting-sub">Change Password</span>
            </button>
            <button className="setting-wrapper clickable"
                onClick={() => setDeleteAccount(true)}
            >
                <span className="setting-sub">Delete account</span>
            </button>
        </section>
    </main>)
}