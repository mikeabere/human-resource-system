import Attendance from '../models/Attendance';
import Employee from '../models/Employee';

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: 'No employee profile found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employee: req.user.employee,
      date: { $gte: today }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today'
      });
    }

    const attendance = await Attendance.create({
      employee: req.user.employee,
      date: new Date(),
      checkIn: new Date(),
      location: req.body.location
    });

    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check out
// @route   PUT /api/attendance/checkout
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: 'No employee profile found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: req.user.employee,
      date: { $gte: today },
      checkOut: null
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No check-in record found for today'
      });
    }

    attendance.checkOut = new Date();
    if (req.body.location) {
      attendance.location.checkOut = req.body.location;
    }
    await attendance.save();

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get my attendance records
// @route   GET /api/attendance/my-records
// @access  Private
exports.getMyAttendance = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: 'No employee profile found'
      });
    }

    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { employee: req.user.employee };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Attendance.countDocuments(query);

    // Calculate total work hours
    const totalHours = attendance.reduce((sum, record) => sum + (record.workHours || 0), 0);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalWorkHours: totalHours.toFixed(2),
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private/Admin/HR
exports.getAllAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (employeeId) query.employee = employeeId;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName employeeId department')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance by employee ID
// @route   GET /api/attendance/employee/:employeeId
// @access  Private/Admin/HR
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { employee: req.params.employeeId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query)
      .populate('employee', 'firstName lastName employeeId')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Attendance.countDocuments(query);

    // Calculate statistics
    const totalHours = attendance.reduce((sum, record) => sum + (record.workHours || 0), 0);
    const totalOvertime = attendance.reduce((sum, record) => sum + (record.overtime || 0), 0);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      statistics: {
        totalWorkHours: totalHours.toFixed(2),
        totalOvertime: totalOvertime.toFixed(2),
        averageWorkHours: count > 0 ? (totalHours / count).toFixed(2) : 0
      },
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin/HR
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    Object.assign(attendance, req.body);
    await attendance.save();

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get attendance summary
// @route   GET /api/attendance/summary/stats
// @access  Private/Admin/HR
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const startDate = new Date(year || new Date().getFullYear);//will look into this
  }
   catch(error) {
      res.status(500).json({
      success: false,
      message: error.message
    });
  }
}