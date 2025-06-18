import companiesData from '../mockData/companies.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let companies = [...companiesData];

const companyService = {
  async getAll() {
    await delay(300);
    return [...companies];
  },

  async getById(id) {
    await delay(200);
    const company = companies.find(c => c.Id === parseInt(id, 10));
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(400);
    const maxId = Math.max(...companies.map(c => c.Id), 0);
    const newCompany = {
      Id: maxId + 1,
      ...companyData,
      createdAt: new Date().toISOString(),
      healthScore: companyData.healthScore || 75,
      mrr: companyData.mrr || 0
    };
    companies = [...companies, newCompany];
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(350);
    const index = companies.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    const updatedCompany = {
      ...companies[index],
      ...companyData,
      Id: companies[index].Id // Preserve original Id
    };
    
    companies = [
      ...companies.slice(0, index),
      updatedCompany,
      ...companies.slice(index + 1)
    ];
    
    return { ...updatedCompany };
  },

  async delete(id) {
    await delay(250);
    const index = companies.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    companies = [
      ...companies.slice(0, index),
      ...companies.slice(index + 1)
    ];
    
    return true;
  }
};

export default companyService;