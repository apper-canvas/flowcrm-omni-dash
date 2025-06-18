import notificationsData from '../mockData/notifications.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let notifications = [...notificationsData];
let nextId = Math.max(...notifications.map(n => n.Id), 0) + 1;

const notificationService = {
  async getAll() {
    await delay(300);
    return [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const notification = notifications.find(n => n.Id === parseInt(id, 10));
    if (!notification) {
      throw new Error('Notification not found');
    }
    return { ...notification };
  },

  async getUnread() {
    await delay(200);
    return notifications.filter(n => !n.read).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getByType(type) {
    await delay(250);
    return notifications.filter(n => n.type === type).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(notificationData) {
    await delay(400);
    const newNotification = {
      Id: nextId++,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString(),
      priority: notificationData.priority || 'medium'
    };
    notifications = [newNotification, ...notifications];
    return { ...newNotification };
  },

  async update(id, notificationData) {
    await delay(350);
    const index = notifications.findIndex(n => n.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Notification not found');
    }
    
    const updatedNotification = {
      ...notifications[index],
      ...notificationData,
      Id: notifications[index].Id // Preserve original Id
    };
    
    notifications = [
      ...notifications.slice(0, index),
      updatedNotification,
      ...notifications.slice(index + 1)
    ];
    
    return { ...updatedNotification };
  },

  async markAsRead(id) {
    await delay(200);
    return this.update(id, { read: true });
  },

  async markAsUnread(id) {
    await delay(200);
    return this.update(id, { read: false });
  },

  async markAllAsRead() {
    await delay(500);
    notifications = notifications.map(n => ({ ...n, read: true }));
    return [...notifications];
  },

  async delete(id) {
    await delay(250);
    const index = notifications.findIndex(n => n.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Notification not found');
    }
    
    notifications = [
      ...notifications.slice(0, index),
      ...notifications.slice(index + 1)
    ];
    
    return true;
  },

  async deleteAll() {
    await delay(300);
    notifications = [];
    return true;
  },

  async getUnreadCount() {
    await delay(100);
    return notifications.filter(n => !n.read).length;
  }
};

export default notificationService;