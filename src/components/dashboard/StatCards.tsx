import React from 'react';
import { AlertTriangle, ShieldAlert, Shield, ChevronUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { FindingStats } from '../../types/findings';

interface StatCardsProps {
  stats: FindingStats;
  isLoading: boolean;
}

const StatCards: React.FC<StatCardsProps> = ({ stats, isLoading }) => {
  const statItems = [
    {
      title: 'Kritik Seviye',
      value: stats.critical,
      icon: <ShieldAlert className="h-7 w-7 text-error-500" />,
      bgClass: 'bg-gradient-to-br from-error-50 to-error-100 dark:from-error-900/20 dark:to-error-800/20',
      textClass: 'text-error-600 dark:text-error-400',
      borderClass: 'border-error-200 dark:border-error-800',
      change: '+2',
      trend: 'up'
    },
    {
      title: 'Yüksek Risk',
      value: stats.high,
      icon: <AlertTriangle className="h-7 w-7 text-warning-500" />,
      bgClass: 'bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20',
      textClass: 'text-warning-600 dark:text-warning-400',
      borderClass: 'border-warning-200 dark:border-warning-800',
      change: '+1',
      trend: 'up'
    },
    {
      title: 'Orta Risk',
      value: stats.medium,
      icon: <Shield className="h-7 w-7 text-secondary-500" />,
      bgClass: 'bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20',
      textClass: 'text-secondary-600 dark:text-secondary-400',
      borderClass: 'border-secondary-200 dark:border-secondary-800',
      change: '-1',
      trend: 'down'
    },
    {
      title: 'Düşük Risk',
      value: stats.low,
      icon: <Shield className="h-7 w-7 text-success-500" />,
      bgClass: 'bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20',
      textClass: 'text-success-600 dark:text-success-400',
      borderClass: 'border-success-200 dark:border-success-800',
      change: '0',
      trend: 'stable'
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse card p-6 h-40">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={index}
          className={`card p-6 hover:translate-y-[-4px] transition-all duration-300 border ${stat.bgClass} ${stat.borderClass} hover:shadow-xl`}
          variants={item}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm">
              {stat.icon}
            </div>
            {stat.value > 0 && (
              <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                stat.trend === 'up' ? 'bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400' :
                stat.trend === 'down' ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400' :
                'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {stat.trend === 'up' && <ChevronUp className="h-3 w-3 mr-1" />}
                {stat.trend === 'down' && <ChevronUp className="h-3 w-3 mr-1 rotate-180" />}
                {stat.trend === 'stable' && <Activity className="h-3 w-3 mr-1" />}
                <span>{stat.change}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className={`text-3xl font-bold ${stat.textClass}`}>{stat.value}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
              Son 24 saat
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatCards;