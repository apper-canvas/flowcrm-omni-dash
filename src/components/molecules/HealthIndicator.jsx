import { motion } from 'framer-motion';

const HealthIndicator = ({ score, size = 'medium', showLabel = true }) => {
  const sizes = {
    small: { width: 40, height: 40, strokeWidth: 3, fontSize: 'text-xs' },
    medium: { width: 60, height: 60, strokeWidth: 4, fontSize: 'text-sm' },
    large: { width: 80, height: 80, strokeWidth: 5, fontSize: 'text-base' }
  };
  
  const { width, height, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getHealthColor = (score) => {
    if (score >= 80) return '#10B981'; // success
    if (score >= 60) return '#F59E0B'; // warning
    return '#EF4444'; // error
  };
  
  const healthColor = getHealthColor(score);

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <svg width={width} height={height} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke={healthColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Score text */}
        <div className={`absolute inset-0 flex items-center justify-center ${fontSize} font-semibold`}>
          {score}
        </div>
      </div>
      
      {showLabel && (
        <div className="text-sm">
          <div className="font-medium text-surface-900">Health Score</div>
          <div 
            className="text-xs font-medium"
            style={{ color: healthColor }}
          >
            {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'At Risk'}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthIndicator;