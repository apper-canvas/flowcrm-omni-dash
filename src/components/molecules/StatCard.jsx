import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/molecules/Card';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon, 
  gradient = false,
  className = '' 
}) => {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-surface-500'
  };

  return (
    <Card 
      gradient={gradient}
      className={`p-6 ${gradient ? 'text-white' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-surface-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 ${gradient ? 'text-white' : 'text-surface-900'}`}>
            {value}
          </p>
          
          {change && (
            <div className="flex items-center mt-2 space-x-1">
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                className={`w-4 h-4 ${gradient ? 'text-white/80' : changeColors[changeType]}`} 
              />
              <span className={`text-sm font-medium ${gradient ? 'text-white/80' : changeColors[changeType]}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-lg ${gradient ? 'bg-white/20' : 'bg-surface-100'}`}>
            <ApperIcon 
              name={icon} 
              className={`w-6 h-6 ${gradient ? 'text-white' : 'text-surface-600'}`} 
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;