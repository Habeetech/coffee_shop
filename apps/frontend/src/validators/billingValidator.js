export default function validateBillingAddress(payment) {
    if (payment.method !== "card") return null;
    if (payment.use_customer_address) return null;

    const errors = {
        street: payment.billing_address.street.trim() ? "" : "Street is required",
        city: payment.billing_address.city.trim() ? "" : "City is required",
        state: payment.billing_address.state.trim() ? "" : "State is required",
        country: payment.billing_address.country.trim() ? "" : "Country is required",
        postal: payment.billing_address.postal.trim() ? "" : "Postal code is required"
    };

    const hasErrors = Object.values(errors).some(msg => msg !== "");

    return hasErrors ? errors : null;
}
