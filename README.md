# Bulut Güvenlik Analiz Platformu

---

## 🚀 Proje Hakkında

**Bulut Güvenlik Analiz Platformu**, AWS, Azure, GCP gibi büyük bulut sağlayıcılarından toplanan güvenlik bulgularını merkezi bir veri tabanında saklayan, otomatik olarak analiz eden ve kullanıcı dostu arayüz ile görselleştiren kapsamlı bir güvenlik yönetim sistemidir.  

Platform, güvenlik bulgularını otomatik olarak büyük dil modelleri (LLM) kullanarak değerlendirir, false positive ayrımı yapar ve somut çözüm önerileri sunar. Böylece güvenlik ekiplerinin iş yükü azaltılır, risk yönetimi hızlandırılır ve bulut ortamlarının güvenlik durumu sürekli izlenebilir hale gelir.

---

## 📌 Özellikler

- **Çoklu Bulut Sağlayıcı Desteği:** AWS, Azure, GCP gibi birden fazla platformdan güvenlik bulgularını destekler.
- **Merkezi Veri Yönetimi:** MongoDB üzerinde tüm bulgular normalize edilerek saklanır.
- **Otomatik LLM Analizi:** HuggingFace üzerinden büyük dil modelleri ile bulguların otomatik analizi ve yorumlanması.
- **RESTful API:** Backend üzerinden güvenlik bulgularına erişim, filtreleme ve yönetim.
- **Modern Frontend:** React + TypeScript kullanılarak geliştirilen interaktif ve kullanıcı dostu arayüz.
- **Gerçek Zamanlı Filtreleme & Arama:** Güçlü filtreleme ve gelişmiş arama özellikleri ile kolay bulgu yönetimi.
- **Grafikler & İstatistikler:** Dashboard üzerinde güvenlik durumunu görselleştiren istatistikler ve grafikler.
- **Kolay Entegrasyon:** API sayesinde harici sistemlerle hızlı entegrasyon imkanı.

---

## 🏗 Teknolojiler

| Katman               | Teknoloji / Kütüphane                         |
|----------------------|----------------------------------------------|
| **Frontend**         | React, TypeScript, React Hooks, Axios        |
| **Backend**          | Python, Flask, pymongo                        |
| **Veri Tabanı**      | MongoDB                                      |
| **LLM Entegrasyonu** | HuggingFace Inference API (Mistral LLM)      |
| **Bulut Taraması**   | Prowler (Azure, AWS, GCP bulut güvenlik taraması) |
| **Diğer**            | Docker (opsiyonel), CORS                      |

---

## 🏛 Mimari Genel Bakış

Frontend (React + TypeScript)
├── UI: Kullanıcı arayüzü bileşenleri (Dashboard, FilterBar, FindingsTable vb.)
├── Custom Hooks: useFindings gibi API etkileşimleri ve durum yönetimi
├── State Management: React Context veya State Hookları

Backend (Python + Flask)
├── API Endpoints: Güvenlik bulguları CRUD, analiz tetikleme
├── MongoDB: Güvenlik bulgularının depolanması ve sorgulanması
├── LLM Integration: Bulguların otomatik analiz ve yorumlanması için API çağrıları

Dış Servisler
├── AWS, Azure, GCP: Bulut ortamları
├── HuggingFace LLM Service: Dil modeli üzerinden bulgu analizi

---

## ⚙️ Kurulum ve Çalıştırma

### Ön Koşullar

- Python 3.9 veya üzeri
- Node.js 16 veya üzeri
- MongoDB 4.4 veya üzeri (yerel ya da uzak)
- Azure CLI (Azure taraması için)
- Prowler aracı (bulut güvenlik taraması için)

---

### Backend Kurulumu

1. Projeyi klonlayın:

    git clone https://github.com/kullaniciadi/bulutguvenlik.git
    cd bulutguvenlik/backend

2. Sanal ortam oluşturun ve aktifleştirin:

    python -m venv .venv
    source .venv/bin/activate      # Linux/macOS
    .venv\Scripts\activate.bat     # Windows

3. Gerekli Python paketlerini yükleyin:

    pip install -r requirements.txt

4. `.env` dosyasını oluşturup HuggingFace ve MongoDB bilgilerini ekleyin:

    HF_TOKEN=your_huggingface_token
    MONGO_URI=mongodb://localhost:27017

5. MongoDB servisini başlatın (ör: `sudo systemctl start mongod` veya Docker ile).

6. Backend API’yi çalıştırın:

    python app.py

---

### Frontend Kurulumu

1. Frontend dizinine gidin:

    cd ../frontend

2. Bağımlılıkları yükleyin:

    npm install

3. Geliştirme sunucusunu başlatın:

    npm start

4. Tarayıcınızda http://localhost:3000 adresini açın.

---

## 🧩 Kullanım

- Bulut sağlayıcılar için Prowler taraması yaparak bulguları oluşturun.
- Backend API otomatik olarak bulguları MongoDB’ye kaydeder.
- Frontend arayüzünde bulguları listeleyebilir, filtreleyebilir ve detaylı analizlere ulaşabilirsiniz.
- LLM analizler backend tarafından tetiklenir ve false positive ayrımı ile çözüm önerileri sağlar.
- API endpoint’lerini kullanarak harici sistemlerle entegrasyon yapabilirsiniz.

---

## 🛠 Geliştirme & Katkı

- Projeye katkı sağlamak için fork edip PR açabilirsiniz.
- Yeni bulut sağlayıcılar ve analiz metrikleri ekleyebilirsiniz.
- Frontend bileşenlerini geliştirip yeni grafikler ve raporlama özellikleri ekleyebilirsiniz.
- Otomatik test ve CI/CD süreçleri ekleyerek projenin sürdürülebilirliğini artırabilirsiniz.

---

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.  
© 2025 Bulut Güvenlik Takımı

---

## 📞 İletişim

Sorularınız veya destek talepleriniz için:  
- E-posta: destek@bulutguvenlik.com  
- GitHub Issues üzerinden bildirim gönderebilirsiniz.

---

**Not:** Proje kapsamı ve ihtiyaçlar doğrultusunda README dosyası güncellenmeye devam edecektir.
