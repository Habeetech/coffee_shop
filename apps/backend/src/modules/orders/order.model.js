import mongoose from "mongoose";
import { CATEGORY_MAP } from "../products/product.model";

export const orderSchema = new mongoose.Schema({
    items: [{
        _id: {
            type: String,
            required: [true, "Product id is required"],
            trim: true,
        },
        name: {
            type: String,
            required: [true, "product name is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Product price must be greater than zero"]
        },
        basePrice: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Product price must be greater than zero"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity must be greater than zero"]
        },
        type: {
            type: String,
            required: [true, "Product type is required"],
            enum: ["drinks", "cakes", "sandwiches", "biscuits", "crisps"]
        },
        url: {
            type: String,
            default: "",
            required: [true, "Product url is required"],
            trim: true
        },
        options: {
            type: mongoose.Schema.Types.Mixed
        },
        category: {
            type: String,
            required: function () {
                return Boolean(CATEGORY_MAP[this.type]);
            },
            validate: {
                validator: function (value) {
                    if (!this.type || !value) return true;
                    const allowed = CATEGORY_MAP[this.type];
                    if (!allowed) return true;
                    return allowed.includes(value);
                },
                message: props =>
                    `${props.value} is not a valid category for type ${this.type}`
            }
        },
    }],
    customer: {
        type:
        {
            firstName: {
                type: String,
                required: [true, "Customer first name is required"],
                trim: true,
            },
            lastName: {
                type: String,
                required: [true, "Customer last name is required"],
                trim: true,
            },
            email: {
                type: String,
                required: [true, "Customer email is required"],
                trim: true
            },
            deliveryOption: {
                type: String,
                required: [true, "Delivery option is required"],
                enum: ["delivery", "collection"]
            },
            address: {
                type: {
                    street: {
                        type: String,
                        trim: true,
                        required: [function () {
                            return Boolean(this.parent().deliveryOption === "delivery")
                        }, "Street is required"]
                    },
                    city: {
                        type: String,
                        trim: true,
                        required: [function () {
                            return Boolean(this.parent().deliveryOption === "delivery")
                        }, "City is required"]
                    },
                    state: {
                        type: String,
                        trim: true,
                        required: [function () {
                            return Boolean(this.parent().deliveryOption === "delivery")
                        }, "State is required"]
                    },
                    country: {
                        type: String,
                        trim: true,
                        required: [function () {
                            return Boolean(this.parent().deliveryOption === "delivery")
                        }, "Country is required"]
                    },
                    postal: {
                        type: String,
                        trim: true,
                        required: [function () {
                            return Boolean(this.parent().deliveryOption === "delivery")
                        }, "Postal code is required"]
                    },
                    required: [function () {
                        return Boolean(this.parent().deliveryOption === "delivery")
                    }, "Address field is mandatory"]
                }
            },
        },
        required: [true, "Customer information is mandatory"]
    },
    total: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "total amount must be greater than zero"]
    },
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["pending", "paid", "preparing", "completed"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        enum: ["stripe", "collection"]
    },
    stripeId: {
        type: String,
        trim: true
    }

}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema);
export default Order;