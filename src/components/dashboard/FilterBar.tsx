import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Finding } from '../../types/findings';
import { motion, AnimatePresence } from 'framer-motion';
import RiskBadge from './RiskBadge';
import SmartSearchBar from './SmartSearchBar';

interface FilterBarProps {
  filters: {
    severity: string;
    search: string;
  };
  updateFilters: (filters: Partial<{ severity: string; search: string }>) => void;
  findings: Finding[];
  isLoading: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  updateFilters, 
  findings, 
  isLoading 
}) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Get unique severities from findings
  const severities = ['Tümü', ...Array.from(new Set(findings.map(f => f.severity)))];

  // Handle risk filter change
  const handleRiskChange = (severity: string) => {
    updateFilters({ severity });
  };

  // Clear all filters
  const clearFilters = () => {
    updateFilters({ severity: 'Tümü', search: '' });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse card p-6 mb-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Smart Search bar */}
        <div className="flex-1 max-w-2xl">
          <SmartSearchBar
            findings={findings}
            onSearch={(query) => updateFilters({ search: query })}
            currentQuery={filters.search}
          />
        </div>
        
        {/* Filter controls */}
        <div className="flex items-center space-x-4">
          {(filters.severity !== 'Tümü' || filters.search) && (
            <button
              onClick={clearFilters}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Filtreleri Temizle
            </button>
          )}
          
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`btn btn-outline flex items-center space-x-2 ${
              isFilterExpanded ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Gelişmiş Filtre</span>
          </button>
        </div>
      </div>
      
      {/* Expandable filter section */}
      <AnimatePresence>
        {isFilterExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">Risk Seviyesi</h3>
                <div className="flex flex-wrap gap-3">
                  {severities.map((severity) => (
                    <button
                      key={severity}
                      onClick={() => handleRiskChange(severity)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.severity === severity
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 ring-2 ring-primary-500 shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 hover:shadow-sm'
                      }`}
                    >
                      {severity === 'Tümü' ? (
                        'Tüm Riskler'
                      ) : (
                        <RiskBadge severity={severity} size="sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;