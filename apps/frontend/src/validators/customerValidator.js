export default function validateCustomer(customer, user) {
    const errors = {};

    if (!user) {
        errors.firstName = customer.firstName.trim() ? "" : "Please enter your firstname";
        errors.lastName = customer.lastName.trim() ? "" : "Please enter your lastname";
        errors.email = customer.email.trim() ? "" : "Please input your email";

        errors.address = {
            street: customer.address.street.trim() ? "" : "Street is required",
            city: customer.address.city.trim() ? "" : "City is required",
            state: customer.address.state.trim() ? "" : "State is required",
            country: customer.address.country.trim() ? "" : "Country is required",
            postal: customer.address.postal.trim() ? "" : "Postal code is required"
        };
    }

    errors.deliveryOption = customer.deliveryOption.trim()
        ? ""
        : "Please select a delivery option";

    const hasErrors =
        Object.values(errors).some(v => v !== "" && typeof v === "string") ||
        (errors.address && Object.values(errors.address).some(v => v !== ""));

    return hasErrors ? errors : null;
}
