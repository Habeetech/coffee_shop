
import InputField from "./InputField.jsx"
export default function AddressForm({
    address,
    errors,
    disabled = false,
    onChange
}) {
    return (<fieldset className="address-form">

        <InputField
            label="Street"
            name="street"
            error={errors?.street}
            value={address.street}
            onChange={onChange}
            disabled={disabled}
            required
        />

        <InputField
            label="City"
            name="city"
            error={errors?.city}
            value={address.city}
              onChange={onChange}
            disabled={disabled}
            required
        />

        <InputField
            label="State"
            name="state"
            error={errors?.state}
            value={address.state}
            onChange={onChange}
            disabled={disabled}
            required
        />

        <InputField
            label="Country"
            name="country"
            error={errors?.country}
            value={address.country}
              onChange={onChange}
            disabled={disabled}
            required
        />

        <InputField
            label="Postal Code"
            name="postal"
            error={errors?.postal}
            value={address.postal}
             onChange={onChange}
            disabled={disabled}
            required
        />
    </fieldset>
    )
}