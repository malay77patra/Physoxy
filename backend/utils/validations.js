const { object, string } = require("yup");

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
    registerSchema
};
