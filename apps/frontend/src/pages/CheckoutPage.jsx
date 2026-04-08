import "../styles/CheckoutPage.css"
import { useState, useEffect, use, useRef } from "react"
import useCheckout from "../hooks/useCheckout.js"
import useCartStore from "../store/useCartStore.js";
import useUserStore from "../store/useUserStore.js";
import { useNavigate } from "react-router-dom";
import FormSection from "../components/form/FormSection.jsx";
import TextButton from "../components/buttons/TextButton.jsx";
import CloseModal from "../components/buttons/CloseModal.jsx"
import DangerButton from "../components/buttons/DangerButton.jsx"
import PaymentInformation from "../components/checkout/PaymentInformtion.jsx";
import OrderSummary from "../components/checkout/orderSummary.jsx";
import CustomerDetailsForm from "../components/checkout/CustomerDetailsForm.jsx";
import DeliveryOptions from "../components/checkout/DeliveryOptions.jsx";
import AddressForm from "../components/form/AddressForm.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Spinner from "../components/Spinner.jsx";
import ModalOverlay from "../components/options/ModalOverlay.jsx"
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


export default function CheckoutPage() {
    const isProcessingIntent = useRef(false);
    const [errorMsg, setErrorMsg] = useState("")
    const navigate = useNavigate();
    const { carts, total } = useCartStore();
    const user = useUserStore(state => state.user);
    const [clientSecret, setClientSecret] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const formRef = useRef(null);
    useEffect(() => {
        if (carts.length > 0 && !clientSecret && !isProcessingIntent?.current) {
            isProcessingIntent.current = true;
            fetch(`${API_URL}/api/payment-intent/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: carts, amount: Math.round(total() * 100) })
            })
                .then(res => res.json())
                .then(data => setClientSecret(data.clientSecret))
                .catch(err => console.error("Unable to get client secret", err))
                .finally(() => isProcessingIntent.current = false)
        }

    }, [carts, clientSecret, API_URL]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [payment, setPayment] = useState({
        method: "",
        stripe: {
            status: "pending",
            token: ""
        },
        collection: {
            status: "pending"
        }
    });

    const [errors, setErrors] = useState({});
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
    });

    useEffect(() => {
        if (user) {
            setCustomer({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                address: user.address,
                deliveryOption: ""
            });
        }
    }, [user]);

    const handlePaymentChange = (target) => {
        const { name, type, checked, value } = target;
        if (name === "method") {
            setPayment(prev => ({
                ...prev,
                [name]: value
            }))
            return;
        }
        setPayment(prev => ({
            ...prev,
            [prev.method]: {
                ...prev[prev.method],
                [name]: type === "checkbox" ? checked : value
            }
        }))
    };

    const handleCustomerChange = (target) => {

        setCustomer(prev => ({ ...prev, [target.name]: target.value }));
    };

    const handleAddressChange = (target) => {
        setCustomer(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [target.name]: target.value
            }
        }));
    };
    const { runValidation, submitOrder } = useCheckout({
        carts,
        total,
        customer,
        user
    });

    const handleSubmit = async (method, paymentId) => {
        setIsSubmitting(true);

        const { hasAnyErrors, customerErrors } = runValidation();

        setErrors(customerErrors || {});

        if (hasAnyErrors) {
            setIsSubmitting(false);
            formRef.current?.scrollIntoView({ behavior: "smooth" })
            return null;
        }
        setIsSubmitting(false);
        try {
            const result = await submitOrder(method, paymentId);


            if (!result) {
                throw new Error("Order Creation failed on the backend");
            }
            return result;

        } catch (e) {
            console.error("Order Failed: ", e);
            setErrorMsg("A problem occured while processing your order. Please try again later")
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    if (carts.length === 0) {
        return (
            <main className="checkout-wrapper empty-checkout">
                <h2 className="checkout-header">Your cart is empty</h2>
                <p>You need to add some delicious items before checking out!</p>
                <TextButton onClick={() => navigate("/menu")}>
                    Return to Menu
                </TextButton>
            </main>
        );
    }
    return (
        <>
            {errorMsg && (
                <ModalOverlay
                    onClose={() => setErrorMsg("")}
                >
                    <div className="error">
                        <p>{errorMsg}</p>
                        <CloseModal
                            onClose={() => setErrorMsg("")}
                            className="error-close-btn"
                        />
                    </div>
                </ModalOverlay>
            )}
            <main className="checkout-wrapper">
                <h2 className="checkout-header">Checkout</h2>

                <section className="checkout-welcome">
                    <p>Thanks for your order {user?.firstName || ""}</p>

                    {!user?.firstName && (
                        <p>
                            Please <a href=""><TextButton>Login</TextButton></a> or
                            <a href=""><TextButton>Register</TextButton></a>
                            to complete your order or fill the form below to continue as guest
                        </p>
                    )}
                </section>

                <section className="checkout-summary">
                    <OrderSummary carts={carts} />
                </section>

                <section className="checkout-form-section"
                    ref={formRef}
                >
                    <FormSection title="Customer Details">
                        <CustomerDetailsForm
                            customer={customer}
                            errors={errors}
                            user={user}
                            handleCustomerChange={handleCustomerChange}
                        />
                        <AddressForm
                            address={customer.address}
                            errors={errors.address}
                            onChange={handleAddressChange}
                            disabled={Boolean(user)}
                        />

                        <DeliveryOptions
                            customer={customer}
                            errors={errors}
                            handleCustomerChange={handleCustomerChange}
                        />
                    </FormSection>
                </section>

                <section className="payment-info">
                    {clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                            <PaymentInformation
                                payment={payment}
                                handleSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                handlePayment={handlePaymentChange}
                                address={customer.address}
                                secret={clientSecret}
                                total={total}
                            />
                        </Elements>
                    ) : (
                        <Spinner />
                    )}
                </section>
                <section className="checkout-btns">
                    <DangerButton onClick={() => navigate(-1)}>
                        Cancel
                    </DangerButton>
                </section>
            </main>
        </>
    );
}
