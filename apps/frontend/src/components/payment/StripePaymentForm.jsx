import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import PrimaryButton from "../buttons/PrimaryButton";

export default function StripePaymentForm({handleSubmit, isSubmitting, total}) {
    const stripe = useStripe();
    const elements = useElements();

    const handleStripeSubmit = async(event) =>{
        event.preventDefault();
        const order = await handleSubmit();
        if(!order || !stripe || !elements) return;

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:5175/order-success"
            }
        });
        if (result.error) {
            console.error(result.error.message)
        }
    }
    return(
        <form onSubmit={handleStripeSubmit}>
           <PaymentElement options={{ layout: "tabs" }} />
            <PrimaryButton 
            type="submit" 
            disabled={!stripe || isSubmitting}>
                {isSubmitting? "Processing..."  : `Confirm Payment (${total().toFixed(2)})`}
            </PrimaryButton>
        </form>
    )
}