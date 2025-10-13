import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      enum: ["annual", "sick", "casual", "maternity", "paternity", "unpaid"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvalDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate number of days before saving
leaveSchema.pre("save", function (next) {
  if (
    (this.startDate && this.endDate && this.isModified("startDate")) ||
    this.isModified("endDate")
  ) {
    const timeDiff = this.endDate - this.startDate;
    this.numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  }
  next();
});

// Validate that end date is after start date
leaveSchema.pre("save", function (next) {
  if (this.endDate < this.startDate) {
    next(new Error("End date must be after start date"));
  }
  next();
});

export default mongoose.model("Leave", leaveSchema);
