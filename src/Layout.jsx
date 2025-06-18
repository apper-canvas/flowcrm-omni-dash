import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import GlobalSearch from '@/components/organisms/GlobalSearch';
import NotificationCenter from '@/components/organisms/NotificationCenter';
import { notificationService } from '@/services';

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    loadUnreadCount();
    
    // Check for new notifications every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('Failed to load unread count:', err);
    }
  };

  const handleNotificationUpdate = () => {
    loadUnreadCount();
  };
  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-gradient-to-b lg:from-primary lg:to-purple-800 lg:shadow-xl">
        <div className="flex items-center h-16 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold text-white">FlowCRM</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {routeArray.map((route) => (
              <li key={route.id}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-primary shadow-soft'
                        : 'text-purple-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-primary to-purple-800 shadow-xl z-50 lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-display font-bold text-white">FlowCRM</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-purple-200"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-2">
                {routeArray.map((route) => (
                  <li key={route.id}>
                    <NavLink
                      to={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-white text-primary shadow-soft'
                            : 'text-purple-100 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                      {route.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 lg:px-6 z-30">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 lg:hidden"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </button>
            
            <div className="hidden sm:block">
              <GlobalSearch />
            </div>
          </div>

<div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setNotificationCenterOpen(!notificationCenterOpen)}
                className="p-2 rounded-lg text-surface-600 hover:bg-surface-100 relative transition-colors"
              >
                <ApperIcon name="Bell" className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-accent text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              
              <NotificationCenter
                isOpen={notificationCenterOpen}
                onClose={() => setNotificationCenterOpen(false)}
                onNotificationUpdate={handleNotificationUpdate}
              />
            </div>
            
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
          </div>
        </header>

        {/* Mobile Search */}
        <div className="sm:hidden px-4 py-3 border-b border-surface-200">
          <GlobalSearch />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-30">
        <nav className="flex">
          {routeArray.slice(0, 5).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs ${
                  isActive
                    ? 'text-primary'
                    : 'text-surface-500'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
              <span className="truncate">{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;