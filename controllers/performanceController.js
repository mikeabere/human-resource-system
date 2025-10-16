import Performance from "../models/PerformanceModel.js";
import Employee from "../models/EmployeeModel.js";

// @desc    Create performance review
// @route   POST /api/performance
// @access  Private/Admin/HR
export const createPerformanceReview = async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      reviewer: req.user._id,
    };

    const performance = await Performance.create(reviewData);
    await performance.populate(
      "employee",
      "firstName lastName employeeId department"
    );

    res.status(201).json({
      success: true,
      message: "Performance review created successfully",
      data: performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all performance reviews
// @route   GET /api/performance
// @access  Private/Admin/HR
export const getAllPerformanceReviews = async (req, res) => {
  try {
    const { employeeId, reviewType, status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (employeeId) query.employee = employeeId;
    if (reviewType) query.reviewType = reviewType;
    if (status) query.status = status;

    const reviews = await Performance.find(query)
      .populate("employee", "firstName lastName employeeId department position")
      .populate("reviewer", "email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Performance.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my performance reviews
// @route   GET /api/performance/my-reviews
// @access  Private
export const getMyPerformanceReviews = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: "No employee profile found",
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const reviews = await Performance.find({ employee: req.user.employee })
      .populate("reviewer", "email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Performance.countDocuments({
      employee: req.user.employee,
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single performance review
// @route   GET /api/performance/:id
// @access  Private
export const getPerformanceReview = async (req, res) => {
  try {
    const review = await Performance.findById(req.params.id)
      .populate("employee", "firstName lastName employeeId department position")
      .populate("reviewer", "email");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Performance review not found",
      });
    }

    // Check if user has permission to view this review
    const isOwner =
      review.employee._id.toString() === req.user.employee?.toString();
    const isHROrAdmin = ["admin", "hr_manager"].includes(req.user.role);
    const isReviewer =
      review.reviewer._id.toString() === req.user._id.toString();

    if (!isOwner && !isHROrAdmin && !isReviewer) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this review",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update performance review
// @route   PUT /api/performance/:id
// @access  Private/Admin/HR
export const updatePerformanceReview = async (req, res) => {
  try {
    const review = await Performance.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Performance review not found",
      });
    }

    // Don't allow updating if already acknowledged
    if (review.status === "acknowledged" && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot update acknowledged review",
      });
    }

    Object.assign(review, req.body);
    await review.save();

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete performance review
// @route   DELETE /api/performance/:id
// @access  Private/Admin
export const deletePerformanceReview = async (req, res) => {
  try {
    const review = await Performance.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Performance review not found",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Performance review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Acknowledge performance review
// @route   PUT /api/performance/:id/acknowledge
// @access  Private
export const acknowledgeReview = async (req, res) => {
  try {
    const { employeeComments } = req.body;

    const review = await Performance.findById(req.params.id).populate(
      "employee"
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Performance review not found",
      });
    }

    // Check if user owns this review
    if (review.employee._id.toString() !== req.user.employee?.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to acknowledge this review",
      });
    }

    if (review.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Review must be in submitted status to acknowledge",
      });
    }

    review.status = "acknowledged";
    review.acknowledgedAt = Date.now();
    if (employeeComments) {
      review.employeeComments = employeeComments;
    }
    await review.save();

    res.status(200).json({
      success: true,
      message: "Performance review acknowledged successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Submit performance review
// @route   PUT /api/performance/:id/submit
// @access  Private/Admin/HR
export const submitReview = async (req, res) => {
  try {
    const review = await Performance.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Performance review not found",
      });
    }

    if (review.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft reviews can be submitted",
      });
    }

    review.status = "submitted";
    await review.save();

    res.status(200).json({
      success: true,
      message: "Performance review submitted successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get performance statistics for employee
// @route   GET /api/performance/employee/:employeeId/stats
// @access  Private/Admin/HR
export const getEmployeePerformanceStats = async (req, res) => {
  try {
    const reviews = await Performance.find({
      employee: req.params.employeeId,
      status: "acknowledged",
    }).sort({ createdAt: -1 });

    if (reviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No performance reviews found",
        data: null,
      });
    }

    // Calculate average ratings
    const avgRatings = {
      quality: 0,
      productivity: 0,
      communication: 0,
      teamwork: 0,
      leadership: 0,
      punctuality: 0,
      overall: 0,
    };

    reviews.forEach((review) => {
      Object.keys(review.ratings).forEach((key) => {
        if (review.ratings[key]) {
          avgRatings[key] += review.ratings[key];
        }
      });
      avgRatings.overall += review.overallRating;
    });

    Object.keys(avgRatings).forEach((key) => {
      avgRatings[key] = (avgRatings[key] / reviews.length).toFixed(2);
    });

    res.status(200).json({
      success: true,
      data: {
        totalReviews: reviews.length,
        averageRatings: avgRatings,
        latestReview: reviews[0],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
