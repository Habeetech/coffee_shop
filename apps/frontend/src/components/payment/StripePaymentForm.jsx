import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import PrimaryButton from "../buttons/PrimaryButton";
import { useState } from "react";

export default function StripePaymentForm({ handleSubmit, isSubmitting, total, method, clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const paymentIntentId = clientSecret.split("_secret_")[0];
    const [errorMsg, setErrorMsg] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    const handleStripeSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setErrorMsg(null);

        try {
            const order = await handleSubmit(method, paymentIntentId);
            if (!order || !order._id) {
                throw new Error("Order creation failed.");
            }

           const updateRes = await fetch(`${API_URL}/api/payment-intent/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: order._id,
                    paymentId: paymentIntentId
                })
            });

            if (!updateRes.ok) {
                throw new Error("Failed to link payment to order.");
            }

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-success?orderId=${order._id}`
                }
            });

            if (error) {
                setErrorMsg(error.message);
            }

        } catch (err) {
            console.error("Checkout Error:", err.message);
            setErrorMsg(err.message);
        }
    };

    return (
        <form onSubmit={handleStripeSubmit}>
            <PaymentElement options={{ layout: "tabs" }} />
            {errorMsg && (
                <div style={{ color: 'red', margin: '10px 0' }}>{errorMsg}</div>
            )}
            <PrimaryButton type="submit" disabled={!stripe || isSubmitting}>
                {isSubmitting ? "Processing..." : `Confirm Payment (£ ${total().toFixed(2)})`}
            </PrimaryButton>
        </form>
    );
}