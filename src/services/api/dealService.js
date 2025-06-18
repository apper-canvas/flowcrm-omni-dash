import dealsData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let deals = [...dealsData];

const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id, 10));
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const maxId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      stage: dealData.stage || 'Lead',
      probability: dealData.probability || 25,
      ownerId: dealData.ownerId || 'user1'
    };
    deals = [...deals, newDeal];
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      Id: deals[index].Id // Preserve original Id
    };
    
    deals = [
      ...deals.slice(0, index),
      updatedDeal,
      ...deals.slice(index + 1)
    ];
    
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    deals = [
      ...deals.slice(0, index),
      ...deals.slice(index + 1)
    ];
    
    return true;
  },

  async updateStage(id, newStage) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    // Update probability based on stage
    const stageProbabilities = {
      'Lead': 25,
      'Qualified': 40,
      'Demo': 60,
      'Negotiation': 75,
      'Closed': 100
    };
    
    const updatedDeal = {
      ...deals[index],
      stage: newStage,
      probability: stageProbabilities[newStage] || deals[index].probability
    };
    
    deals = [
      ...deals.slice(0, index),
      updatedDeal,
      ...deals.slice(index + 1)
    ];
    
    return { ...updatedDeal };
  }
};

export default dealService;