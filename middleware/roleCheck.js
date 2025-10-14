// Middleware to authorize based on user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
};

// Check if user is HR manager or admin
const isHROrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" || req.user.role === "hr_manager")
  ) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "HR Manager or Admin access required",
    });
  }
};

// Check if user can access their own data
const isOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = req.params.id || req.params.userId;
  const currentUserId = req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  const isHR = req.user.role === "hr_manager";

  if (isAdmin || isHR || currentUserId === requestedUserId) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "You can only access your own data",
    });
  }
};

module.exports = {
  authorize,
  isAdmin,
  isHROrAdmin,
  isOwnerOrAdmin,
};
