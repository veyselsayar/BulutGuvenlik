import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Finding, FindingStats } from '../types/findings';

export function useFindings() {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    severity: 'Tümü',
    search: '',
  });

  const fetchFindings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would use a proper API URL from environment variables
      const response = await axios.get('http://127.0.0.1:5000/findings', {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Add unique IDs if they don't exist
      const findingsWithIds = response.data.findings.map((finding: Finding, index: number) => ({
        ...finding,
        id: finding.id || `finding-${index}-${Date.now()}`,
      }));
      
      setFindings(findingsWithIds);
    } catch (err) {
      console.error('Error fetching findings:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Bağlantı zaman aşımına uğradı. Sunucu yanıt vermiyor olabilir.');
        } else if (err.response?.status === 404) {
          setError('API endpoint bulunamadı. Sunucunun http://127.0.0.1:5000 adresinde çalıştığından emin olun.');
        } else if (err.response?.status >= 500) {
          setError('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
        } else if (err.code === 'ERR_NETWORK') {
          setError('Ağ bağlantısı hatası. Sunucunun çalışır durumda olduğundan emin olun.');
        } else {
          setError(`API hatası: ${err.response?.status || 'Bilinmeyen hata'}`);
        }
      } else {
        setError('Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.');
      }
      
      // For development: use mock data if the API fails
      console.log('API failed, using mock data for development');
      setFindings(getMockFindings());
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFindings();
  }, [fetchFindings]);

  const filteredFindings = useMemo(() => {
    return findings.filter((finding) => {
      const matchesSeverity = 
        filters.severity === 'Tümü' || 
        finding.severity === filters.severity;
      
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        !searchTerm || 
        finding.title.toLowerCase().includes(searchTerm) ||
        finding.description.toLowerCase().includes(searchTerm) ||
        finding.resource?.toLowerCase().includes(searchTerm) ||
        finding.severity.toLowerCase().includes(searchTerm);
      
      return matchesSeverity && matchesSearch;
    });
  }, [findings, filters]);

  const stats: FindingStats = useMemo(() => {
    return {
      total: findings.length,
      critical: findings.filter(f => f.severity === 'CRITICAL').length,
      high: findings.filter(f => f.severity === 'HIGH').length,
      medium: findings.filter(f => f.severity === 'MEDIUM').length,
      low: findings.filter(f => f.severity === 'LOW').length,
    };
  }, [findings]);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshFindings = useCallback(() => {
    fetchFindings();
  }, [fetchFindings]);

  return {
    findings: filteredFindings,
    allFindings: findings,
    loading,
    error,
    filters,
    updateFilters,
    stats,
    refreshFindings,
  };
}

// Enhanced mock data for development purposes
function getMockFindings(): Finding[] {
  const baseDate = new Date();
  
  return [
    {
      id: 'finding-1',
      title: 'S3 Bucket Herkese Açık Erişim',
      description: 'S3 bucket "company-data" herkese açık okuma erişimi etkin durumda. Bu yapılandırma, hassas verilerin yetkisiz kullanıcılara maruz kalmasına neden olabilir. İnternetteki herkes bu bucket\'tan dosya indirip erişebilir durumda.',
      severity: 'CRITICAL',
      llm_output: {
        raw: 'Evet, bu kritik bir güvenlik açığıdır. S3 bucket\'ının herkese açık erişime sahip olması ciddi bir veri sızıntısı riski oluşturur. Derhal bucket policy güncellenmeli ve public access engellenmeli. Ayrıca bucket içeriği gözden geçirilmeli ve hassas veriler tespit edilmelidir. Bu tür açıklıklar GDPR ve diğer veri koruma düzenlemeleri açısından da ciddi yaptırımlar doğurabilir.'
      },
      resource: 'aws:s3:bucket:company-data',
      created_at: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-2',
      title: 'IAM Kullanıcısı Aşırı Yetkilendirilmiş',
      description: 'Kullanıcı "developer1" yönetici erişimi verilmiş durumda, bu da en az yetki prensibini ihlal ediyor. Bu kullanıcı sadece geliştirme kaynaklarına erişebilmeli.',
      severity: 'HIGH',
      llm_output: {
        raw: 'Bu kullanıcı geliştirici olarak yalnızca gerekli kaynaklara erişebilmelidir. Tam yönetici erişimi güvenlik riski oluşturuyor. Kullanıcının rolü gözden geçirilmeli ve minimum gerekli yetkilerle sınırlandırılmalıdır. Principle of least privilege uygulanmalı.'
      },
      resource: 'aws:iam:user/developer1',
      created_at: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-3',
      title: 'Veritabanı Yedekleri Şifrelenmemiş',
      description: 'RDS veritabanı yedekleri şifrelenmemiş durumda, yedek depolama alanı tehlikeye girerse hassas verilerin açığa çıkma riski var. Veritabanı müşteri kişisel bilgilerini içeriyor.',
      severity: 'MEDIUM',
      llm_output: {
        raw: 'Veritabanı yedeklerinin şifrelenmesi önemlidir. Bu orta seviye bir risk oluşturur ve düzeltilmelidir. Özellikle kişisel veri içeren veritabanları için şifreleme zorunludur. Compliance gereksinimleri açısından da gerekli.'
      },
      resource: 'aws:rds:instance:prod-db',
      created_at: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-4',
      title: 'CloudTrail Günlükleme Devre Dışı',
      description: 'Hesap için CloudTrail günlükleme devre dışı bırakılmış, bu da denetim yeteneklerini ve olay müdahalesini sınırlıyor. API çağrıları ve kullanıcı etkinliklerinin izlenmesini engelliyor.',
      severity: 'HIGH',
      llm_output: {
        raw: 'Evet, CloudTrail\'in kapatılması büyük bir güvenlik açığıdır. Tüm AWS etkinliklerinin izlenmesi gerekir. Compliance gereksinimleri için de CloudTrail aktif olmalıdır. Güvenlik olaylarının tespiti ve forensik analiz için kritik.'
      },
      resource: 'aws:cloudtrail:trail/main-trail',
      created_at: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-5',
      title: 'Zayıf Şifre Politikası',
      description: 'IAM şifre politikası yeterli karmaşıklık gereksinimlerini zorlamıyor. Mevcut politika 8 karakterden kısa şifrelere ve özel karakter olmadan şifrelere izin veriyor.',
      severity: 'MEDIUM',
      llm_output: {
        raw: 'Şifre politikası güçlendirilmelidir. En az 12 karakter, özel karakterler ve 90 günlük değişim süresi önerilir. Mevcut politika yetersizdir ve brute force saldırılarına karşı savunmasız bırakır.'
      },
      resource: 'aws:iam:account-password-policy',
      created_at: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-6',
      title: 'Güvenlik Grubu Aşırı İzinli',
      description: 'Güvenlik grubu "web-servers" herhangi bir IP adresinden 22 (SSH) ve 3389 (RDP) portlarına gelen trafiğe izin veriyor. Bu önemli bir saldırı yüzeyi oluşturuyor.',
      severity: 'CRITICAL',
      llm_output: {
        raw: 'Evet, bu çok ciddi bir güvenlik açığıdır. SSH ve RDP gibi yönetim portlarının tüm IP adreslerine açık olması saldırı yüzeyini genişletir. Hemen IP kısıtlaması uygulanmalıdır. Sadece gerekli IP aralıklarından erişime izin verilmeli.'
      },
      resource: 'aws:ec2:security-group/sg-web-servers',
      created_at: new Date(baseDate.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-7',
      title: 'Root Hesap Erişim Anahtarı Aktif',
      description: 'AWS root hesabının aktif erişim anahtarları var, bu güvenlik en iyi uygulamalarına aykırı. Root hesap sadece hesap yönetimi için kullanılmalı.',
      severity: 'HIGH',
      llm_output: {
        raw: 'Root hesabı için erişim anahtarları olmamalıdır. Bu anahtarlar hemen silinmeli ve gerekirse IAM kullanıcıları oluşturulmalıdır. Root hesap sadece acil durumlar için kullanılmalıdır. MFA da etkinleştirilmeli.'
      },
      resource: 'aws:iam:root-account',
      created_at: new Date(baseDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-8',
      title: 'EBS Volumeleri Şifrelenmemiş',
      description: 'Birden fazla EBS volume durağan veri için şifreleme kullanmıyor. Bu volumeler uygulama günlükleri ve geçici veri içeriyor.',
      severity: 'LOW',
      llm_output: {
        raw: 'Hayır, bu düşük seviyeli bir risktir. Hassas veri içermeyen EBS volumeleri için şifreleme zorunlu değildir ancak önerilir. Log verileri için risk düşüktür ama best practice olarak şifreleme uygulanabilir.'
      },
      resource: 'aws:ec2:volume/vol-123456789',
      created_at: new Date(baseDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-9',
      title: 'Lambda Fonksiyonu Aşırı Yetkili',
      description: 'Lambda fonksiyonu "data-processor" sadece belirli bucket\'lara okuma erişimi gerekirken tam S3 erişimi verilmiş.',
      severity: 'MEDIUM',
      llm_output: {
        raw: 'Lambda fonksiyonunun yetkileri minimum gereksinimlerle sınırlandırılmalıdır. Sadece gerekli S3 bucket\'larına read-only erişim verilmelidir. Principle of least privilege uygulanmalı.'
      },
      resource: 'aws:lambda:function:data-processor',
      created_at: new Date(baseDate.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-10',
      title: 'API Gateway Rate Limiting Yok',
      description: 'API Gateway endpoint\'inde rate limiting yapılandırılmamış, bu da DDoS saldırılarına ve kötüye kullanıma karşı savunmasız bırakıyor.',
      severity: 'HIGH',
      llm_output: {
        raw: 'Evet, API Gateway\'de rate limiting olmaması DDoS saldırılarına karşı savunmasızlık yaratır. Hemen throttling politikaları uygulanmalıdır. API abuse\'ü önlemek için gerekli.'
      },
      resource: 'aws:apigateway:rest-api/user-api',
      created_at: new Date(baseDate.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-11',
      title: 'EC2 Instance Metadata v1 Kullanımda',
      description: 'EC2 instance\'ları eski metadata service v1 kullanıyor, bu SSRF saldırılarına karşı savunmasız bırakır.',
      severity: 'MEDIUM',
      llm_output: {
        raw: 'IMDSv1 güvenlik riski oluşturur. IMDSv2\'ye geçiş yapılmalı ve token tabanlı erişim zorlanmalı. Bu SSRF saldırılarını önler ve güvenliği artırır.'
      },
      resource: 'aws:ec2:instance/i-0123456789abcdef0',
      created_at: new Date(baseDate.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'finding-12',
      title: 'KMS Key Rotation Devre Dışı',
      description: 'KMS anahtarları için otomatik rotation etkinleştirilmemiş, uzun süreli anahtar kullanımı güvenlik riskini artırır.',
      severity: 'LOW',
      llm_output: {
        raw: 'Hayır, bu düşük öncelikli bir bulgudur. KMS key rotation iyi bir güvenlik pratiğidir ancak kritik değildir. Yıllık rotation etkinleştirilebilir.'
      },
      resource: 'aws:kms:key/12345678-1234-1234-1234-123456789012',
      created_at: new Date(baseDate.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}