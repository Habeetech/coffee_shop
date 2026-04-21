
import { z } from "zod";
import { CATEGORY_MAP } from "../products/product.model.js";


const typeEnum = z.enum(["drinks", "cakes", "sandwiches", "biscuits", "crisps"]);

export const createOrderSchema = z.object({
    body: z.object({
        userId: z.string().optional(),
        items: z.array(z.object({
            _id: z.string({ required_error: "Product id is required" })
                .trim(),
            name: z.string({ required_error: "Product name is required" })
                .trim(),
            price: z.number({ required_error: "The price of the product is required" })
                .gt(0, "The price of the product must be greater than zero"),
            basePrice: z.number({ required_error: "The base price of the product is required" })
                .gt(0, "The base price of the product must be greater than zero"),
            quantity: z.number({ required_error: "Product quantity is required" })
                .gt(0, "Product quantity must be greater than zero"),
            type: typeEnum,

            url: z.string()
                .trim()
                .regex(/^(\/|http|https).+\.(jpg|jpeg|png|webp|avif|gif)$/i, "Invalid image path or URL format")
                .or(z.literal(""))
                .optional(),
            options: z.record(z.string(), z.object({
                label: z.string(),
                _id: z.string()
            })).optional(),

            category: z.string().optional()
        })),
        customer: z.object({
            firstName: z.string({ required_error: "Customer first name is required" })
                .trim(),
            lastName: z.string({ required_error: "Customer last name is required" })
                .trim(),
            email: z.string({ required_error: "Customer email is required" })
                .email()
                .trim(),
            deliveryOption: z.enum(["delivery", "collection"]),
            address: z.object({
                street: z.string({ required_error: "Street is required" })
                    .trim()
                    .optional(),
                city: z.string({ required_error: "City is required" })
                    .trim()
                    .optional(),
                state: z.string({ required_error: "State is required" })
                    .trim()
                    .optional(),
                country: z.string({ required_error: "Country is required" })
                    .trim()
                    .optional(),
                postal: z.string({ required_error: "Postal code is required" })
                    .trim()
                    .optional(),
            })
        }),
        total: z.number({ required_error: "Total amount is required" })
            .gt(0, "total must be greater than zero"),
        status: z.enum(["pending", "paid", "preparing", "completed", "cancelled"]),
        paymentMethod: z.enum(["stripe", "collection"]),
        stripeId: z.string()
            .trim()
            .optional()
    })
}).superRefine((data, ctx) => {
    const items = data.body.items;

    const { deliveryOption } = data.body.customer;
    const { street, city, state, country, postal } = data.body.customer.address;
    const { paymentMethod, stripeId } = data.body;

    if (paymentMethod === "stripe" && (!stripeId || stripeId.trim() === "")) {
        ctx.addIssue({
            path: ["body", "stripeId"],
            message: "Stripe ID is required for Stripe payments",
            code: z.ZodIssueCode.custom
        });
    }
    if (deliveryOption === "delivery") {
        if (!street || !city || !state || !country || !postal) {
            ctx.addIssue({
                path: ["body", "customer", "address"],
                message: "Address is required for delivery",
                code: z.ZodIssueCode.custom
            })
        }

    }
    items.forEach((item, index) => {
        const { type, category } = item;
        const allowed = CATEGORY_MAP[type];

        if (!allowed) {
            return;
        };

        if (!category) {
            ctx.addIssue({
                path: ["body", "item", index, "category"],
                message: "Category is required for this product type",
                code: z.ZodIssueCode.custom
            });
            return;
        }

        if (!allowed.includes(category)) {
            ctx.addIssue({
                path: ["body", "item", index, "category"],
                message: `Invalid category for type ${type}`,
                code: z.ZodIssueCode.custom
            });
        }
    }
    )
})

export const updateOrderSchema = z.object({
    body: z.object({

        status: z.enum(["pending", "paid", "preparing", "completed", "cancelled"]).optional(),


        stripeId: z.string().trim().optional(),


        customer: z.object({
            deliveryOption: z.enum(["delivery", "collection"]).optional(),

            address: z.object({
                street: z.string().trim().optional(),
                city: z.string().trim().optional(),
                state: z.string().trim().optional(),
                country: z.string().trim().optional(),
                postal: z.string().trim().optional(),
            }).optional()
        }).optional()
    })
});