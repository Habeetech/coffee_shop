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
        if(!productsMap.has(item.id)) {
            throw new AppError("Product does not exist", 404);
        }
        acc += productsMap.get(item.id).price * item.quantity;
        if (item.options) {
            item.options.forEach(option => {
                if (!optionsMap.has(option.id)) {
                    throw new AppError("Option does not exist", 404);
                }
                acc += optionsMap.get(option.id).priceModifier
            })
        }
        return acc;
    }, 0)

    return Math.round(total  * 100);
}

export async function createPaymentIntent(items, amount =1050, currency="gbp") {
    console.log(items);
    const total = await calculateTotal(items);
   /*  if (total != amount) {
        console.log(`Amount Recieved: ${amount}, Amount Calculated: ${total}`);
        throw new AppError("Wrong amount recieved", 400);
    } */
    const intent = await stripeInstance.paymentIntents.create({
        amount: amount,
        currency: currency,
        automatic_payment_methods: { enabled: true}
    });
    return {clientSecret: intent.client_secret};
}