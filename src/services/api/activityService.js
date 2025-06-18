import activitiesData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let activities = [...activitiesData];

const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id, 10));
    if (!activity) {
      throw new Error('Activity not found');
    }
    return { ...activity };
  },

  async getByContactId(contactId) {
    await delay(250);
    return activities.filter(a => a.contactId === parseInt(contactId, 10));
  },

  async getByDealId(dealId) {
    await delay(250);
    return activities.filter(a => a.dealId === parseInt(dealId, 10));
  },

  async create(activityData) {
    await delay(400);
    const maxId = Math.max(...activities.map(a => a.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      date: activityData.date || new Date().toISOString(),
      completed: activityData.completed || false
    };
    activities = [...activities, newActivity];
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    const updatedActivity = {
      ...activities[index],
      ...activityData,
      Id: activities[index].Id // Preserve original Id
    };
    
    activities = [
      ...activities.slice(0, index),
      updatedActivity,
      ...activities.slice(index + 1)
    ];
    
    return { ...updatedActivity };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Activity not found');
    }
    
    activities = [
      ...activities.slice(0, index),
      ...activities.slice(index + 1)
    ];
    
    return true;
  }
};

export default activityService;