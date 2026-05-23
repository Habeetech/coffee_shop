import stripe from "stripe";
import AppError from "../../utils/AppError.js";
import Product from "../products/product.model.js";
import drinkOptions from "../drinkOptions/drinkOptions.model.js";

const secret_key = process.env.STRIPE_SECRET_KEY;
const stripeInstance = new stripe(secret_key);

async function calculateTotal(items) {

    const products = await Product.find();
    const options = await drinkOptions.findOne()
    const productsArray = products.map(p => [p._id.toString(), p]);
    const productsMap = new Map(productsArray)

    const flatOptions = Array.from(options.options.values()).flat();

    const optionsArray = flatOptions.map(o => [o._id.toString(), o])
    const optionsMap = new Map(optionsArray);

    const total = items.reduce((acc, item) => {
        const itemId = item.id || item._id;
        if (!productsMap.has(itemId)) {
            console.log(`Product ${itemId} does not exist`);
            throw new AppError(`Product ${itemId} does not exist`, 404);
        }
        acc += productsMap.get(itemId).price * item.quantity;
        if (item.options) {
            Object.values(item.options).forEach(option => {
                if (Array.isArray(option)) {
                    option.forEach(extra => {
                        const optionId = extra.id || extra._id;
                        if (!optionsMap.has(optionId)) {
                            throw new AppError(`Option ${optionId} does not exist`, 404);
                        }
                        acc += optionsMap.get(optionId).priceModifier;
                    });
                } else {
                    const optionId = option.id || option._id;
                    if (!optionsMap.has(optionId)) {
                        throw new AppError(`Option ${optionId} does not exist`, 404);
                    }
                    acc += optionsMap.get(optionId).priceModifier;
                }
            });

        }
        return acc;
    }, 0)
    return Math.round(total * 100);
}

export async function createPaymentIntent(items, amount, currency = "gbp") {
    const total = await calculateTotal(items);
    if (total != amount) {
        console.log(`Amount Recieved: ${amount}, Amount Calculated: ${total}`);
        throw new AppError("Wrong amount recieved", 400);
    }
    const intent = await stripeInstance.paymentIntents.create({
        amount: total,
        currency: currency,
        automatic_payment_methods: { enabled: true }
    });
    return { clientSecret: intent.client_secret };
}
export async function updatePaymentIntent(orderId, paymentId) {
    const update = await stripeInstance.paymentIntents.update(paymentId, {
        metadata: { orderId: orderId.toString() }
    });

    if (!update || update.metadata.orderId !== orderId.toString()) {
        throw new AppError("Failed to verify metadata update on Stripe", 500);
    }
    return true;
}
