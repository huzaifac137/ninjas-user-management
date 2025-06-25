import { body } from "express-validator";
import { validateRequest } from "../middlewares";
export const validateSignup = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Please enter your name"),
  body("email")
    .notEmpty()
    .withMessage("email must not be empty")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
];

export const validateLogin = [
  body("email")
  .notEmpty()
  .withMessage("Email must not be empty")
  .isEmail()
  .withMessage("Email must be valid"),
body("password")
  .notEmpty()
  .withMessage("Please enter your password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long"),
body("roleId")
 .notEmpty()
  .withMessage("Please select a roleId")
  .isMongoId()
  .withMessage("Please select a valid roleId"),
  validateRequest,
];

export const validateCreateUser = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Please enter your name"),
  body("email")
    .notEmpty()
    .withMessage("email must not be empty")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
    body("roleId")
 .notEmpty()
  .withMessage("Please select a roleId")
  .isMongoId()
  .withMessage("Please select a valid roleId"),
  validateRequest,
];

export const validateUpdateUser=[
  body("name")
  .optional()
  .notEmpty()
  .withMessage("Please enter your name"),
body("email")
   .optional()
  .isEmail()
  .withMessage("Email must be valid"),
  validateRequest
]