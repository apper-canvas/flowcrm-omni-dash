import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/molecules/Card';
import HealthIndicator from '@/components/molecules/HealthIndicator';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { companyService, contactService } from '@/services';

const Accounts = () => {
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    industry: '',
    subscriptionTier: 'Basic',
    size: '',
    website: '',
    mrr: 0
  });
  const [createLoading, setCreateLoading] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [companiesData, contactsData] = await Promise.all([
          companyService.getAll(),
          contactService.getAll()
        ]);
        
        setCompanies(companiesData);
        setContacts(contactsData);
        setFilteredCompanies(companiesData);
      } catch (err) {
        setError(err.message || 'Failed to load accounts');
        toast.error('Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const filtered = companies.filter(company =>
      company.name.toLowerCase().includes(query.toLowerCase()) ||
      company.industry.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredCompanies(filtered);
  };

  const handleSort = (field) => {
    setSortBy(field);
    const sorted = [...filteredCompanies].sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      } else if (field === 'mrr') {
        return b.mrr - a.mrr;
      } else if (field === 'healthScore') {
        return b.healthScore - a.healthScore;
      }
      return 0;
    });
    setFilteredCompanies(sorted);
  };

  const handleFilter = (filter) => {
    setFilterBy(filter);
    let filtered = companies;
    
    if (filter === 'high-health') {
      filtered = companies.filter(c => c.healthScore >= 80);
    } else if (filter === 'at-risk') {
      filtered = companies.filter(c => c.healthScore < 60);
    } else if (filter === 'enterprise') {
      filtered = companies.filter(c => c.subscriptionTier === 'Enterprise');
    }
    
    setFilteredCompanies(filtered);
};

  const handleAddAccount = () => {
    setShowCreateModal(true);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const newCompany = await companyService.create(createFormData);
      setCompanies(prev => [...prev, newCompany]);
      setFilteredCompanies(prev => [...prev, newCompany]);
      setShowCreateModal(false);
      setCreateFormData({
        name: '',
        industry: '',
        subscriptionTier: 'Basic',
        size: '',
        website: '',
        mrr: 0
      });
      toast.success('Account created successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
    } finally {
      setCreateLoading(false);
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCompanyContacts = (companyId) => {
    return contacts.filter(contact => contact.companyId === companyId);
  };

  const getTierColor = (tier) => {
    const colors = {
      'Enterprise': 'primary',
      'Professional': 'secondary',
      'Basic': 'default'
    };
    return colors[tier] || 'default';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface-200 rounded-lg h-20"></div>
            ))}
          </div>
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-surface-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">Failed to load accounts</h3>
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

  const totalMRR = companies.reduce((sum, company) => sum + company.mrr, 0);
  const averageHealth = companies.length > 0 
    ? Math.round(companies.reduce((sum, company) => sum + company.healthScore, 0) / companies.length)
    : 0;
  const atRiskCount = companies.filter(c => c.healthScore < 60).length;

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
          Accounts
        </h1>
        <p className="text-surface-600 mt-1">
          Monitor customer health, subscriptions, and revenue metrics
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">
                {formatCurrency(totalMRR)}
              </p>
              <p className="text-sm text-surface-600">Total MRR</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Activity" className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">{averageHealth}</p>
              <p className="text-sm text-surface-600">Avg Health Score</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-surface-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error" />
            </div>
            <div>
              <p className="text-xl font-bold text-surface-900">{atRiskCount}</p>
              <p className="text-sm text-surface-600">At Risk Accounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <SearchBar
          placeholder="Search accounts..."
          onSearch={handleSearch}
          className="w-full lg:w-80"
        />
        
        <div className="flex items-center space-x-3">
          <select 
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="name">Sort by Name</option>
            <option value="mrr">Sort by MRR</option>
            <option value="healthScore">Sort by Health</option>
          </select>
          
          <select 
            value={filterBy}
            onChange={(e) => handleFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            <option value="all">All Accounts</option>
            <option value="high-health">High Health</option>
            <option value="at-risk">At Risk</option>
            <option value="enterprise">Enterprise</option>
          </select>
          
<Button variant="primary" icon="Plus" onClick={handleAddAccount}>
            Add Account
          </Button>
        </div>
      </div>

      {/* Accounts Grid */}
      {filteredCompanies.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">No accounts found</h3>
          <p className="text-surface-500 mt-2">
            No accounts match your search for "{searchQuery}"
          </p>
          <Button 
            onClick={() => handleSearch('')} 
            className="mt-4" 
            variant="secondary"
          >
            Clear Search
          </Button>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="Building2" className="w-12 h-12 text-surface-300 mx-auto" />
          <h3 className="text-lg font-medium text-surface-900 mt-4">No accounts yet</h3>
          <p className="text-surface-500 mt-2">
            Start managing your customer accounts by adding your first account
          </p>
<Button className="mt-4" icon="Plus" onClick={handleAddAccount}>
            Add Account
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {filteredCompanies.map(company => {
            const companyContacts = getCompanyContacts(company.Id);
            
            return (
              <motion.div key={company.Id} variants={staggerItem}>
                <Card className="p-6 h-full" hover>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-surface-900 truncate">
                          {company.name}
                        </h3>
                        <p className="text-sm text-surface-500 truncate">
                          {company.industry}
                        </p>
                      </div>
                      <Badge variant={getTierColor(company.subscriptionTier)} size="small">
                        {company.subscriptionTier}
                      </Badge>
                    </div>

                    {/* Health Score */}
                    <div className="flex items-center justify-center py-2">
                      <HealthIndicator 
                        score={company.healthScore} 
                        size="medium"
                        showLabel={true}
                      />
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-surface-200">
                      <div className="text-center">
                        <p className="text-lg font-bold text-surface-900">
                          {formatCurrency(company.mrr)}
                        </p>
                        <p className="text-xs text-surface-500">Monthly Revenue</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-surface-900">
                          {companyContacts.length}
                        </p>
                        <p className="text-xs text-surface-500">Contacts</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-surface-200">
                      <div className="text-xs text-surface-500">
                        {company.size} employees
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 rounded hover:bg-surface-100 transition-colors">
                          <ApperIcon name="Mail" className="w-4 h-4 text-surface-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-surface-100 transition-colors">
                          <ApperIcon name="ExternalLink" className="w-4 h-4 text-surface-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-surface-100 transition-colors">
                          <ApperIcon name="MoreHorizontal" className="w-4 h-4 text-surface-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
)}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-900">Add New Account</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded hover:bg-surface-100 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-400" />
                </button>
              </div>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Industry *
                  </label>
                  <input
                    type="text"
                    required
                    value={createFormData.industry}
                    onChange={(e) => setCreateFormData(prev => ({...prev, industry: e.target.value}))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="e.g., Technology, Healthcare"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={createFormData.subscriptionTier}
                    onChange={(e) => setCreateFormData(prev => ({...prev, subscriptionTier: e.target.value}))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Professional">Professional</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Company Size
                  </label>
                  <input
                    type="text"
                    value={createFormData.size}
                    onChange={(e) => setCreateFormData(prev => ({...prev, size: e.target.value}))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="e.g., 1-10, 50-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={createFormData.website}
                    onChange={(e) => setCreateFormData(prev => ({...prev, website: e.target.value}))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Monthly Recurring Revenue
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={createFormData.mrr}
                    onChange={(e) => setCreateFormData(prev => ({...prev, mrr: parseFloat(e.target.value) || 0}))}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    placeholder="0"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                    disabled={createLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={createLoading}
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Accounts;