function validateExpiry(expiry) {
    if (!expiry) return "Invalid expiry date";

    const match = expiry.match(/^(\d{2})\/(\d{2}|\d{4})$/);
    if (!match) return "Invalid expiry date";

    let [, mm, yy] = match;

    if (yy.length === 2) {
        yy = "20" + yy;
    }

    const month = Number(mm);
    const year = Number(yy);

    if (month < 1 || month > 12) {
        return "Invalid expiry date";
    }

    const now = new Date();
    const expiryDate = new Date(year, month - 1, 1);

    if (expiryDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
        return "Card has expired";
    }

    return "";
}

export default function validatePayment(payment) {
    if (payment.method !== "card") return null;

    const errors = {
        card_holder_name: payment.card_holder_name.trim() ? "" : "Card holder name is required",
        card_number: /^\d{16}$/.test(payment.card_number.replace(/\s+/g, "")) ? "" : "Invalid card number",
        expiry: validateExpiry(payment.expiry),
        cvv: /^\d{3,4}$/.test(payment.cvv) ? "" : "Invalid CVV"
    };

    const hasErrors = Object.values(errors).some(msg => msg !== "");

    return hasErrors ? errors : null;
}
