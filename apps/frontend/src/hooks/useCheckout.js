import validateCustomer from "../validators/customerValidator";
import api from "../api/api.js";

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
        const orderData = {
            userId: user?._id || user?.id || "",
            items: carts,
            total: Math.round(total() * 100) / 100,
            customer: customer,
            status: "pending",
            paymentMethod: method,
            stripeId: paymentId || ""
        };
        try {
            const res = await api.post("/api/orders", orderData);
            return res.data.order;
        } catch (e) {
            const errorMsg = e.response?.data?.message || "Order submission failed";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
    return { runValidation, submitOrder };
}
