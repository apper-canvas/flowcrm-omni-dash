import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ContactsTable from '@/components/organisms/ContactsTable';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { contactService } from '@/services';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await contactService.getAll();
        setContacts(data);
        setFilteredContacts(data);
      } catch (err) {
        setError(err.message || 'Failed to load contacts');
        toast.error('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    try {
      const results = await contactService.search(query);
      setFilteredContacts(results);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleContactUpdate = (updatedContact) => {
    setContacts(prev => prev.map(contact => 
      contact.Id === updatedContact.Id ? updatedContact : contact
    ));
    setFilteredContacts(prev => prev.map(contact => 
      contact.Id === updatedContact.Id ? updatedContact : contact
    ));
  };

  const handleContactsDelete = (deletedIds) => {
    setContacts(prev => prev.filter(contact => !deletedIds.includes(contact.Id)));
    setFilteredContacts(prev => prev.filter(contact => !deletedIds.includes(contact.Id)));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-10 bg-surface-200 rounded w-80"></div>
            <div className="h-10 bg-surface-200 rounded w-32"></div>
          </div>
        </div>
        
        {/* Table skeleton */}
        <div className="animate-pulse">
          <div className="bg-surface-200 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">Failed to load contacts</h3>
          <p className="text-surface-500 mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            icon="RefreshCw"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-surface-900">
          Contacts
        </h1>
        <p className="text-surface-600 mt-1">
          Manage your customer relationships and contact information
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <SearchBar
          placeholder="Search contacts..."
          onSearch={handleSearch}
          className="w-full sm:w-80"
        />
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="Filter">
            Filter
          </Button>
          <Button variant="secondary" icon="Download">
            Export
          </Button>
          <Button variant="primary" icon="Plus">
            Add Contact
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{contacts.length}</p>
              <p className="text-sm text-surface-600">Total Contacts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">
                {contacts.filter(c => c.tags?.includes('hot-lead')).length}
              </p>
              <p className="text-sm text-surface-600">Hot Leads</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Activity" className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">
                {contacts.filter(c => {
                  const lastActivity = new Date(c.lastActivity);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return lastActivity >= weekAgo;
                }).length}
              </p>
              <p className="text-sm text-surface-600">Active This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">No contacts found</h3>
          <p className="text-surface-500 mt-2">
            No contacts match your search for "{searchQuery}"
          </p>
          <Button 
            onClick={() => handleSearch('')} 
            className="mt-4" 
            variant="secondary"
          >
            Clear Search
          </Button>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Users" className="w-12 h-12 text-surface-300 mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">No contacts yet</h3>
          <p className="text-surface-500 mt-2">
            Get started by adding your first contact
          </p>
          <Button className="mt-4" icon="Plus">
            Add Contact
          </Button>
        </div>
      ) : (
        <ContactsTable
          contacts={filteredContacts}
          onUpdate={handleContactUpdate}
          onDelete={handleContactsDelete}
        />
      )}
    </motion.div>
  );
};

export default Contacts;