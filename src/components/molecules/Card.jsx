import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  gradient = false,
  hover = true,
  onClick,
  ...props 
}) => {
  const baseClasses = `
    bg-white rounded-lg border border-surface-200 
    ${gradient ? 'bg-gradient-to-br from-white to-surface-50' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const cardProps = {
    className: baseClasses,
    ...props
  };

  if (hover) {
    return (
      <motion.div
        whileHover={{ 
          scale: onClick ? 1.02 : 1.01,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        {...cardProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} {...cardProps}>
      {children}
    </div>
  );
};

export default Card;