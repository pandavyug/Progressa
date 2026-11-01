const Task = require("../models/Task");
const User = require("../models/User");

async function createTask(req, res) {
  try {
    const { Title, Description, Status, Priority, Assigned_to, Due_date } =
      req.body;

    let assignedTo = req.user.U_id;

    if (
      Assigned_to !== undefined &&
      Assigned_to !== null &&
      Assigned_to !== "" &&
      (!Number.isInteger(Number(Assigned_to)) || Number(Assigned_to) <= 0)
    ) {
      return res.status(400).json({
        message: "Assigned_to must be a valid positive user ID",
      });
    }

    if (
      Assigned_to !== undefined &&
      Assigned_to !== null &&
      Assigned_to !== ""
    ) {
      const assignedUser = await User.findOne({ U_id: Assigned_to });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }

      assignedTo = assignedUser.U_id;
    }
    const lastTask = await Task.findOne()
      .sort({ T_id: -1 })
      .select("T_id")
      .lean();

    const T_id = lastTask ? lastTask.T_id + 1 : 101;

    function dateGenerater() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");

      const monthNames = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ];

      const month = monthNames[today.getMonth()];
      const year = today.getFullYear();
      const FinalDate = `${day}-${month}-${year}`;

      return FinalDate;
    }

    const CreatedAt = dateGenrater();

    const taskStatus = Status || "Pending";
    const taskPriority = Priority || "Medium";

    const task = await Task.create({
      T_id,
      Title,
      Description,
      Status: taskStatus,
      Priority: taskPriority,
      Assigned_to: assignedTo,
      Created_by: req.user.U_id,
      Due_date,
      CreatedAt: CreatedAt,
      UpdatedAt: CreatedAt,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getAllTasks(req, res) {
  try {
    const Tasks = await Task.find({ Created_by: req.user.U_id });

    if (!Tasks) {
      return res.status(404).json({
        message: "There is no Task right now",
      });
    }

    res.status(200).json({
      message: "Tasks fetched successfully",
      Tasks: Tasks,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getTaskById(req, res) {
  try {
    const T_id = req.params.T_id;
    const U_id = req.user.U_id;

    const task = await Task.findOne({ T_id: T_id });

    if (!task) {
      return res.status(404).json({
        message: "Task not found !!",
      });
    }

    function success() {
      return res.status(200).json({
        message: "Task fetch successfully",
        Task: task,
      });
    }

    if (U_id !== task.Created_by) {
      if (U_id !== task.Assigned_to) {
        return res.status(403).json({
          message: "You Don't have access for this Task",
        });
      } else {
        return success();
      }
    } else {
      return success();
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateTaskById(req, res) {
  try {
    const { Title, Description, Priority, Assigned_to, Due_date, Status } =
      req.body;

    const T_id = req.params.T_id;
    const U_id = req.user.U_id;

    const task = await Task.findOne({ T_id: T_id });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    function dateGenerater() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");

      const monthNames = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "jun",
        "jul",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec",
      ];

      const month = monthNames[today.getMonth()];
      const year = today.getFullYear();
      const FinalDate = `${day}-${month}-${year}`;

      return FinalDate;
    }



    if (
      Assigned_to !== undefined &&
      Assigned_to !== null &&
      Assigned_to !== "" &&
      (!Number.isInteger(Number(Assigned_to)) || Number(Assigned_to) <= 0)
    ) {
      return res.status(400).json({
        message: "Assigned_to must be a valid positive user ID",
      });
    }

    if (
      Assigned_to !== undefined &&
      Assigned_to !== null &&
      Assigned_to !== ""
    ) {
      const assignedUser = await User.findOne({ U_id : Assigned_to });

      if (!assignedUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    function setCompletedAt() {
      if(Status === "Completed") {
        task.CompletedAt = new Date();
      }
      else if(Status === "Pending" || Status === "In Progress") {
        task.CompletedAt = null;
      }
    }

    async function allValueChange() {
      task.Title = Title ?? task.Title;
      task.Description = Description ?? task.Description;
      task.Priority = Priority ?? task.Priority;
      task.Assigned_to = Assigned_to ?? task.Assigned_to;
      task.Due_date = Due_date ?? task.Due_date;

      task.Status = Status ?? task.Status;
      const UpdatedAt = dateGenerater();   
      task.UpdatedAt = UpdatedAt;
      
      setCompletedAt();

      await task.save();
    }

    async function statusChange() {
      task.Status = Status ?? task.Status;
      const UpdatedAt = dateGenerater();

      task.UpdatedAt = UpdatedAt;
      setCompletedAt();

      await task.save();
    }

    function succeess() {
      return res.status(200).json({
        message: "Task Updated Successfully",
        Task: task,
      });
    }

    if (U_id == task.Created_by) {
      await allValueChange();
      return succeess();
    } else if (U_id == task.Assigned_to) {
      await statusChange();
      return succeess();
    } else {
      return res.status(403).json({
        message: "You don't have access to Update this task!!",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function deleteTaskById(req,res) {
  try{
    const T_id = req.params.T_id;
    const U_id = req.user.U_id

    const task = await Task.findOne({T_id})

    if (!task){
      return res.status(404).json({
        message:"Task not found"
      })
    }

  if(U_id !== task.Created_by){
    return res.status(403).json({
      message:"You can't Delete this task"
    })
  }

  await task.deleteOne()

   res.status(200).json({
      message:"Task Deleted successfully",
      Task:task
    })

  }catch(error){
    return  res.status(400).json({
      message: error.message,
    });
  }
}



module.exports = { createTask, getAllTasks, getTaskById, updateTaskById ,deleteTaskById};
