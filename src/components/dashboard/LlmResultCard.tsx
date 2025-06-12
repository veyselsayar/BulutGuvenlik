import React from 'react';
import { CheckCircle, XCircle, Loader2, Brain, AlertTriangle } from 'lucide-react';
import { LlmOutput } from '../../types/findings';
import { motion } from 'framer-motion';

interface LlmResultCardProps {
  llmOutput?: LlmOutput;
}

const LlmResultCard: React.FC<LlmResultCardProps> = ({ llmOutput }) => {
  // If no LLM output, show awaiting analysis
  if (!llmOutput || !llmOutput.raw) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-3" />
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Analiz bekleniyor...</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">AI değerlendirmesi yapılıyor</span>
      </motion.div>
    );
  }

  // Determine if the LLM found a real vulnerability
  const isVulnerability = llmOutput.raw.toLowerCase().includes('evet') || 
                          llmOutput.raw.toLowerCase().includes('kritik') ||
                          llmOutput.raw.toLowerCase().includes('ciddi');
  
  return (
    <motion.div 
      className={`p-6 rounded-xl border-2 transition-all duration-300 ${
        isVulnerability 
          ? 'bg-gradient-to-br from-error-50 to-error-100 border-error-200 dark:from-error-900/20 dark:to-error-800/20 dark:border-error-800' 
          : 'bg-gradient-to-br from-success-50 to-success-100 border-success-200 dark:from-success-900/20 dark:to-success-800/20 dark:border-success-800'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start mb-4">
        <div className={`p-2 rounded-lg mr-3 ${
          isVulnerability 
            ? 'bg-error-500/10' 
            : 'bg-success-500/10'
        }`}>
          {isVulnerability ? (
            <AlertTriangle className="w-5 h-5 text-error-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-success-500" />
          )}
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-bold mb-1 ${
            isVulnerability ? 'text-error-700 dark:text-error-300' : 'text-success-700 dark:text-success-300'
          }`}>
            {isVulnerability ? 'Gerçek Güvenlik Açığı Tespit Edildi' : 'Düşük Öncelikli Bulgu'}
          </h4>
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <Brain className="w-3 h-3 mr-1" />
            <span>AI Güvenlik Analizi</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-white/20 dark:border-gray-700/50">
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {llmOutput.raw}
        </div>
      </div>
      
      {/* Analysis confidence indicator */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isVulnerability ? 'bg-error-500' : 'bg-success-500'
          }`}></div>
          <span>Güvenilirlik: Yüksek</span>
        </div>
        <div className="text-gray-400 dark:text-gray-500">
          AI Değerlendirmesi
        </div>
      </div>
    </motion.div>
  );
};

export default LlmResultCard;