import { useEffect, useState } from "react"
import cardIcon from "../../assets/icons/card.png"
import collectionIcon from "../../assets/icons/collection.png"
import "./CheckoutStyles.css"
import PrimaryButton from "../buttons/PrimaryButton.jsx"
import FormSection from "../form/FormSection.jsx"
import PaymentTileGroup from "../checkout/PaymentTileGroup.jsx"
import StripePaymentForm from "../payment/StripePaymentForm.jsx"
export default function PaymentInformation({ payment,
    handleSubmit,
    isSubmitting,
    handlePayment,
    secret,
    total }) {

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
            />
        )}

        {payment.method === "collection" && (
            <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting? "Processing..." : `Confirm Order (${total().toFixed(2)})`}
            </PrimaryButton>
        )}
    </FormSection>
    )
}