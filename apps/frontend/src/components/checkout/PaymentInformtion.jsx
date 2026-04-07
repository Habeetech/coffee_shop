import { useEffect, useState } from "react"
import cardIcon from "../../assets/icons/card.png"
import collectionIcon from "../../assets/icons/collection.png"
import "./CheckoutStyles.css"
import PrimaryButton from "../buttons/PrimaryButton.jsx"
import FormSection from "../form/FormSection.jsx"
import PaymentTileGroup from "../checkout/PaymentTileGroup.jsx"
import StripePaymentForm from "../payment/StripePaymentForm.jsx"
import { useNavigate } from "react-router-dom"

export default function PaymentInformation({ payment,
    handleSubmit,
    isSubmitting,
    handlePayment,
    secret,
    total }) {
        const navigate = useNavigate()
    const handleSelectPayment = (method) => {
        handlePayment({
            name: "method",
            value: method,
            type: "text"
        });
    };

    return (<FormSection title="Payment Information">
        <PaymentTileGroup
            selected={payment.method}
            onSelect={handleSelectPayment}
            options={[
                { label: "Pay Now (Card/GPay/Apple)", value: "stripe", icon: cardIcon },
                { label: "Pay on Collection", value: "collection", icon: collectionIcon },
            ]}
        />
        {payment.method === "stripe" && (
            <StripePaymentForm 
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            total={total}
            method={payment.method}
            clientSecret={secret}
            />
        )}

        {payment.method === "collection" && (
            <PrimaryButton onClick={async () => {
                const order = await handleSubmit(payment.method)
                if(order) {
                    navigate(`/order-success?orderId=${order._id}`)
                }
            }} disabled={isSubmitting}>
                {isSubmitting? "Processing..." : `Confirm Order (${total().toFixed(2)})`}
            </PrimaryButton>
        )}
    </FormSection>
    )
}