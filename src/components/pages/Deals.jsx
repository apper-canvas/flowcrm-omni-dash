import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PipelineBoard from '@/components/organisms/PipelineBoard';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { dealService } from '@/services';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline'); // pipeline or list

  useEffect(() => {
    const loadDeals = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await dealService.getAll();
        setDeals(data);
      } catch (err) {
        setError(err.message || 'Failed to load deals');
        toast.error('Failed to load deals');
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  const handleDealUpdate = (updatedDeal) => {
    setDeals(prev => prev.map(deal => 
      deal.Id === updatedDeal.Id ? updatedDeal : deal
    ));
  };

  // Calculate pipeline metrics
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const closedDeals = deals.filter(deal => deal.stage === 'Closed');
  const totalRevenue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
  const averageDealSize = deals.length > 0 ? totalPipelineValue / deals.length : 0;
  const winRate = deals.length > 0 ? (closedDeals.length / deals.length) * 100 : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-200 rounded-lg h-20"></div>
            ))}
          </div>
        </div>
        
        {/* Pipeline skeleton */}
        <div className="animate-pulse">
          <div className="bg-surface-200 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">Failed to load deals</h3>
          <p className="text-surface-500 mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            icon="RefreshCw"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900">
            Sales Pipeline
          </h1>
          <p className="text-surface-600 mt-1">
            Track and manage your sales opportunities
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'pipeline' 
                  ? 'bg-white text-surface-900 shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="Kanban" className="w-4 h-4 mr-2 inline" />
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-surface-900 shadow-sm' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4 mr-2 inline" />
              List
            </button>
          </div>
          
          <Button variant="primary" icon="Plus">
            Add Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">
                {formatCurrency(totalPipelineValue)}
              </p>
              <p className="text-sm text-surface-600">Pipeline Value</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-sm text-surface-600">Closed Revenue</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">
                {formatCurrency(averageDealSize)}
              </p>
              <p className="text-sm text-surface-600">Avg Deal Size</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Award" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">
                {winRate.toFixed(1)}%
              </p>
              <p className="text-sm text-surface-600">Win Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Content */}
      {deals.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Target" className="w-12 h-12 text-surface-300 mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">No deals yet</h3>
          <p className="text-surface-500 mt-2">
            Start tracking your sales opportunities by creating your first deal
          </p>
          <Button className="mt-4" icon="Plus">
            Create Deal
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
          {viewMode === 'pipeline' ? (
            <div className="h-[600px] p-6">
              <PipelineBoard 
                deals={deals} 
                onUpdateDeal={handleDealUpdate}
              />
            </div>
          ) : (
            <div className="p-6">
              <div className="text-center py-12">
                <ApperIcon name="List" className="w-12 h-12 text-surface-300 mx-auto" />
                <h3 className="text-lg font-medium text-surface-900 mt-4">List view</h3>
                <p className="text-surface-500 mt-2">
                  List view is coming soon. Use pipeline view for now.
                </p>
                <Button 
                  onClick={() => setViewMode('pipeline')} 
                  className="mt-4"
                  variant="secondary"
                >
                  Switch to Pipeline
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Deals;