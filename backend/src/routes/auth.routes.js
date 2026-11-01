const express = require("express");
const authController = require("../controllers/auth.controller");
const registerUserValidationRules = require("../middleware/validation.middleware").registerUserValidationRules;
const router = express.Router();


router.post("/register", registerUserValidationRules, authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/logout", authController.logoutUser);


module.exports = router;