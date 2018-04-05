const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: "Required Value" },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: "Required Value"
    },
    salary: Number,
    equity: Number
  },
  { timestamp: true }
);

const job = mongoose.model("job", jobSchema);

module.exports = job;
