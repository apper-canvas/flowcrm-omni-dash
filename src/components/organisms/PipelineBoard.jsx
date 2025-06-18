import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DealCard from '@/components/molecules/DealCard';
import { dealService } from '@/services';

const PipelineBoard = ({ deals, onUpdateDeal }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = ['Lead', 'Qualified', 'Demo', 'Negotiation', 'Closed'];
  
  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage] = deals.filter(deal => deal.stage === stage);
    return acc;
  }, {});

  const getStageValue = (stage) => {
    return dealsByStage[stage]?.reduce((sum, deal) => sum + deal.value, 0) || 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null);
      return;
    }

    try {
      const updatedDeal = await dealService.updateStage(draggedDeal.Id, newStage);
      onUpdateDeal(updatedDeal);
      toast.success(`Deal moved to ${newStage}`);
    } catch (error) {
      toast.error('Failed to update deal stage');
    } finally {
      setDraggedDeal(null);
    }
  };

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
    <div className="h-full overflow-x-auto">
      <div className="flex space-x-6 h-full min-w-max pb-6">
        {stages.map(stage => (
          <div key={stage} className="flex-shrink-0 w-80">
            <div className="bg-surface-50 rounded-lg h-full flex flex-col">
              <div className="p-4 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-surface-900">{stage}</h3>
                  <span className="text-sm text-surface-500">
                    {dealsByStage[stage]?.length || 0}
                  </span>
                </div>
                <p className="text-sm font-medium text-surface-600 mt-1">
                  {formatCurrency(getStageValue(stage))}
                </p>
              </div>
              
              <motion.div
                className="flex-1 p-4 space-y-3 overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence>
                  {dealsByStage[stage]?.map(deal => (
                    <motion.div
                      key={deal.Id}
                      variants={staggerItem}
                      layout
                      draggable
                      onDragStart={() => handleDragStart(deal)}
                      className="cursor-move"
                    >
                      <DealCard 
                        deal={deal} 
                        onStageChange={(newStage) => handleDrop({ preventDefault: () => {} }, newStage)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {(!dealsByStage[stage] || dealsByStage[stage].length === 0) && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-surface-300 rounded-lg">
                    <p className="text-sm text-surface-500">Drop deals here</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineBoard;