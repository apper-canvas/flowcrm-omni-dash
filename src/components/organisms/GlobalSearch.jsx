import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { contactService, companyService, dealService } from '@/services';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ contacts: [], companies: [], deals: [] });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ contacts: [], companies: [], deals: [] });
      setShowResults(false);
      return;
    }

    const searchAll = async () => {
      setLoading(true);
      try {
        const [contacts, companies, deals] = await Promise.all([
          contactService.search(query),
          companyService.getAll(),
          dealService.getAll()
        ]);

        const filteredCompanies = companies.filter(company =>
          company.name.toLowerCase().includes(query.toLowerCase()) ||
          company.industry.toLowerCase().includes(query.toLowerCase())
        );

        const filteredDeals = deals.filter(deal =>
          deal.title.toLowerCase().includes(query.toLowerCase())
        );

        setResults({
          contacts: contacts.slice(0, 3),
          companies: filteredCompanies.slice(0, 3),
          deals: filteredDeals.slice(0, 3)
        });
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    searchAll();
  }, [query]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  const hasResults = results.contacts.length > 0 || results.companies.length > 0 || results.deals.length > 0;

  return (
    <div className="relative">
      <SearchBar
        placeholder="Search contacts, companies, deals..."
        onSearch={handleSearch}
        className="w-full max-w-md"
      />

      <AnimatePresence>
        {showResults && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-medium border border-surface-200 z-50 max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center">
                <ApperIcon name="Loader2" className="w-5 h-5 animate-spin mx-auto text-surface-400" />
                <p className="text-sm text-surface-500 mt-2">Searching...</p>
              </div>
            ) : hasResults ? (
              <div className="p-2">
                {results.contacts.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wide px-3 py-2">
                      Contacts
                    </h4>
                    {results.contacts.map(contact => (
                      <div key={contact.Id} className="px-3 py-2 hover:bg-surface-50 rounded-md cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 truncate">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-xs text-surface-500 truncate">
                              {contact.title} • {contact.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.companies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wide px-3 py-2">
                      Companies
                    </h4>
                    {results.companies.map(company => (
                      <div key={company.Id} className="px-3 py-2 hover:bg-surface-50 rounded-md cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="Building2" className="w-4 h-4 text-success" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 truncate">
                              {company.name}
                            </p>
                            <p className="text-xs text-surface-500 truncate">
                              {company.industry} • {company.size} employees
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.deals.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wide px-3 py-2">
                      Deals
                    </h4>
                    {results.deals.map(deal => (
                      <div key={deal.Id} className="px-3 py-2 hover:bg-surface-50 rounded-md cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                            <ApperIcon name="Target" className="w-4 h-4 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 truncate">
                              {deal.title}
                            </p>
                            <p className="text-xs text-surface-500 truncate">
                              ${deal.value.toLocaleString()} • {deal.stage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center">
                <ApperIcon name="Search" className="w-8 h-8 text-surface-300 mx-auto" />
                <p className="text-sm text-surface-500 mt-2">No results found for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;