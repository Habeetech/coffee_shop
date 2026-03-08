import { z } from "zod";

export const createBuscuitSchema = z.object({
     body: z.object({
        name: z.string({ required_error: "Name is required" })
          .trim()
          .min(1, "Name cannot be empty")
          .max(50, "Name is too long"),
    
        price: z.number({ required_error: "Price is required" })
          .gt(0, "Price must be greater than zero"),
    
        url: z.union([
          z.string().trim().url("Invalid URL format"),
          z.literal("")
        ]).optional()
      }).strict()
});

export const updateBuscuitSchema = z.object({
     body: z.object({
        name: z.string({ required_error: "Name is required" })
          .trim()
          .min(1, "Name cannot be empty")
          .max(50, "Name is too long").optional(),
    
        price: z.number({ required_error: "Price is required" })
          .gt(0, "Price must be greater than zero").optional(),
    
        url: z.union([
          z.string().trim().url("Invalid URL format"),
          z.literal("")
        ]).optional()
      }).strict(),
      
      params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")
  })
});