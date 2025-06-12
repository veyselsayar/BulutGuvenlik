import React, { useState } from 'react';
import { useFindings } from '../../hooks/useFindings';
import FilterBar from './FilterBar';
import FindingsTable from './FindingsTable';
import StatCards from './StatCards';
import AdvancedCharts from './AdvancedCharts';
import { AlertTriangle, RefreshCw, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { 
    findings, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    stats,
    refreshFindings
  } = useFindings();

  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);

  const toggleExpandFinding = (id: string) => {
    setExpandedFinding(expandedFinding === id ? null : id);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div 
          className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-error-50 to-error-100 dark:from-error-900/20 dark:to-error-800/20 text-error-600 dark:text-error-400 p-8 rounded-2xl mb-8 max-w-md border border-error-200 dark:border-error-800">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-error-500" />
            <h3 className="text-xl font-bold mb-4 text-error-700 dark:text-error-300">Veri Yüklenirken Hata Oluştu</h3>
            <p className="text-sm text-error-600 dark:text-error-400 leading-relaxed">{error}</p>
          </div>
          <motion.button 
            className="btn bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3"
            onClick={refreshFindings}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-5 h-5" />
            <span className="font-medium">Yeniden Dene</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Enhanced Header */}
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Bulut Güvenlik Kontrol Paneli
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
              Bulut ortamınızdaki güvenlik durumunu izleyin ve zafiyet tespitlerini yönetin
            </p>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2 px-4 py-2 bg-success-50 dark:bg-success-900/20 rounded-full border border-success-200 dark:border-success-800">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-success-700 dark:text-success-400">
              Sistem Aktif
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Son güncelleme: {new Date().toLocaleString('tr-TR')}
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StatCards stats={stats} isLoading={loading} />
      </motion.div>
      
      {/* Advanced Charts */}
      <motion.div 
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AdvancedCharts findings={findings} stats={stats} isLoading={loading} />
      </motion.div>
      
      {/* Filter and Search */}
      <motion.div 
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <FilterBar 
          filters={filters} 
          updateFilters={updateFilters} 
          findings={findings} 
          isLoading={loading}
        />
        
        {/* Findings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FindingsTable 
            findings={findings} 
            isLoading={loading} 
            expandedFinding={expandedFinding}
            toggleExpandFinding={toggleExpandFinding}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;