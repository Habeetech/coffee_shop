import InputField from "../form/InputField"
import AddressForm from "../form/AddressForm"
import CheckboxField from "../form/CheckboxField.jsx"
import PrimaryButton from "../buttons/PrimaryButton.jsx"
export default function CardPaymentForm({
    payment,
    errors,
    address,
    handleSubmit,
    isSubmitting,
    handlePayment,
    handleBillingAddressChange,
    total
}) {
    const hasCustomerAddress = Object.values(address || {}).some(v => v?.trim());
    return (
        <div className="card-payment-info">
            <InputField
                label="Card holder name"
                type="text"
                error={errors?.card?.card_holder_name}
                value={payment.card_holder_name}
                onChange={handlePayment}
                required
                placeholder="John Doe"
            />
            <InputField
                label="Card number"
                type="text"
                error={errors?.card?.card_number}
                value={payment.card_number}
                onChange={handlePayment}
                required
                placeholder="8968 8496 6899 2355 5003"
            />
            <InputField
                label="Expiry"
                type="text"
                error={errors?.card?.expiry}
                value={payment.expiry}
                onChange={handlePayment}
                required
                placeholder="01/08"
            />
            <InputField
                label="CVV"
                type="text"
                error={errors?.card?.cvv}
                value={payment.cvv}
                onChange={handlePayment}
                required
                placeholder="111"
            />
            <CheckboxField
                label="Use customer address"
                checked={payment.use_customer_address}
                onChange={handlePayment}
                disabled={!hasCustomerAddress}
            />
            {!payment.use_customer_address && (
                <AddressForm
                    address={payment.billing_address}
                    errors={errors?.billing_address}
                    onChange={handleBillingAddressChange}
                    disabled={false}
                />
            )}
            <PrimaryButton
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
            >{`Pay (£ ${total().toFixed(2)})`}</PrimaryButton>
        </div>
    )
}
