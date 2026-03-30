import "../styles/CheckoutPage.css"
import { useState, useEffect } from "react"
import useCartStore from "../store/useCartStore.js";
import useUserStore from "../store/useUserStore.js";
import ModalOverlay from "../components/options/ModalOverlay.jsx"
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/checkout/orderSummary.jsx";
import CustomerDetailsForm from "../components/checkout/CustomerDetailsForm.jsx";
import DeliveryOptions from "../components/checkout/DeliveryOptions.jsx";
import CustomerAddress from "../components/checkout/CustomerAddress.jsx";
export default function CheckoutPage() {
    const navigate = useNavigate();
    const { carts, clearCart, total } = useCartStore();
    const user = useUserStore(state => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [errors, setErrors] = useState({})
    const [customer, setCustomer] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        address: {
            street: user?.address?.street || "",
            city: user?.address?.city || "",
            state: user?.address?.state || "",
            country: user?.address?.country || "",
            postal: user?.address?.postal || ""
        },
        deliveryOption: ""
    })

    useEffect(() => {
        if (user) {
            setCustomer({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
                deliveryOption: ""
            })
        }
    }, [user])

    const handleCustomerChange = (target) => {
        setCustomer(prev => ({ ...prev, [target.name]: target.value }))
    }
    const handleAddressChange = (target) => {
        setCustomer(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [target.name]: target.value
            }
        }))
    }
    const handleSubmit = async () => {
        setIsSubmitting(true);
        if (carts.length === 0) {
            return;
        }
        const addressIsValid =
            customer.address.street.trim() &&
            customer.address.city.trim() &&
            customer.address.state.trim() &&
            customer.address.country.trim() &&
            customer.address.postal.trim()

        let errors = {}

        if (!user) {
            errors.firstName = customer.firstName.trim() ? "" : "Please enter your firstname"
            errors.lastName = customer.lastName.trim() ? "" : "Please enter your lastname"
            errors.email = customer.email.trim() ? "" : "Please input your email"
            errors.address = addressIsValid ? "" : "Please complete the address fields"
        }

        errors.deliveryOption = customer.deliveryOption.trim() ? "" : "Please select a delivery option"
        console.log(errors);
        if (Object.values(errors).some(msg => msg !== "")) {
            setErrors(errors);
            setIsSubmitting(false);
            return
        }
        const order = {
            items: carts,
            total: total,
            customer: customer,
            createdAt: Date.now(),
            status: "pending"
        }
        try {
            const res = await fetch("/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            })
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            clearCart();
            setOpenConfirmation(true);
            return await res.json();
        } catch (e) {
            console.error("Failed Request: ", e);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <>
            {openConfirmation && <div className="order-confirmation-msg">
                <ModalOverlay
                    children={<p>Thanks. Your order has been submitted <br /> You will be notified when it's ready for Delivery / Collection</p>}
                    onClose={() => setOpenConfirmation(false)}
                />
            </div>}
            <main className="checkout-wrapper">
                <section className="checkout-summary">
                    <OrderSummary
                        carts={carts}
                    />
                </section>
                <section className="checkout-form-section">
                    <h3>Customer Details</h3>
                    {<form>
                        <CustomerDetailsForm
                            customer={customer}
                            errors={errors}
                            user={user}
                            handleCustomerChange={handleCustomerChange}
                        />

                        <CustomerAddress 
                        customer={customer}
                        errors={errors}
                        user={user}
                        handleAddressChange={handleAddressChange}
                        />

                        <DeliveryOptions 
                        customer={customer}
                        errors={errors}
                        handleCustomerChange={handleCustomerChange}
                        />
                    </form>}
                </section>
                <section className="checkout-btns">
                    <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="checkout-confirm"
                    >Confirm</button>
                    <button 
                    onClick={() => navigate(-1)}
                    className="checkout-cancel"
                    >Cancel</button>
                </section>
            </main>
        </>)
}