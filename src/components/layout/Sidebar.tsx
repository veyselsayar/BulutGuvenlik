import React from 'react';
import { Shield, ShieldAlert, BarChart2, Settings, Users, CloudOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Vulnerabilities', icon: <ShieldAlert size={20} />, active: true, badge: '12' },
    { name: 'Dashboard', icon: <BarChart2 size={20} />, badge: null },
    { name: 'Resources', icon: <CloudOff size={20} />, badge: '3' },
    { name: 'Users', icon: <Users size={20} />, badge: null },
    { name: 'Settings', icon: <Settings size={20} />, badge: null },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -320,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const backdropVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    closed: {
      opacity: 0,
      x: -20
    }
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay for mobile */}
          <motion.div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.aside 
            className="fixed inset-y-0 left-0 z-50 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 shadow-2xl"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Shield className="h-8 w-8 text-primary-500" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                        CloudGuard
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Security Dashboard</p>
                    </div>
                  </div>
                  
                  {/* Close button for mobile */}
                  <button
                    onClick={onClose}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Navigation */}
              <motion.nav 
                className="flex-1 px-4 py-6 space-y-2 overflow-y-auto"
                variants={containerVariants}
                initial="closed"
                animate="open"
              >
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href="#"
                    className={`group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      item.active
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1'
                    }`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.active 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.a>
                ))}
              </motion.nav>
              
              {/* User Profile */}
              <motion.div 
                className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
                variants={itemVariants}
              >
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">AK</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      Admin Kullanıcı
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Güvenlik Yöneticisi
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;