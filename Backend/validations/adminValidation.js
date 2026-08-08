import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const addLawyerByAdminSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").describe("Name is required"),

  email: z.string().email("Invalid email format").describe("Email is required"),

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

  imageUrl: z.string().url("Invalid image URL").describe("Image is required"),
});

export const changeAvailabilitySchema = z.object({
  lawyerId: z.string().min(1, "Lawyer ID is required"),
});

export const cancelAppointmentByAdminSchema = z.object({
  appointmentId: z.string().min(1, "Appointment ID is required"),
});
