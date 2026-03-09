import { z } from "zod";
import { CATEGORY_MAP } from "./product.model.js";
import AppError from "../../utils/AppError.js";

const typeEnum = z.enum(["drinks", "cakes", "sandwiches", "biscuits", "crisps"]);

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" })
      .trim()
      .min(1, "Name cannot be empty")
      .max(50, "Name is too long"),

    price: z.number({ required_error: "Price is required" })
      .gt(0, "Price must be greater than zero"),

    type: typeEnum,

    category: z.string().optional(),

    url: z.union([
      z.string().trim().url("Invalid URL format"),
      z.literal("")
    ]).optional()
  }).strict()
})
  .superRefine((data, ctx) => {
    const { type, category } = data.body;
    const allowed = CATEGORY_MAP[type];

    if (!allowed) return;

    if (!category) {
      ctx.addIssue({
        path: ["body", "category"],
        message: "Category is required for this product type",
        code: z.ZodIssueCode.custom
      });
      return;
    }

    if (!allowed.includes(category)) {
      ctx.addIssue({
        path: ["body", "category"],
        message: `Invalid category for type ${type}`,
        code: z.ZodIssueCode.custom
      });
    }
  });

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string()
      .trim()
      .min(1, "Name cannot be empty")
      .max(50, "Name is too long")
      .optional(),

    price: z.number()
      .gt(0, "Price must be greater than zero")
      .optional(),

    type: typeEnum.optional(),

    category: z.string().optional(),

    url: z.union([
      z.string().trim().url("Invalid URL format"),
      z.literal("")
    ]).optional()
  }).strict(),

  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")
  })
})
  .superRefine((data, ctx) => {
    const { type, category } = data.body;

    const effectiveType = type;

    const allowed = CATEGORY_MAP[effectiveType];

    if (!allowed) return;

    if (!category) {
      ctx.addIssue({
        path: ["body", "category"],
        message: "Category is required for this product type",
        code: z.ZodIssueCode.custom
      });
      return;
    }

    if (!allowed.includes(category)) {
      ctx.addIssue({
        path: ["body", "category"],
        message: `Invalid category for type ${effectiveType}`,
        code: z.ZodIssueCode.custom
      });
    }
  });

export const querySchema = z.object({
    type: typeEnum.optional(),
    category: z.string().optional()
  }).strict()
  .superRefine((data, ctx) => {
    const { type, category } = data;
    if (!type && !category) {
      return;
    }
    else if (type === undefined && category) {
      throw new AppError(`Invalid request: no type specified for ${category}`, 400)
    }
    else {
        const allowed = CATEGORY_MAP[type];
      if (category && type && allowed) {
        
          if (!allowed.includes(category)) {
          ctx.addIssue({
            path: ["category"],
            message: `Invalid category ${category} for ${type}`,
            code: z.ZodIssueCode.custom
          })
        }
      }
      

      }
    }
  );