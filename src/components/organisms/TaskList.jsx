import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services';

const TaskList = ({ tasks, onUpdateTask, filter = 'all' }) => {
  const [completingTasks, setCompletingTasks] = useState(new Set());

  const handleToggleComplete = async (task) => {
    setCompletingTasks(prev => new Set([...prev, task.Id]));
    
    try {
      const updatedTask = await taskService.toggleComplete(task.Id);
      onUpdateTask(updatedTask);
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setCompletingTasks(prev => {
        const next = new Set(prev);
        next.delete(task.Id);
        return next;
      });
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'info'
    };
    return colors[priority] || 'default';
  };

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed';
    if (isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))) return 'overdue';
    if (isToday(new Date(task.dueDate))) return 'today';
    return 'upcoming';
  };

  const filteredTasks = tasks.filter(task => {
    const status = getTaskStatus(task);
    
    switch (filter) {
      case 'today':
        return status === 'today' && !task.completed;
      case 'overdue':
        return status === 'overdue';
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="space-y-3"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {sortedTasks.map(task => {
        const status = getTaskStatus(task);
        const isCompleting = completingTasks.has(task.Id);
        
        return (
          <motion.div
            key={task.Id}
            variants={staggerItem}
            className={`bg-white rounded-lg border p-4 transition-all duration-200 ${
              task.completed ? 'opacity-60 border-surface-200' : 
              status === 'overdue' ? 'border-error/30 bg-error/5' :
              status === 'today' ? 'border-warning/30 bg-warning/5' :
              'border-surface-200 hover:shadow-soft'
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => handleToggleComplete(task)}
                disabled={isCompleting}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed 
                    ? 'bg-success border-success text-white' 
                    : 'border-surface-300 hover:border-primary'
                } ${isCompleting ? 'animate-pulse' : ''}`}
              >
                {isCompleting ? (
                  <ApperIcon name="Loader2" className="w-3 h-3 animate-spin" />
                ) : task.completed && (
                  <ApperIcon name="Check" className="w-3 h-3" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-surface-500' : 'text-surface-900'}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-2 ml-3">
                    <Badge variant={getPriorityColor(task.priority)} size="small">
                      {task.priority}
                    </Badge>
                    {status === 'overdue' && (
                      <Badge variant="error" size="small">
                        Overdue
                      </Badge>
                    )}
                    {status === 'today' && (
                      <Badge variant="warning" size="small">
                        Due Today
                      </Badge>
                    )}
                  </div>
                </div>
                
                {task.description && (
                  <p className={`text-sm mt-1 ${task.completed ? 'text-surface-400' : 'text-surface-600'}`}>
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-xs text-surface-500">
                    <span className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" className="w-3 h-3" />
                      <span>Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                    </span>
                    
                    {task.relatedTo && (
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="Link" className="w-3 h-3" />
                        <span>{task.relatedTo}</span>
                      </span>
                    )}
                  </div>
                  
                  <button className="p-1 rounded hover:bg-surface-100 transition-colors">
                    <ApperIcon name="MoreHorizontal" className="w-4 h-4 text-surface-400" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
      
      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="CheckSquare" className="w-12 h-12 text-surface-300 mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">No tasks found</h3>
          <p className="text-surface-500 mt-2">
            {filter === 'completed' ? "You haven't completed any tasks yet" :
             filter === 'today' ? "No tasks due today" :
             filter === 'overdue' ? "Great! No overdue tasks" :
             "Create your first task to get started"}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default TaskList;