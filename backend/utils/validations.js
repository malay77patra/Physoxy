const { object, string, number } = require("yup");

const blogSchema = object({
    plan: string()
        .trim(),
    title: string()
        .trim()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    content: string()
        .trim()
        .required("Content is required")
        .min(10, "Content must be at least 10 characters")
        .max(5000, "Content must be less than 5000 characters")
}).strict().required("Blog details are required")

const eventSchema = object({
    plan: string()
        .trim(),
    title: string()
        .trim()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    content: string()
        .trim()
        .required("Content is required")
        .min(10, "Content must be at least 10 characters")
        .max(5000, "Content must be less than 5000 characters")
}).strict().required("Blog details are required")

const courseSchema = object({
    plan: string()
        .trim(),
    title: string()
        .trim()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    content: string()
        .trim()
        .required("Content is required")
        .min(10, "Content must be at least 10 characters")
        .max(5000, "Content must be less than 5000 characters")
}).strict().required("Blog details are required")

const upgradePlanSchema = object({
    type: string()
        .trim()
        .required("Subscription type is required")
        .oneOf(["monthly", "yearly"], "Subscription type must be either monthly or yearly"),
}).strict().required("Subscription details are required");

const packageSchema = object({
    name: string()
        .trim()
        .required("Package name is required")
        .matches(/^[A-Za-z]+$/, "Package name must contain only letters (no spaces or symbols)"),
    description: string()
        .trim()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(200, "Description must be less than 200 characters"),
    pricing: object({
        monthly: number()
            .required("Monthly price is required")
            .min(0, "Monthly price must be a positive number"),
        yearly: number()
            .required("Yearly price is required")
            .min(0, "Yearly price must be a positive number")
    }).required("Pricing is required")
}).strict().required();

const loginSchema = object({
    email: string()
        .trim()
        .lowercase()
        .email("Invalid email format")
        .required("Email is required"),
    password: string()
        .trim()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password must be less than 64 characters")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{6,}$/,
            "Password must contain at least one uppercase letter, one number, and one special character"),
}).strict().required();

const registerSchema = object({
    name: string()
        .trim()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be less than 50 characters")
        .matches(/^[A-Za-z\s'-]+$/, "Name can only contain letters, spaces, apostrophes, and hyphens"),
    email: string()
        .trim()
        .lowercase()
        .email("Invalid email format")
        .required("Email is required"),
    password: string()
        .trim()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password must be less than 64 characters")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{6,}$/,
            "Password must contain at least one uppercase letter, one number, and one special character"),
}).strict().required();


module.exports = {
    loginSchema,
    registerSchema,
    packageSchema,
    upgradePlanSchema,
    blogSchema,
    eventSchema,
    courseSchema,
};
