
import RadioGroup from "../form/RadioGroup.jsx"
export default function DeliveryOptions({
    customer,
    errors,
    handleCustomerChange,
}) {
    return (<>
        <legend>Please choose your delivery/collection method</legend>
        <RadioGroup
            name="deliveryOption"
            value={customer.deliveryOption}
            onChange={handleCustomerChange}
            error={errors.deliveryOption}
            options={[
                { label: "Pick Up", value: "collection" },
                { label: "Delivery", value: "delivery" }
            ]}
        />
    </>)
}