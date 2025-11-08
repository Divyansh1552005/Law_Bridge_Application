// we will create validations for incoming requests as this is possible user kuch bhi galat data bhej sakta hai

import { z } from "zod";

export const signupPostRequestBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
});

export const loginPostRequestBodySchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6),
});

// other request body schemas will be added later
export const updatePatchRequestBodySchemaforUser = z.object({
  userId: z
    .string({ required_error: "User ID is required" })
    .min(1, "User ID cannot be empty"),

  name: z.string().min(1, "Name cannot be empty").optional(),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be a valid 10-digit number")
    .optional(),

  dob: z.string().min(1, "Date of Birth cannot be empty").optional(),

  gender: z.enum(["Male", "Female", "Other", "Not Selected"]).optional(),

  address: z
    .union([
      z.string(), // in case frontend sends JSON string (FormData)
      z.object({
        Location: z.string().optional(),
        City: z.string().optional(),
        State: z.string().optional(),
      }),
    ])
    .optional(),
});

export const updatePatchRequestBodySchemaForLawyer = z.object({
  lawyerId: z
    .string({ required_error: "Lawyer ID is required" })
    .min(1, "Lawyer ID cannot be empty"),

  fees: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .optional(),

  address: z
    .union([
      z.string(), // for FormData cases
      z.object({
        line1: z.string().optional(),
        line2: z.string().optional(),
      }),
    ])
    .optional(),

  available: z
    .union([z.boolean(), z.string().transform((val) => val === "true")])
    .optional(),

  about: z
    .string()
    .min(20, "About section must be at least 20 characters long")
    .optional(),
});

// schema for adding lawyer by admin
export const addLawyerByAdminSchema = z.object({
  name: z
    .string()
    .min(1, "Name cannot be empty")
    .describe("Name is required"),

  email: z
    .string()
    .email("Invalid email format")
    .describe("Email is required"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .describe("Password is required"),

  speciality: z
    .string()
    .min(1, "Speciality cannot be empty")
    .describe("Speciality is required"),

  degree: z
    .string()
    .min(1, "Degree cannot be empty")
    .describe("Degree is required"),

  experience: z
    .string()
    .min(1, "Experience cannot be empty")
    .describe("Experience is required"),

  about: z
    .string()
    .min(1, "About cannot be empty")
    .describe("About section is required"),

  fees: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Fees must be a valid number" }),

  address: z
    .object({
      Location: z.string().min(1, "Location is required"),
      City: z.string().min(1, "City is required"),
      State: z.string().min(1, "State is required"),
    })
    .describe("Address object is required"),
});
