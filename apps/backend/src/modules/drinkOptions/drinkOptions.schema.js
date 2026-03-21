import { z } from "zod";

const optionItemSchema = z.object({
    label: z.string({ required_error: "label name cannot be empty" })
        .trim().min(1, "label name is too short"),
    priceModifier: z.number({ required_error: "price modifier is required" })
        .min(0, "price modifier should be zero or greater")
}).strict()

const optionsGroupSchema = z.record(z.string(), z.array(optionItemSchema));
export const createDrinkOptions = z.object({
    body: z.object({
        options: optionsGroupSchema
    }).strict()
})

export const updateDrinksOptions = z.object({
    body: z.object({
        options: z.record(z.string(), z.array(optionItemSchema.extend({
            _id: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        })
        )
        )
    }).strict(),
})
export const deleteGroupSchema = z.object({
    params: z.object({
        groupName: z.string().trim().min(1, "Group name is required")
    })
});
export const deleteGroupItemSchema = z.object({
    params: z.object({
        groupName: z.string().trim().min(1, "Group name is required"),
        itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID format")
    })
});
