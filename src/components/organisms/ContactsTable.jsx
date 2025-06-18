import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { contactService } from '@/services';

const ContactsTable = ({ contacts, onUpdate, onDelete }) => {
  const [sortField, setSortField] = useState('firstName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.Id));
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    
    try {
      await Promise.all(selectedContacts.map(id => contactService.delete(id)));
      onDelete?.(selectedContacts);
      setSelectedContacts([]);
      toast.success(`Deleted ${selectedContacts.length} contacts`);
    } catch (error) {
      toast.error('Failed to delete contacts');
    }
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-surface-700 hover:text-surface-900"
    >
      <span>{children}</span>
      <ApperIcon 
        name={sortField === field ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
        className="w-4 h-4" 
      />
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      {selectedContacts.length > 0 && (
        <div className="px-6 py-3 bg-surface-50 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-surface-600">
              {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
            </span>
            <Button
              variant="danger"
              size="small"
              icon="Trash2"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50 border-b border-surface-200">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-surface-300 text-primary focus:ring-primary"
                />
              </th>
              <th className="text-left px-6 py-3">
                <SortButton field="firstName">Name</SortButton>
              </th>
              <th className="text-left px-6 py-3">
                <SortButton field="email">Email</SortButton>
              </th>
              <th className="text-left px-6 py-3">
                <SortButton field="title">Title</SortButton>
              </th>
              <th className="text-left px-6 py-3">
                <SortButton field="lastActivity">Last Activity</SortButton>
              </th>
              <th className="text-left px-6 py-3">Tags</th>
              <th className="w-20 px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {sortedContacts.map(contact => (
              <motion.tr
                key={contact.Id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-surface-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.Id)}
                    onChange={() => handleSelectContact(contact.Id)}
                    className="rounded border-surface-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-surface-900">
                        {contact.firstName} {contact.lastName}
                      </div>
                      <div className="text-sm text-surface-500">{contact.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-surface-900">{contact.email}</td>
                <td className="px-6 py-4 text-sm text-surface-900">{contact.title}</td>
                <td className="px-6 py-4 text-sm text-surface-500">
                  {format(new Date(contact.lastActivity), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags?.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="primary" size="small">
                        {tag}
                      </Badge>
                    ))}
                    {contact.tags?.length > 2 && (
                      <Badge variant="default" size="small">
                        +{contact.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 rounded hover:bg-surface-100 transition-colors">
                    <ApperIcon name="MoreHorizontal" className="w-4 h-4 text-surface-400" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsTable;