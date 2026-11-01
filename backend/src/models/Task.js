const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    T_id: {
      type: Number,
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
    Priority: {
      type: String,
      required: true,
    },
    Assigned_to: {
      type: Number,
      required: true,
    },
    Created_by: {
      type: Number,
      required: true,
    },
    Due_date: {
      type: String,
      required: true,
    },
    CreatedAt: {
      type: String,
      required: true,
    },
    UpdatedAt: {
      type: String,
      required: true,
    },
    CompletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: false,
  },
);
    taskSchema.index(
      {CompletedAt: 1},
      {expireAfterSeconds: 2592000} // 30 days in seconds
    )

const Task = mongoose.model("Task", taskSchema, "Tasks");

module.exports = Task;
