import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.html || options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name, password) => {
  const message = `
    <h2>Welcome to HRMS, ${name}!</h2>
    <p>Your account has been created successfully.</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Temporary Password:</strong> ${password}</p>
    <p>Please login and change your password immediately.</p>
    <p>Login URL: ${process.env.CLIENT_URL || "http://localhost:3000"}/login</p>
  `;

  await sendEmail({
    email,
    subject: "Welcome to HRMS - Account Created",
    html: message,
  });
};

// Send leave status update email
export const sendLeaveStatusEmail = async (employee, leave, status) => {
  const message = `
    <h2>Leave Request ${status}</h2>
    <p>Dear ${employee.firstName} ${employee.lastName},</p>
    <p>Your leave request has been <strong>${status}</strong>.</p>
    <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
    <p><strong>Duration:</strong> ${new Date(
      leave.startDate
    ).toLocaleDateString()} to ${new Date(
    leave.endDate
  ).toLocaleDateString()}</p>
    <p><strong>Number of Days:</strong> ${leave.numberOfDays}</p>
    ${
      leave.rejectionReason
        ? `<p><strong>Reason:</strong> ${leave.rejectionReason}</p>`
        : ""
    }
  `;

  await sendEmail({
    email: employee.email,
    subject: `Leave Request ${status}`,
    html: message,
  });
};


