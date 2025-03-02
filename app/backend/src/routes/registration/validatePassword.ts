import { body } from "express-validator";

export const validatePassword = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter")
  .matches(/\d/)
  .withMessage("Password must contain at least one number")
  
export const validateEmail = body("email")
  .isEmail()
  .withMessage("Invalid email format")
  .normalizeEmail();