import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import StatCard from '@/components/molecules/StatCard';
import Card from '@/components/molecules/Card';
import HealthIndicator from '@/components/molecules/HealthIndicator';
import ActivityTimeline from '@/components/organisms/ActivityTimeline';
import TaskList from '@/components/organisms/TaskList';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { dealService, activityService, taskService, companyService } from '@/services';

const Dashboard = () => {
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [dealsData, activitiesData, tasksData, companiesData] = await Promise.all([
          dealService.getAll(),
          activityService.getAll(),
          taskService.getAll(),
          companyService.getAll()
        ]);
        
        setDeals(dealsData);
        setActivities(activitiesData);
        setTasks(tasksData);
        setCompanies(companiesData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  // Calculate metrics
  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const closedDeals = deals.filter(deal => deal.stage === 'Closed');
  const totalRevenue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDealCount = deals.filter(deal => deal.stage !== 'Closed').length;
  const averageHealthScore = companies.length > 0 
    ? Math.round(companies.reduce((sum, company) => sum + company.healthScore, 0) / companies.length)
    : 0;
  
  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString() && !task.completed;
  });

  const recentActivities = activities.slice(0, 5);
  const upcomingTasks = tasks.filter(task => !task.completed).slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Skeleton for stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-surface-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
        
        {/* Skeleton for content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-surface-200 rounded-lg h-96"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">Failed to load dashboard</h3>
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
            Good morning! 👋
          </h1>
          <p className="text-surface-600 mt-1">
            Here's what's happening with your business today
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button icon="Plus" variant="primary">
            Quick Add
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pipeline Value"
          value={`$${(totalPipelineValue / 1000).toFixed(0)}K`}
          change="+12.5%"
          changeType="positive"
          icon="TrendingUp"
          gradient={true}
          className="gradient-primary"
        />
        
        <StatCard
          title="Closed Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          change="+8.2%"
          changeType="positive"
          icon="DollarSign"
        />
        
        <StatCard
          title="Active Deals"
          value={activeDealCount}
          change="+3"
          changeType="positive"
          icon="Target"
        />
        
        <StatCard
          title="Tasks Due Today"
          value={todayTasks.length}
          change={todayTasks.length > 0 ? `${todayTasks.length} pending` : "All caught up!"}
          changeType={todayTasks.length > 0 ? "warning" : "positive"}
          icon="CheckSquare"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-surface-900">Recent Activity</h2>
            <Button variant="ghost" size="small" icon="Plus">
              Log Activity
            </Button>
          </div>
          
          <ActivityTimeline activities={recentActivities} />
        </Card>

        {/* Account Health & Tasks */}
        <div className="space-y-6">
          {/* Account Health */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-surface-900">Account Health</h2>
              <Button variant="ghost" size="small" icon="BarChart3">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <HealthIndicator 
                  score={averageHealthScore} 
                  size="large" 
                  showLabel={true}
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-surface-600">
                  Average health score across {companies.length} accounts
                </p>
              </div>
              
              {/* Top accounts by health */}
              <div className="space-y-3 pt-4 border-t border-surface-200">
                {companies
                  .sort((a, b) => b.healthScore - a.healthScore)
                  .slice(0, 3)
                  .map(company => (
                    <div key={company.Id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                          <ApperIcon name="Building2" className="w-4 h-4 text-success" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-surface-900 truncate">
                            {company.name}
                          </p>
                          <p className="text-xs text-surface-500">
                            ${(company.mrr / 1000).toFixed(1)}K MRR
                          </p>
                        </div>
                      </div>
                      <HealthIndicator 
                        score={company.healthScore} 
                        size="small" 
                        showLabel={false}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-surface-900">Today's Tasks</h2>
              <Button variant="ghost" size="small" icon="Plus">
                Add Task
              </Button>
            </div>
            
            <TaskList 
              tasks={upcomingTasks} 
              filter="today"
              onUpdateTask={handleTaskUpdate}
            />
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;