import "./CustomerAddress.css"
export default function CustomerAddress ({
    customer,
    errors,
    user,
    handleAddressChange
}) {
    return(<fieldset className="customer-address">
            <label>Street: <input type="text" name="street" required
                value={customer.address.street}
                onChange={(e) => handleAddressChange(e.target)}
                disabled={Boolean(user)}
            /></label>
            <label>City: <input type="text" name="city" required
                value={customer.address.city}
                onChange={(e) => handleAddressChange(e.target)}
                disabled={Boolean(user)}
            /></label>
            <label>State: <input type="text" name="state" required
                value={customer.address.state}
                onChange={(e) => handleAddressChange(e.target)}
                disabled={Boolean(user)}
            /></label>
            <label>Country: <input type="text" name="country"
                required value={customer.address.country}
                onChange={(e) => handleAddressChange(e.target)}
                disabled={Boolean(user)}
            /></label>
            <label>Postal Code: <input type="text" name="postal"
                required value={customer.address.postal}
                onChange={(e) => handleAddressChange(e.target)}
                disabled={Boolean(user)}
            /></label>
            {errors.address && <p className="error">{errors.address}</p>}
        </fieldset>)
}