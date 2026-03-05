import { z } from "zod";

const categoryValues = [
  "hot-coffee",
  "iced-coffee",
  "tea",
  "iced-tea",
  "milkshake",
  "smoothies"
];

export const createDrinkSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" })
      .trim()
      .min(1, "Name cannot be empty")
      .max(50, "Name is too long"),

    price: z.number({ required_error: "Price is required" })
      .gt(0, "Price must be greater than zero"),

    category: z.enum(categoryValues, {
      required_error: "Category is required",
      errorMap: () => ({ message: "Please select a valid category" })
    }),

    url: z.union([
      z.string().trim().url("Invalid URL format"),
      z.literal("")
    ]).optional()
  }).strict()
});

export const updateDrinkSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" })
      .trim()
      .min(1, "Name cannot be empty")
      .max(50, "Name is too long")
      .optional(),

    price: z.number({ required_error: "Price is required" })
      .gt(0, "Price must be greater than zero")
      .optional(),

    category: z.enum(categoryValues, {
      required_error: "Category is required",
      errorMap: () => ({ message: "Please select a valid category" })
    })
      .optional(),

    url: z.string()
      .trim()
      .refine(
        val =>
          val === "" ||
          val.startsWith("/") ||
          /^https?:\/\/.+/.test(val),
        { message: "Invalid URL format" }
      )
      .optional()
  }).strict(),

  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")
  })
});