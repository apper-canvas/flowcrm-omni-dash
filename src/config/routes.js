import Dashboard from '@/components/pages/Dashboard';
import Contacts from '@/components/pages/Contacts';
import Deals from '@/components/pages/Deals';
import Accounts from '@/components/pages/Accounts';
import Tasks from '@/components/pages/Tasks';
import NotificationPreferences from '@/components/pages/NotificationPreferences';
export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  contacts: {
    id: 'contacts', 
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  deals: {
    id: 'deals',
    label: 'Deals', 
    path: '/deals',
    icon: 'Target',
    component: Deals
  },
  accounts: {
    id: 'accounts',
    label: 'Accounts',
    path: '/accounts', 
    icon: 'Building2',
    component: Accounts
  },
tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  notificationPreferences: {
    id: 'notificationPreferences',
    label: 'Notification Preferences',
    path: '/notification-preferences',
    icon: 'Settings',
    component: NotificationPreferences,
    hidden: true // Don't show in main navigation
  }
};

export const routeArray = Object.values(routes);
export default routes;