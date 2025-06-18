import contactsData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let contacts = [...contactsData];

const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id, 10));
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(400);
    const maxId = Math.max(...contacts.map(c => c.Id), 0);
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      lastActivity: new Date().toISOString(),
      tags: contactData.tags || []
    };
    contacts = [...contacts, newContact];
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: contacts[index].Id // Preserve original Id
    };
    
    contacts = [
      ...contacts.slice(0, index),
      updatedContact,
      ...contacts.slice(index + 1)
    ];
    
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    contacts = [
      ...contacts.slice(0, index),
      ...contacts.slice(index + 1)
    ];
    
    return true;
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(searchTerm) ||
      contact.lastName.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.title.toLowerCase().includes(searchTerm)
    );
  }
};

export default contactService;