import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/molecules/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const DealCard = ({ deal, onStageChange, onEdit, className = '' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return 'success';
    if (probability >= 50) return 'warning';
    return 'error';
  };

  const getStageColor = (stage) => {
    const colors = {
      'Lead': 'default',
      'Qualified': 'info',
      'Demo': 'warning',
      'Negotiation': 'secondary',
      'Closed': 'success'
    };
    return colors[stage] || 'default';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={className}
    >
      <Card className="p-4 shadow-soft">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-surface-900 text-sm leading-tight">
              {deal.title}
            </h3>
            <button
              onClick={() => onEdit?.(deal)}
              className="p-1 rounded hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="MoreHorizontal" className="w-4 h-4 text-surface-400" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-surface-900">
              {formatCurrency(deal.value)}
            </span>
            <Badge variant={getStageColor(deal.stage)} size="small">
              {deal.stage}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-600">Probability</span>
              <Badge variant={getProbabilityColor(deal.probability)} size="small">
                {deal.probability}%
              </Badge>
            </div>
            
            <div className="w-full bg-surface-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  deal.probability >= 75 ? 'bg-success' :
                  deal.probability >= 50 ? 'bg-warning' : 'bg-error'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${deal.probability}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-surface-500">
            <span>Close Date</span>
            <span>{format(new Date(deal.closeDate), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DealCard;