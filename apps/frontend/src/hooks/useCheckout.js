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
  
    const submitOrder = async (method, paymentId) => {
        const order = {
            userId: user?._id || user?.id || "",
            items: carts,
            total: Math.round(total() * 100) / 100,
            customer: customer,
            status: "pending",
            paymentMethod: method,
            stripeId: paymentId || ""
        };
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        return data.order;
    };

    return { runValidation, submitOrder };
}
