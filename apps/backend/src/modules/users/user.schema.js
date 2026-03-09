import { z } from "zod";

export const loginSchema = z.object({
    body: z.object({
        usernameOrEmail: z.string({ required_error: "Please provide a username or email" })
            .trim()
            .min(1, "Username or email cannot be empty").max(50, "Username or email is too long"),

        password: z.string({ required_error: "Please provide a password" })
            .trim().min(1, "Password cannot be empty").max(100, "Password is too long")
    }).strict()
}).superRefine((data, ctx) => {
    const value = data.body.usernameOrEmail;

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isUsername = /^[a-zA-Z0-9._-]+$/.test(value);

    if (!isEmail && !isUsername) {
        ctx.addIssue({
            path: ["body", "usernameOrEmail"],
            message: "Must be a valid email or username",
            code: z.ZodIssueCode.custom
        });
    }
});

export const registerSchema = z.object({
  body: z.object({
    username: z.string({ required_error: "Username is required" })
      .trim()
      .min(1, "Username cannot be empty")
      .max(50, "Username is too long"),

    email: z.string({ required_error: "Email is required" })
      .trim()
      .min(1, "Email cannot be empty")
      .max(50, "Email is too long"),

    password: z.string({ required_error: "Password is required" })
      .trim()
      .min(1, "Password cannot be empty")
      .max(100, "Password is too long"),
    confirmPassword: z.string({ required_error: "Confirm password is required" })
      .trim()
      .min(1, "Confirm Password cannot be empty")
      .max(100, "Confirm password is too long"),
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),

    dateOfBirth: z.date().optional(),

    phone: z.string().trim().min(8).max(20).optional(),

    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postal: z.string().optional(),
    }).optional()
  }).strict()
})
.superRefine((data, ctx) => {
  const { email, username, password, confirmPassword} = data.body;

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isUsername = /^[a-zA-Z0-9._-]+$/.test(username);

  if (!isEmail) {
    ctx.addIssue({
      path: ["body", "email"],
      message: "Please provide a valid email address",
      code: z.ZodIssueCode.custom
    });
  }

  if (!isUsername) {
    ctx.addIssue({
      path: ["body", "username"],
      message: "Username may only contain letters, numbers, dots, underscores, and hyphens",
      code: z.ZodIssueCode.custom
    });

  }
  if (password !== confirmPassword) {
    ctx.addIssue({
      path: ["body", "confirmPassword"],
      message: "Your password do not match",
      code: z.ZodIssueCode.custom
    })
  }
});

export const updateUserSchema = z.object({
  body: z.object({
    username: z.string()
      .trim()
      .min(1, "Username cannot be empty")
      .max(50, "Username is too long").optional(),

    email: z.string()
      .trim()
      .min(1, "Email cannot be empty")
      .max(50, "Email is too long").optional(),
    firstName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50).optional(),

    dateOfBirth: z.date().optional(),

    phone: z.string().trim().min(8).max(20).optional(),

    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      postal: z.string().optional(),
    }).optional()
  }).strict()
})
.superRefine((data, ctx) => {
  const { email, username} = data.body;

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isUsername = /^[a-zA-Z0-9._-]+$/.test(username);

  if (email && !isEmail) {
    ctx.addIssue({
      path: ["body", "email"],
      message: "Please provide a valid email address",
      code: z.ZodIssueCode.custom
    });
  }

  if (username && !isUsername) {
    ctx.addIssue({
      path: ["body", "username"],
      message: "Username may only contain letters, numbers, dots, underscores, and hyphens",
      code: z.ZodIssueCode.custom
    });

  }
});

export const changePasswordSchema = z.object({
  body: z.object({
     password: z.string({ required_error: "Password is required" })
      .trim()
      .min(1, "Password cannot be empty")
      .max(100, "Password is too long"),
    confirmPassword: z.string({ required_error: "Confirm password is required" })
      .trim()
      .min(1, "Confirm Password cannot be empty")
      .max(100, "Confirm password is too long"),
  }).strict()
}).superRefine((data, ctx) => {
  const {password, confirmPassword} = data.body;
  if (password !== confirmPassword) {
    ctx.addIssue({
      path: ["body", "confirmPassword"],
      message: "Your password do not match",
      code: z.ZodIssueCode.custom
    })
  }
})