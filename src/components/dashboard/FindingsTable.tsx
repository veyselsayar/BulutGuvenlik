import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Calendar, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { Finding } from '../../types/findings';
import RiskBadge from './RiskBadge';
import LlmResultCard from './LlmResultCard';

interface FindingsTableProps {
  findings: Finding[];
  isLoading: boolean;
  expandedFinding: string | null;
  toggleExpandFinding: (id: string) => void;
}

// Güvenli resource gösterimi için yardımcı fonksiyon
function renderResource(resource: any) {
  if (typeof resource === "string") return resource;
  if (resource) return JSON.stringify(resource);
  return "-";
}

const FindingsTable: React.FC<FindingsTableProps> = ({
  findings,
  isLoading,
  expandedFinding,
  toggleExpandFinding
}) => {
  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-t-xl p-6">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
                  <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (findings.length === 0) {
    return (
      <motion.div
        className="card p-12 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-md mx-auto">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            Zafiyet bulunamadı
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Mevcut filtrelerle eşleşen zafiyet bulunmamaktadır. Farklı arama kriterleri deneyebilir veya filtreleri temizleyebilirsiniz.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-t-xl p-6 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-primary-500" />
            Tespit Edilen Zafiyetler
          </h3>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-semibold">
              {findings.length} Bulgu
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {findings.map((finding, index) => (
          <React.Fragment key={finding.id}>
            <motion.div
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => toggleExpandFinding(finding.id)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <RiskBadge severity={finding.severity} size="sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg leading-tight">
                        {finding.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {finding.description}
                      </p>

                      {finding.resource && (
                        <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg inline-flex max-w-fit">
                          <ExternalLink className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="font-mono truncate">
                            {renderResource(finding.resource)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:ml-4">
                  {finding.created_at && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span>{new Date(finding.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}

                  <motion.button
                    className="flex items-center justify-center p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200"
                    aria-label={expandedFinding === finding.id ? "Detayları gizle" : "Detayları göster"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      animate={{ rotate: expandedFinding === finding.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </motion.button>
                </div>
              </div>

              <AnimatePresence>
                {expandedFinding === finding.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h5 className="font-semibold text-sm mb-4 text-gray-700 dark:text-gray-300 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Zafiyet Detayları
                          </h5>
                          <div className="space-y-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {finding.description}
                              </p>
                            </div>

                            {finding.resource && (
                              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <h6 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                  Etkilenen Kaynak
                                </h6>
                                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                  <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-mono">
                                    {renderResource(finding.resource)}
                                  </code>
                                </div>
                              </div>
                            )}

                            {finding.created_at && (
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="h-3 w-3 mr-2" />
                                <span>
                                  Tespit tarihi: {new Date(finding.created_at).toLocaleString('tr-TR')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-sm mb-4 text-gray-700 dark:text-gray-300 flex items-center">
                            <div className="w-4 h-4 mr-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-sm"></div>
                            Yapay Zeka Analizi
                          </h5>
                          <LlmResultCard llmOutput={finding.llm_output} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default FindingsTable;
