import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import PrimaryButton from "../buttons/PrimaryButton";
import { useState } from "react";
import api from "../../api/api.js";


export default function StripePaymentForm({ handleSubmit, isSubmitting, total, method, clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const paymentIntentId = clientSecret.split("_secret_")[0];
    const [errorMsg, setErrorMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleStripeSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setErrorMsg(null);

        try {
            setIsLoading(true)
            const order = await handleSubmit(method, paymentIntentId);
            if (!order._id) {
                throw new Error("Order creation failed.");
            }

            await api.patch("/api/payment-intent/update", {
                orderId: order._id,
                paymentId: paymentIntentId
            });

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
          
            const backendMsg = err.response?.data?.message || err.message;
            console.error("Checkout Error:", backendMsg);
            setErrorMsg(backendMsg);
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