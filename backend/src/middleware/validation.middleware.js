const {body, validationResult} = require('express-validator');  


    async function validateResult(req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }

const registerUserValidationRules = [
    body("U_name")
        .isString()
        .withMessage("User name must be a string")
        .isLength({ min: 3, max: 30 })
        .withMessage("User name must be between 3 and 30 characters"),

    body("Email")
        .isEmail()
        .withMessage("Invalid email format"),

    body("Phone")
        .isMobilePhone()
        .withMessage("Invalid phone number format"),

    body("Password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),


    validateResult
]

const updateUserValidationRules = [
    body("U_name")
        .optional()
        .isString()
        .withMessage("User name must be a string")
        .isLength({ min: 3, max: 30 })
        .withMessage("User name must be between 3 and 30 characters"),

    body("Email")
        .optional()
        .isEmail()
        .withMessage("Invalid email format"),

    body("Phone")
        .optional()
        .isMobilePhone()
        .withMessage("Invalid phone number format"),

    validateResult
]


module.exports = {
    registerUserValidationRules,updateUserValidationRules
};