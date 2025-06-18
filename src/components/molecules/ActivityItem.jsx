import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const ActivityItem = ({ activity, className = '' }) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      meeting: 'Users',
      note: 'FileText',
      task: 'CheckSquare'
    };
    return icons[type] || 'Circle';
  };

  const getActivityColor = (type) => {
    const colors = {
      call: 'text-info bg-info/10',
      email: 'text-warning bg-warning/10',
      meeting: 'text-success bg-success/10',
      note: 'text-surface-600 bg-surface-100',
      task: 'text-secondary bg-secondary/10'
    };
    return colors[type] || 'text-surface-600 bg-surface-100';
  };

  return (
    <div className={`flex space-x-3 ${className}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
        <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">
              {activity.subject}
            </p>
            <p className="text-sm text-surface-600 mt-1 line-clamp-2">
              {activity.description}
            </p>
          </div>
          <time className="flex-shrink-0 text-xs text-surface-500 ml-3">
            {format(new Date(activity.date), 'MMM dd, HH:mm')}
          </time>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;