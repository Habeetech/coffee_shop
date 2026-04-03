import  validateCustomer  from "../validators/customerValidator";
import validatePayment  from "../validators/paymentValidator";
import validateBillingAddress  from "../validators/billingValidator";

export default function useCheckout({ carts, total, customer, payment, user }) {
    const runValidation = () => {
        const customerErrors = validateCustomer(customer, user);
        const paymentErrors = validatePayment(payment);
        const billingErrors = validateBillingAddress(payment);

        const hasAnyErrors = Boolean(customerErrors || paymentErrors || billingErrors);

        return {
            hasAnyErrors,
            customerErrors,
            paymentErrors,
            billingErrors
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

        const res = await fetch("/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        return await res.json();
    };

    return { runValidation, submitOrder };
}
