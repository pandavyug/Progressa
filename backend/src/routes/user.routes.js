const express = require("express")
const userController = require("../controllers/user.controller")
const authmiddleware = require("../middleware/auth.middleware")
const updateUserValidationRules = require("../middleware/validation.middleware").updateUserValidationRules;
const router = express.Router()

router.get("/getAllUsers",authmiddleware.authenticateToken,userController.getAllUsers)
router.get("/getUserById",authmiddleware.authenticateToken,userController.getUserById)
router.put("/updateUserById",authmiddleware.authenticateToken,updateUserValidationRules,userController.updateUserById)
router.delete("/deleteUserById",authmiddleware.authenticateToken,userController.deleteUserByID)


module.exports = router