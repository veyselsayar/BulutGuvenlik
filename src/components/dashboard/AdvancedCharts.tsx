import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity, Target } from 'lucide-react';
import { Finding, FindingStats } from '../../types/findings';

interface AdvancedChartsProps {
  findings: Finding[];
  stats: FindingStats;
  isLoading: boolean;
}

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ findings, stats, isLoading }) => {
  const [activeChart, setActiveChart] = useState<'severity' | 'timeline' | 'resources' | 'trends'>('severity');

  // Color schemes
  const severityColors = {
    CRITICAL: '#FF453A',
    HIGH: '#FF9500',
    MEDIUM: '#30B0C7',
    LOW: '#34C759'
  };

  const chartColors = ['#0A84FF', '#30B0C7', '#34C759', '#FF9500', '#FF453A', '#AF52DE'];

  // Prepare data for different charts
  const severityData = [
    { name: 'Kritik', value: stats.critical, color: severityColors.CRITICAL, percentage: (stats.critical / Math.max(stats.total, 1) * 100).toFixed(1) },
    { name: 'Yüksek', value: stats.high, color: severityColors.HIGH, percentage: (stats.high / Math.max(stats.total, 1) * 100).toFixed(1) },
    { name: 'Orta', value: stats.medium, color: severityColors.MEDIUM, percentage: (stats.medium / Math.max(stats.total, 1) * 100).toFixed(1) },
    { name: 'Düşük', value: stats.low, color: severityColors.LOW, percentage: (stats.low / Math.max(stats.total, 1) * 100).toFixed(1) }
  ].filter(item => item.value > 0);

  // Timeline data (group by date)
  const timelineData = findings.reduce((acc, finding) => {
    if (!finding.created_at) return acc;
    
    const date = new Date(finding.created_at).toLocaleDateString('tr-TR', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count += 1;
      existing[finding.severity] = (existing[finding.severity] || 0) + 1;
    } else {
      acc.push({
        date,
        count: 1,
        [finding.severity]: 1,
        CRITICAL: finding.severity === 'CRITICAL' ? 1 : 0,
        HIGH: finding.severity === 'HIGH' ? 1 : 0,
        MEDIUM: finding.severity === 'MEDIUM' ? 1 : 0,
        LOW: finding.severity === 'LOW' ? 1 : 0
      });
    }
    return acc;
  }, [] as any[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7); // Last 7 days

  // Resource distribution
  const resourceData = findings.reduce((acc, finding) => {
    // resource hem var mı hem de string mi?
    if (typeof finding.resource !== "string") return acc;
  
    const service = finding.resource.split(':')[1] || 'Unknown';
  
    const existing = acc.find(item => item.service === service);
  
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ service, count: 1 });
    }
    return acc;
  }, [] as any[])
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  


  // Radial chart data for severity distribution
  const radialData = severityData.map((item, index) => ({
    ...item,
    fill: item.color,
    uv: Math.max(item.value * 10, 10) // Scale for radial chart with minimum value
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: <span className="font-medium ml-1">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartTabs = [
    { id: 'severity', label: 'Risk Dağılımı', icon: <PieChartIcon className="w-4 h-4" /> },
    { id: 'timeline', label: 'Zaman Çizelgesi', icon: <Activity className="w-4 h-4" /> },
    { id: 'resources', label: 'Kaynak Analizi', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'trends', label: 'Trend Analizi', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="flex space-x-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
            ))}
          </div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
          Güvenlik Analizi
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeChart === tab.id
                  ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-h-[400px]"
        >
          {activeChart === 'severity' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Risk Seviyesi Dağılımı</h4>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry: any) => (
                          <span style={{ color: entry.color }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Radial Görünüm</h4>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData}>
                    <RadialBar dataKey="uv" cornerRadius={8}>
  {radialData.map((entry, idx) => (
    <Cell key={`cell-${idx}`} fill={entry.fill} />
  ))}
</RadialBar>

                      <Tooltip content={<CustomTooltip />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeChart === 'timeline' && (
            <div className="h-full">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Zaman İçinde Zafiyet Tespitleri</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="CRITICAL"
                      stackId="1"
                      stroke={severityColors.CRITICAL}
                      fill={severityColors.CRITICAL}
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="HIGH"
                      stackId="1"
                      stroke={severityColors.HIGH}
                      fill={severityColors.HIGH}
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="MEDIUM"
                      stackId="1"
                      stroke={severityColors.MEDIUM}
                      fill={severityColors.MEDIUM}
                      fillOpacity={0.8}
                    />
                    <Area
                      type="monotone"
                      dataKey="LOW"
                      stackId="1"
                      stroke={severityColors.LOW}
                      fill={severityColors.LOW}
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'resources' && (
            <div className="h-full">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">AWS Servis Dağılımı</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      type="number" 
                      stroke="#6B7280" 
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="service" 
                      stroke="#6B7280" 
                      fontSize={12}
                      width={80}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      fill="#0A84FF"
                      radius={[0, 6, 6, 0]}
                    >
                      {resourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeChart === 'trends' && (
            <div className="h-full">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Risk Trend Analizi</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#6B7280" 
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="CRITICAL"
                      stroke={severityColors.CRITICAL}
                      strokeWidth={3}
                      dot={{ fill: severityColors.CRITICAL, strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, stroke: severityColors.CRITICAL, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="HIGH"
                      stroke={severityColors.HIGH}
                      strokeWidth={3}
                      dot={{ fill: severityColors.HIGH, strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, stroke: severityColors.HIGH, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="MEDIUM"
                      stroke={severityColors.MEDIUM}
                      strokeWidth={2}
                      dot={{ fill: severityColors.MEDIUM, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: severityColors.MEDIUM, strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="LOW"
                      stroke={severityColors.LOW}
                      strokeWidth={2}
                      dot={{ fill: severityColors.LOW, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: severityColors.LOW, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Enhanced Chart insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">En Yüksek Risk</p>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                {stats.critical > 0 ? 'Kritik' : stats.high > 0 ? 'Yüksek' : stats.medium > 0 ? 'Orta' : 'Düşük'}
              </p>
              <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                {stats.critical > 0 ? `${stats.critical} kritik bulgu` : 
                 stats.high > 0 ? `${stats.high} yüksek risk` : 
                 stats.medium > 0 ? `${stats.medium} orta risk` : `${stats.low} düşük risk`}
              </p>
            </div>
            <div className="p-3 bg-primary-500/10 rounded-full">
              <Target className="w-8 h-8 text-primary-500" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 p-6 rounded-xl border border-success-200 dark:border-success-800"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-600 dark:text-success-400 mb-1">Toplam Tespit</p>
              <p className="text-2xl font-bold text-success-700 dark:text-success-300">{stats.total}</p>
              <p className="text-xs text-success-500 dark:text-success-400 mt-1">
                {findings.length > 0 ? 'Aktif izleme' : 'Veri bekleniyor'}
              </p>
            </div>
            <div className="p-3 bg-success-500/10 rounded-full">
              <TrendingUp className="w-8 h-8 text-success-500" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 p-6 rounded-xl border border-warning-200 dark:border-warning-800"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warning-600 dark:text-warning-400 mb-1">Kritik Oran</p>
              <p className="text-2xl font-bold text-warning-700 dark:text-warning-300">
                {stats.total > 0 ? (((stats.critical + stats.high) / stats.total) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-warning-500 dark:text-warning-400 mt-1">
                Yüksek öncelikli
              </p>
            </div>
            <div className="p-3 bg-warning-500/10 rounded-full">
              <TrendingDown className="w-8 h-8 text-warning-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedCharts;