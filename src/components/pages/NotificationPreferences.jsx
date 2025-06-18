import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/molecules/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    email: {
      deals: true,
      activities: true,
      accountHealth: true,
      taskReminders: true
    },
    inApp: {
      deals: true,
      activities: true,
      accountHealth: true,
      taskReminders: true
    },
    frequency: {
      immediate: true,
      daily: false,
      weekly: false
    }
  });
  const [loading, setLoading] = useState(false);

  const handlePreferenceChange = (category, type, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences saved successfully');
    } catch (err) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const preferenceCategories = [
    {
      id: 'deals',
      label: 'Deal Updates',
      description: 'Notifications about deal stage changes, new deals, and closures',
      icon: 'Target'
    },
    {
      id: 'activities',
      label: 'Activities & Tasks',
      description: 'Reminders for scheduled activities and overdue tasks',
      icon: 'Calendar'
    },
    {
      id: 'accountHealth',
      label: 'Account Health',
      description: 'Alerts when account health scores change significantly',
      icon: 'Activity'
    },
    {
      id: 'taskReminders',
      label: 'Task Reminders',
      description: 'Notifications for upcoming and overdue tasks',
      icon: 'CheckSquare'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-surface-900">
          Notification Preferences
        </h1>
        <p className="text-surface-600 mt-1">
          Customize how and when you receive notifications
        </p>
      </div>

      {/* Email Notifications */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Mail" className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-surface-900">Email Notifications</h2>
            <p className="text-sm text-surface-600">Receive notifications via email</p>
          </div>
        </div>

        <div className="space-y-4">
          {preferenceCategories.map(category => (
            <div key={category.id} className="flex items-center justify-between py-3 border-b border-surface-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <ApperIcon name={category.icon} className="w-5 h-5 text-surface-500" />
                <div>
                  <p className="font-medium text-surface-900">{category.label}</p>
                  <p className="text-sm text-surface-500">{category.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.email[category.id]}
                  onChange={(e) => handlePreferenceChange('email', category.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* In-App Notifications */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Bell" className="w-5 h-5 text-success" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-surface-900">In-App Notifications</h2>
            <p className="text-sm text-surface-600">Show notifications in the application</p>
          </div>
        </div>

        <div className="space-y-4">
          {preferenceCategories.map(category => (
            <div key={category.id} className="flex items-center justify-between py-3 border-b border-surface-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <ApperIcon name={category.icon} className="w-5 h-5 text-surface-500" />
                <div>
                  <p className="font-medium text-surface-900">{category.label}</p>
                  <p className="text-sm text-surface-500">{category.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.inApp[category.id]}
                  onChange={(e) => handlePreferenceChange('inApp', category.id, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Frequency Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Clock" className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-surface-900">Notification Frequency</h2>
            <p className="text-sm text-surface-600">Choose how often you receive notifications</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { id: 'immediate', label: 'Immediate', description: 'Receive notifications as they happen' },
            { id: 'daily', label: 'Daily Digest', description: 'Receive a summary once per day' },
            { id: 'weekly', label: 'Weekly Summary', description: 'Receive a summary once per week' }
          ].map(option => (
            <label key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border border-surface-200 hover:bg-surface-50 cursor-pointer">
              <input
                type="radio"
                name="frequency"
                checked={preferences.frequency[option.id]}
                onChange={() => setPreferences(prev => ({
                  ...prev,
                  frequency: {
                    immediate: false,
                    daily: false,
                    weekly: false,
                    [option.id]: true
                  }
                }))}
                className="w-4 h-4 text-primary bg-surface-100 border-surface-300 focus:ring-primary focus:ring-2"
              />
              <div>
                <p className="font-medium text-surface-900">{option.label}</p>
                <p className="text-sm text-surface-500">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSavePreferences}
          loading={loading}
          icon="Save"
        >
          Save Preferences
        </Button>
      </div>
    </motion.div>
  );
};

export default NotificationPreferences;