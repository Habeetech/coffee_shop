import "./CustomerDetailsForm.css"
export default function CustomerDetailsForm({
    customer,
    errors,
    user,
    handleCustomerChange
}) {
    return (
        <fieldset className="customer-details">
            <label>
                First Name:
                <input
                    type="text"
                    name="firstName"
                    value={customer.firstName}
                    onChange={(e) => handleCustomerChange(e.target)}
                    disabled={Boolean(user)}
                />
            </label>
            {errors.firstName && <p className="error">{errors.firstName}</p>}

            <label>
                Last Name:
                <input
                    type="text"
                    name="lastName"
                    value={customer.lastName}
                    onChange={(e) => handleCustomerChange(e.target)}
                    disabled={Boolean(user)}
                />
            </label>
            {errors.lastName && <p className="error">{errors.lastName}</p>}

            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={customer.email}
                    onChange={(e) => handleCustomerChange(e.target)}
                    disabled={Boolean(user)}
                />
            </label>
            {errors.email && <p className="error">{errors.email}</p>}
        </fieldset>
    )
}
