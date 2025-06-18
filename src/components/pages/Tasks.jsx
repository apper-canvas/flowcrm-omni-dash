import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskList from '@/components/organisms/TaskList';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await taskService.getAll();
        setTasks(data);
      } catch (err) {
        setError(err.message || 'Failed to load tasks');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  // Calculate task metrics
  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString() && !task.completed;
  });

  const overdueTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate < today && !task.completed && taskDate.toDateString() !== today.toDateString();
  });

  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const filters = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'today', label: 'Due Today', count: todayTasks.length },
    { id: 'overdue', label: 'Overdue', count: overdueTasks.length },
    { id: 'completed', label: 'Completed', count: completedTasks.length }
  ];

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
        
        {/* Tasks skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-surface-200 rounded-lg h-24"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mt-4">Failed to load tasks</h3>
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
            Tasks
          </h1>
          <p className="text-surface-600 mt-1">
            Stay organized and track your daily priorities
          </p>
        </div>
        
        <Button variant="primary" icon="Plus">
          Add Task
        </Button>
      </div>

      {/* Task Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">{totalTasks}</p>
              <p className="text-sm text-surface-600">Total Tasks</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">{todayTasks.length}</p>
              <p className="text-sm text-surface-600">Due Today</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertCircle" className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">{overdueTasks.length}</p>
              <p className="text-sm text-surface-600">Overdue</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Award" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">{completionRate.toFixed(0)}%</p>
              <p className="text-sm text-surface-600">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 bg-surface-100 p-1 rounded-lg w-fit">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-white text-surface-900 shadow-sm'
                : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <span>{filter.label}</span>
            {filter.count > 0 && (
              <Badge 
                variant={
                  filter.id === 'overdue' ? 'error' :
                  filter.id === 'today' ? 'warning' :
                  filter.id === 'completed' ? 'success' : 'default'
                } 
                size="small"
              >
                {filter.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="CheckSquare" className="w-12 h-12 text-surface-300 mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">No tasks yet</h3>
          <p className="text-surface-500 mt-2">
            Stay organized by creating your first task
          </p>
          <Button className="mt-4" icon="Plus">
            Create Task
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-surface-200 p-6">
          <TaskList
            tasks={tasks}
            filter={activeFilter}
            onUpdateTask={handleTaskUpdate}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Tasks;