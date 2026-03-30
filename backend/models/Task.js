const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    deadline: {
      type: String,
      required: false,
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", TaskSchema);
