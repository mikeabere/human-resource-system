import mongoose  from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reviewPeriod: {
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
    },
    reviewType: {
      type: String,
      enum: ["quarterly", "half-yearly", "annual", "probation"],
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ratings: {
      quality: {
        type: Number,
        min: 1,
        max: 5,
      },
      productivity: {
        type: Number,
        min: 1,
        max: 5,
      },
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      teamwork: {
        type: Number,
        min: 1,
        max: 5,
      },
      leadership: {
        type: Number,
        min: 1,
        max: 5,
      },
      punctuality: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    strengths: {
      type: String,
    },
    areasForImprovement: {
      type: String,
    },
    goals: [
      {
        title: String,
        description: String,
        deadline: Date,
        status: {
          type: String,
          enum: ["not-started", "in-progress", "completed", "delayed"],
          default: "not-started",
        },
      },
    ],
    achievements: [
      {
        title: String,
        description: String,
        date: Date,
      },
    ],
    feedback: {
      type: String,
    },
    recommendations: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "acknowledged"],
      default: "draft",
    },
    acknowledgedAt: {
      type: Date,
    },
    employeeComments: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate overall rating before saving
performanceSchema.pre("save", function (next) {
  if (this.ratings) {
    const ratingValues = Object.values(this.ratings).filter(
      (val) => val != null
    );
    if (ratingValues.length > 0) {
      const sum = ratingValues.reduce((acc, val) => acc + val, 0);
      this.overallRating = parseFloat((sum / ratingValues.length).toFixed(2));
    }
  }
  next();
});

export default mongoose.model("Performance", performanceSchema);
