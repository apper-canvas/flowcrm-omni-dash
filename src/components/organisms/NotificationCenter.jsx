import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { notificationService } from '@/services';

const NotificationCenter = ({ isOpen, onClose, onNotificationUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, deals, activities, health
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.Id === notificationId ? { ...n, read: true } : n)
      );
      onNotificationUpdate?.();
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAsUnread = async (notificationId) => {
    try {
      await notificationService.markAsUnread(notificationId);
      setNotifications(prev => 
        prev.map(n => n.Id === notificationId ? { ...n, read: false } : n)
      );
      onNotificationUpdate?.();
      toast.success('Notification marked as unread');
    } catch (err) {
      toast.error('Failed to mark notification as unread');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      onNotificationUpdate?.();
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      setNotifications(prev => prev.filter(n => n.Id !== notificationId));
      onNotificationUpdate?.();
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.read);
        break;
      case 'deals':
        filtered = notifications.filter(n => n.type === 'deal');
        break;
      case 'activities':
        filtered = notifications.filter(n => n.type === 'activity');
        break;
      case 'health':
        filtered = notifications.filter(n => n.type === 'account_health');
        break;
      default:
        filtered = notifications;
    }
    
    return filtered;
  };

  const getNotificationIcon = (type, category) => {
    const iconMap = {
      deal: 'Target',
      activity: 'Calendar',
      account_health: 'Activity',
      deal_created: 'Plus',
      deal_update: 'TrendingUp',
      deal_closed: 'CheckCircle',
      activity_reminder: 'Clock',
      activity_completed: 'Check',
      task_overdue: 'AlertTriangle',
      health_alert: 'AlertCircle',
      health_improvement: 'TrendingUp'
    };
    
    return iconMap[category] || iconMap[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success'
    };
    return colors[priority] || 'default';
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2 }}
        ref={containerRef}
        className="absolute top-full right-0 mt-2 w-96 max-w-sm bg-white rounded-lg shadow-xl border border-surface-200 z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-200">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-surface-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="primary" size="small">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="small"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="X" className="w-4 h-4 text-surface-400" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 p-4 pb-2">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'deals', label: 'Deals', count: notifications.filter(n => n.type === 'deal').length },
            { id: 'activities', label: 'Activities', count: notifications.filter(n => n.type === 'activity').length },
            { id: 'health', label: 'Health', count: notifications.filter(n => n.type === 'account_health').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === tab.id
                  ? 'bg-primary text-white'
                  : 'text-surface-600 hover:bg-surface-100'
              }`}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-surface-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                      <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <ApperIcon name="AlertCircle" className="w-8 h-8 text-error mx-auto mb-2" />
              <p className="text-sm text-surface-600">Failed to load notifications</p>
              <Button
                variant="ghost"
                size="small"
                onClick={loadNotifications}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-4 text-center">
              <ApperIcon name="Bell" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
              <p className="text-sm text-surface-600">
                {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map(notification => (
                <motion.div
                  key={notification.Id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-4 border-b border-surface-100 hover:bg-surface-50 transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      notification.priority === 'high' ? 'bg-error/10' :
                      notification.priority === 'medium' ? 'bg-warning/10' :
                      'bg-success/10'
                    }`}>
                      <ApperIcon 
                        name={getNotificationIcon(notification.type, notification.category)} 
                        className={`w-4 h-4 ${
                          notification.priority === 'high' ? 'text-error' :
                          notification.priority === 'medium' ? 'text-warning' :
                          'text-success'
                        }`} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-surface-900' : 'text-surface-700'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-surface-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-surface-400 mt-2">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          <Badge
                            variant={getPriorityColor(notification.priority)}
                            size="small"
                          >
                            {notification.priority}
                          </Badge>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => notification.read ? handleMarkAsUnread(notification.Id) : handleMarkAsRead(notification.Id)}
                              className="p-1 rounded hover:bg-surface-200 transition-colors"
                              title={notification.read ? 'Mark as unread' : 'Mark as read'}
                            >
                              <ApperIcon 
                                name={notification.read ? 'Mail' : 'MailOpen'} 
                                className="w-3 h-3 text-surface-400" 
                              />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteNotification(notification.Id)}
                              className="p-1 rounded hover:bg-surface-200 transition-colors"
                              title="Delete notification"
                            >
                              <ApperIcon name="Trash2" className="w-3 h-3 text-surface-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full absolute left-2 top-4"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-4 border-t border-surface-200">
            <Button
              variant="ghost"
              size="small"
              className="w-full justify-center text-sm"
              icon="Settings"
            >
              Notification Preferences
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;