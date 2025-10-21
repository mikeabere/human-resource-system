import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  ...props
}) => {
  const className = `btn btn-${variant} btn-${size} ${
    fullWidth ? "btn-full" : ""
  } ${disabled || loading ? "btn-disabled" : ""}`;

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
