const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium', 
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-surface-100 text-surface-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info"
  };
  
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-2.5 py-1 text-sm",
    large: "px-3 py-1.5 text-base"
  };
  
  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;