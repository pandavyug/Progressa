const express = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const taskController = require("../controllers/task.controller");
const router = express.Router();

router.post("/createTask", authmiddleware.authenticateToken, taskController.createTask);
router.get("/getAllTasks", authmiddleware.authenticateToken, taskController.getAllTasks);
router.get("/getTaskById/:T_id", authmiddleware.authenticateToken, taskController.getTaskById);
router.put("/updateTaskById/:T_id", authmiddleware.authenticateToken, taskController.updateTaskById);
router.delete("/deleteTaskById/:T_id", authmiddleware.authenticateToken, taskController.deleteTaskById);

module.exports = router;