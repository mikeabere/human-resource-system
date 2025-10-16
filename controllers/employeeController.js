import Employee from "../models/EmployeeModel.js";
import User from "../models/UserModel.js";

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
export const getEmployees = async (req, res) => {
  try {
    const {
      department,
      position,
      status,
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const query = {};
    if (department) query.department = department;
    if (position) query.position = position;
    if (status) query.status = status;

    // Search by name or employee ID
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await Employee.find(query)
      .populate("user", "email role")
      .populate("manager", "firstName lastName employeeId")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Employee.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("user", "email role isActive")
      .populate("manager", "firstName lastName employeeId position");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create employee
// @route   POST /api/employees
// @access  Private/Admin/HR
export const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;

    // Check if email already exists
    const existingEmployee = await Employee.findOne({
      email: employeeData.email,
    });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Employee with this email already exists",
      });
    }

    const employee = await Employee.create(employeeData);

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin/HR
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Update employee
    Object.assign(employee, req.body);
    await employee.save();

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Delete associated user if exists
    if (employee.user) {
      await User.findByIdAndDelete(employee.user);
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get employee statistics
// @route   GET /api/employees/stats/overview
// @access  Private/Admin/HR
export const getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: "active" });
    const departmentStats = await Employee.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const positionStats = await Employee.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$position", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        departmentStats,
        positionStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my profile (for logged-in employee)
// @route   GET /api/employees/me/profile
// @access  Private
export const getMyProfile = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(404).json({
        success: false,
        message: "No employee profile found",
      });
    }

    const employee = await Employee.findById(req.user.employee).populate(
      "manager",
      "firstName lastName employeeId position"
    );

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update my profile
// @route   PUT /api/employees/me/profile
// @access  Private
export const updateMyProfile = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(404).json({
        success: false,
        message: "No employee profile found",
      });
    }

    // Fields that employees can update themselves
    const allowedUpdates = ["phone", "address", "emergencyContact"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const employee = await Employee.findByIdAndUpdate(
      req.user.employee,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
