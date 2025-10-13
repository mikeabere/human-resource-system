import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-day", "late", "on-leave"],
      default: "present",
    },
    workHours: {
      type: Number,
      default: 0,
    },
    overtime: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    location: {
      checkIn: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
      checkOut: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Calculate work hours before saving
attendanceSchema.pre("save", function (next) {
  if (this.checkIn && this.checkOut) {
    const hours = (this.checkOut - this.checkIn) / (1000 * 60 * 60);
    this.workHours = parseFloat(hours.toFixed(2));

    // Calculate overtime (assuming 8 hours standard work day)
    if (this.workHours > 8) {
      this.overtime = parseFloat((this.workHours - 8).toFixed(2));
    }
  }
  next();
});

export default  mongoose.model("Attendance", attendanceSchema);
