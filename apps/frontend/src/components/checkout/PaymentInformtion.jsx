import { useEffect, useState } from "react"
import cardIcon from "../../assets/icons/card.png"
import collectionIcon from "../../assets/icons/collection.png"
import googlePayIcon from "../../assets/icons/gpay.png"
import applePayIcon from "../../assets/icons/apay.png"
import "./CheckoutStyles.css"
import PrimaryButton from "../buttons/PrimaryButton.jsx"
import FormSection from "../form/FormSection.jsx"
import PaymentTileGroup from "../checkout/PaymentTileGroup.jsx"
import CardPaymentForm from "./CardPaymentForm.jsx"
export default function PaymentInformation({ payment,
    errors,
    handleSubmit,
    isSubmitting,
    handlePayment,
    handleBillingAddressChange,
    address,
    total }) {

    const handleSelectPayment = (method) => {
        handlePayment({
            name: "method",
            value: method,
            type: "text"
        });
    };


    useEffect(() => {
        if (payment.use_customer_address) {
            handleBillingAddressChange({
                name: "billing_address",
                value: address

            })
        }
    }, [payment.use_customer_address])
    return (<FormSection title="Payment Information">
        <PaymentTileGroup
            selected={payment.method}
            onSelect={handleSelectPayment}
            options={[
                { label: "Card Payment", value: "card", icon: cardIcon },
                { label: "Pay on Collection", value: "collection", icon: collectionIcon },
                { label: "Google Pay", value: "google", icon: googlePayIcon },
                { label: "Apple Pay", value: "apple", icon: applePayIcon }
            ]}
        />


        {payment.method === "card" && (
            <CardPaymentForm
                payment={payment}
                errors={errors}
                address={address}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                handlePayment={handlePayment}
                handleBillingAddressChange={handleBillingAddressChange}
                total={total}
            />
        )}
        {payment.method === "collection" && (
            <PrimaryButton
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                Confirm Order
            </PrimaryButton>
        )}
        {/*      {payment.method === "google" && (
            <PrimaryButton onClick={handleGooglePay}>
                Pay with Google Pay
            </PrimaryButton>
        )}

        {payment.method === "apple" && (
            <PrimaryButton onClick={handleApplePay}>
                Pay with Apple Pay
            </PrimaryButton>
        )}
 */}
    </FormSection>
    )
}