import Leave from "../models/LeaveModel.js";
import Employee from "../models/EmployeeModel.js";
import { sendLeaveStatusEmail } from "../utils/emailService.js";

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
export const applyLeave = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: "No employee profile found",
      });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    // Get employee to check leave balance
    const employee = await Employee.findById(req.user.employee);

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    if (leaveType !== "unpaid") {
      const balance = employee.leaveBalance[leaveType];
      if (balance < numberOfDays) {
        return res.status(400).json({
          success: false,
          message: `Insufficient ${leaveType} leave balance. Available: ${balance} days`,
        });
      }
    }

    const leave = await Leave.create({
      employee: req.user.employee,
      leaveType,
      startDate,
      endDate,
      numberOfDays,
      reason,
      status: "pending",
    });

    await leave.populate("employee", "firstName lastName employeeId email");

    res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my leave applications
// @route   GET /api/leaves/my-leaves
// @access  Private
export const getMyLeaves = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: "No employee profile found",
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    const query = { employee: req.user.employee };
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate("approvedBy", "email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Leave.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all leave applications
// @route   GET /api/leaves
// @access  Private/Admin/HR
export const getAllLeaves = async (req, res) => {
  try {
    const { status, leaveType, employeeId, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;
    if (employeeId) query.employee = employeeId;

    const leaves = await Leave.find(query)
      .populate("employee", "firstName lastName employeeId department")
      .populate("approvedBy", "email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Leave.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: leaves,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single leave application
// @route   GET /api/leaves/:id
// @access  Private
export const getLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("employee", "firstName lastName employeeId email department")
      .populate("approvedBy", "email");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    // Check if user has permission to view this leave
    const isOwner =
      leave.employee._id.toString() === req.user.employee?.toString();
    const isHROrAdmin = ["admin", "hr_manager"].includes(req.user.role);

    if (!isOwner && !isHROrAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this leave application",
      });
    }

    res.status(200).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve leave
// @route   PUT /api/leaves/:id/approve
// @access  Private/Admin/HR
export const approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate("employee");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Leave has already been processed",
      });
    }

    // Update leave status
    leave.status = "approved";
    leave.approvedBy = req.user._id;
    leave.approvalDate = Date.now();
    await leave.save();

    // Update employee leave balance
    if (leave.leaveType !== "unpaid") {
      const employee = await Employee.findById(leave.employee._id);
      employee.leaveBalance[leave.leaveType] -= leave.numberOfDays;
      await employee.save();
    }

    // Send email notification
    try {
      await sendLeaveStatusEmail(leave.employee, leave, "approved");
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject leave
// @route   PUT /api/leaves/:id/reject
// @access  Private/Admin/HR
export const rejectLeave = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const leave = await Leave.findById(req.params.id).populate("employee");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Leave has already been processed",
      });
    }

    leave.status = "rejected";
    leave.approvedBy = req.user._id;
    leave.approvalDate = Date.now();
    leave.rejectionReason = rejectionReason || "Not specified";
    await leave.save();

    // Send email notification
    try {
      await sendLeaveStatusEmail(leave.employee, leave, "rejected");
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel leave
// @route   PUT /api/leaves/:id/cancel
// @access  Private
export const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id).populate("employee");

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave application not found",
      });
    }

    // Check if user owns this leave
    if (leave.employee._id.toString() !== req.user.employee?.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this leave",
      });
    }

    if (leave.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Leave is already cancelled",
      });
    }

    // If leave was approved, restore leave balance
    if (leave.status === "approved" && leave.leaveType !== "unpaid") {
      const employee = await Employee.findById(leave.employee._id);
      employee.leaveBalance[leave.leaveType] += leave.numberOfDays;
      await employee.save();
    }

    leave.status = "cancelled";
    await leave.save();

    res.status(200).json({
      success: true,
      message: "Leave cancelled successfully",
      data: leave,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get leave balance
// @route   GET /api/leaves/balance
// @access  Private
export const getLeaveBalance = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: "No employee profile found",
      });
    }

    const employee = await Employee.findById(req.user.employee);

    res.status(200).json({
      success: true,
      data: employee.leaveBalance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
