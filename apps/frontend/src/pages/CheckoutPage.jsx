import "../styles/CheckoutPage.css"
import { useState, useEffect } from "react"
import useCheckout from "../hooks/useCheckout.js"
import useCartStore from "../store/useCartStore.js";
import useUserStore from "../store/useUserStore.js";
import ModalOverlay from "../components/options/ModalOverlay.jsx"
import { useNavigate } from "react-router-dom";
import FormSection from "../components/form/FormSection.jsx";
import TextButton from "../components/buttons/TextButton.jsx";
import DangerButton from "../components/buttons/DangerButton.jsx"
import PaymentInformation from "../components/checkout/PaymentInformtion.jsx";
import OrderSummary from "../components/checkout/orderSummary.jsx";
import CustomerDetailsForm from "../components/checkout/CustomerDetailsForm.jsx";
import DeliveryOptions from "../components/checkout/DeliveryOptions.jsx";
import AddressForm from "../components/form/AddressForm.jsx";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { carts, clearCart, total } = useCartStore();
    const user = useUserStore(state => state.user);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const [payment, setPayment] = useState({
        method: "",
        card_holder_name: "",
        card_number: "",
        cvv: "",
        expiry: "",
        use_customer_address: false,
        billing_address: {
            street: "",
            city: "",
            state: "",
            country: "",
            postal: ""
        }
    });

    const [paymentErrors, setPaymentErrors] = useState({
        card: {
            card_holder_name: "",
            card_number: "",
            expiry: "",
            cvv: ""
        },
        billing_address: {
            street: "",
            city: "",
            state: "",
            country: "",
            postal: ""
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

    const handleBillingAddressChange = (target) => {
        if (target.name === "billing_address") {
            setPayment(prev => ({
                ...prev,
                billing_address: target.value
            }));
            return;
        }

        setPayment(prev => ({
            ...prev,
            billing_address: {
                ...prev.billing_address,
                [target.name]: target.value
            }
        }));
    };

    const handlePaymentChange = (target) => {
        const { name, type, checked, value } = target;
        setPayment(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
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
        payment,
        user
    });

    const handleSubmit = async () => {
        setIsSubmitting(true);

        const { hasAnyErrors, customerErrors, paymentErrors, billingErrors } = runValidation();

        setErrors(customerErrors || {});
        setPaymentErrors({
            card: paymentErrors || {},
            billing_address: billingErrors || {}
        });

        if (hasAnyErrors) {
            setIsSubmitting(false);
            return;
        }
        setOpenConfirmation(true);
        setIsSubmitting(false);
/* 
        try {
            await submitOrder();
            clearCart();
            setOpenConfirmation(true);
        } catch (e) {
            console.error("Failed Request: ", e);
        } finally {
            setIsSubmitting(false);
        } */
    };

    return (
        <>
            {openConfirmation && (
                <div className="order-confirmation-msg">
                    <ModalOverlay
                        children={
                            <p>
                                Thanks. Your order has been submitted <br />
                                You will be notified when it's ready for Delivery / Collection
                            </p>
                        }
                        onClose={() => setOpenConfirmation(false)}
                    />
                </div>
            )}

            <main className="checkout-wrapper">
                <h2 className="checkout-header">Checkout</h2>

                <section className="checkout-welcome">
                    <p>Thanks for your order {user?.firstName || "Guest"}</p>

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

                <section className="checkout-form-section">
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
                    <PaymentInformation
                        payment={payment}
                        errors={paymentErrors}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        handlePayment={handlePaymentChange}
                        handleBillingAddressChange={handleBillingAddressChange}
                        address={customer.address}
                        total={total}
                    />
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
