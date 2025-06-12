import React from 'react';
import { AlertTriangle, AlertCircle, AlertOctagon, Info } from 'lucide-react';

interface RiskBadgeProps {
  severity: string;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, size = 'md' }) => {
  // Set up configuration based on severity
  const config = {
    CRITICAL: {
      bg: 'bg-error-500/10',
      text: 'text-error-500',
      border: 'border-error-500/30',
      icon: <AlertOctagon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      label: 'Kritik'
    },
    HIGH: {
      bg: 'bg-warning-500/10',
      text: 'text-warning-500',
      border: 'border-warning-500/30',
      icon: <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      label: 'Yüksek'
    },
    MEDIUM: {
      bg: 'bg-secondary-500/10',
      text: 'text-secondary-500',
      border: 'border-secondary-500/30',
      icon: <AlertCircle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      label: 'Orta'
    },
    LOW: {
      bg: 'bg-success-500/10',
      text: 'text-success-500',
      border: 'border-success-500/30',
      icon: <Info className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
      label: 'Düşük'
    }
  };

  // Handle unknown severity levels gracefully
  const riskConfig = config[severity as keyof typeof config] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    icon: <Info className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
    label: severity
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 space-x-1',
    md: 'text-sm px-2 py-1 space-x-1.5',
    lg: 'text-base px-3 py-1.5 space-x-2'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border ${riskConfig.bg} ${riskConfig.text} ${riskConfig.border} ${sizeClasses[size]}`}
    >
      <span>{riskConfig.icon}</span>
      <span className="font-medium">{riskConfig.label}</span>
    </span>
  );
};

export default RiskBadge;