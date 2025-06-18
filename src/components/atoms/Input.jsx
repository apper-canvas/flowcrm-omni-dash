import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const { type = 'text', placeholder, disabled, ...restProps } = props;
  
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg text-sm
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:bg-surface-50 disabled:cursor-not-allowed
    ${error ? 'border-error focus:border-error focus:ring-error/50' : 'border-surface-300'}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-4 h-4 text-surface-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          {...restProps}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-4 h-4 text-surface-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-surface-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;