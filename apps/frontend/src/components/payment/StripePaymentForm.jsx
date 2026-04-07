import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import PrimaryButton from "../buttons/PrimaryButton";
import { useState } from "react";

export default function StripePaymentForm({ handleSubmit, isSubmitting, total, method, clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const paymentIntentId = clientSecret.split("_secret_")[0]
    const [errorMsg, setErrorMsg] = useState(null);

    const handleStripeSubmit = async (event) => {
        event.preventDefault();
        setErrorMsg(null);
        const order = await handleSubmit(method, paymentIntentId);
        if (!order || !stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order-success?orderId=${order._id}`
            }
        });
        if (error) {
            setErrorMsg(error.message);
            console.log(error);
        }
    }
    return (
        <form onSubmit={handleStripeSubmit}>
            <PaymentElement options={{ layout: "tabs" }} />
            {errorMsg && (
                <div className="payment-error-message" style={{ color: 'red', margin: '10px' }}>
                    {errorMsg}
                </div>
            )}

            <PrimaryButton
                type="submit"
                disabled={!stripe || isSubmitting}>
                {isSubmitting ? "Processing..." : `Confirm Payment (${total().toFixed(2)})`}
            </PrimaryButton>
        </form>
    )
}