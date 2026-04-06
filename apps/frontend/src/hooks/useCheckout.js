import  validateCustomer  from "../validators/customerValidator";

export default function useCheckout({ carts, total, customer, user }) {
    const runValidation = () => {
        const customerErrors = validateCustomer(customer, user);
        const hasAnyErrors = Boolean(customerErrors);

        return {
            hasAnyErrors,
            customerErrors,
        };
    };

    const submitOrder = async () => {
        const order = {
            items: carts,
            total,
            customer,
            createdAt: Date.now(),
            status: "pending"
        };
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        return await res.json();
    };

    return { runValidation, submitOrder };
}
