import InputField from "../form/InputField"
export default function CustomerDetailsForm({
    customer,
    errors,
    user,
    handleCustomerChange
}) {
    return (
        <fieldset className="customer-details">
            <InputField
                label="First Name"
                type="text"
                name="firstName"
                error={errors.firstName}
                value={customer.firstName}
                required={true}
                onChange={handleCustomerChange}
                disabled={Boolean(user && user.firstName)}
            />
            <InputField
                label="Last Name"
                type="text"
                name="lastName"
                required={true}
                error={errors.lastName}
                value={customer.lastName}
                onChange={handleCustomerChange}
                disabled={Boolean(user && user.lastName)}
            />
            <InputField
                label="Email"
                type="email"
                name="email"
                required={true}
                error={errors.email}
                value={customer.email}
                onChange={handleCustomerChange}
                disabled={Boolean(user && user.email)}
            />

        </fieldset>
    )
}
