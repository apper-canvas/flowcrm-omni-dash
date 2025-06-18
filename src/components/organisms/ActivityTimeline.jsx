import { motion } from 'framer-motion';
import ActivityItem from '@/components/molecules/ActivityItem';

const ActivityTimeline = ({ activities, className = '' }) => {
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {sortedActivities.map((activity, index) => (
        <motion.div
          key={activity.Id}
          variants={staggerItem}
          className="relative"
        >
          {index < sortedActivities.length - 1 && (
            <div className="absolute left-4 top-8 w-px h-6 bg-surface-200" />
          )}
          <ActivityItem activity={activity} />
        </motion.div>
      ))}
      
      {sortedActivities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-surface-500">No activities yet</p>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityTimeline;