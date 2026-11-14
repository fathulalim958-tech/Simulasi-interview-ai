import React, { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import StatCard from './StatCard';
import InterviewHistory from './InterviewHistory';
import InterviewTips from './InterviewTips';
import UserProfileView from './UserProfileView';
import { 
  PlayCircle, 
  BookOpen, 
  Award, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  ArrowLeft, 
  ArrowRight, 
  Briefcase,
  History
} from 'lucide-react';
import AIHRD3D from './AIHRD3D';
import AmbientBackground from './AmbientBackground';
import { 
  getInterviewHistory, 
  calculateStats, 
  getUserProfile, 
  saveUserProfile,
  deleteInterviewSession,
  clearAllInterviewHistory
} from '../lib/storage';
import './Dashboard.css';

export default function Dashboard({ 
  onStartInterview, 
  onViewResult,
  theme = 'dark',
  onToggleTheme
}) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State riwayat interview dan profil
  const [history, setHistory] = useState(() => getInterviewHistory());
  const [userProfile, setUserProfile] = useState(() => getUserProfile());

  // Statistik dihitung secara dinamis dari riwayat terkini
  const stats = useMemo(() => calculateStats(history), [history]);

  // List 3 riwayat terbaru di kolom kiri bawah
  const displayedRecentHistory = useMemo(() => {
    if (history && history.length > 0) {
      return history.slice(0, 3).map((item, idx) => ({
        id: item.id,
        title: item.position ? `Interview Simulasi (${item.position})` : `Interview Simulasi ${history.length - idx}`,
        date: item.formattedDate || 'Baru saja',
        score: item.score || 0,
        finalResult: item.finalResult,
        userData: item.userData,
        chatHistory: item.chatHistory || []
      }));
    }
    return [];
  }, [history]);

  // 5 Topik Tips di kolom kanan bawah (sesuai mockup)
  const guideTips = [
    { id: 1, text: 'Kenali Profil Perusahaan' },
    { id: 2, text: 'Tunjukkan Keahlian Anda' },
    { id: 3, text: 'Berikan Contoh Nyata' },
    { id: 4, text: 'Tunjukkan Motivasi' },
    { id: 5, text: 'Ajukan Pertanyaan yang Relevan' }
  ];

  const handleMenuSelect = (menuId) => {
    if (menuId === 'start') {
      onStartInterview();
    } else {
      setActiveMenu(menuId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveProfile = (updatedProfile) => {
    if (!updatedProfile) return;
    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  // Hapus satu sesi riwayat interview
  const handleDeleteHistory = (id) => {
    const updated = deleteInterviewSession(id);
    setHistory(updated);
  };

  // Hapus seluruh riwayat interview
  const handleClearAllHistory = () => {
    const updated = clearAllInterviewHistory();
    setHistory(updated);
  };

  return (
    <div className="dashboard-container">
      {/* Latar Belakang Gradien Gelombang Ambient 3D Sutra */}
      <AmbientBackground theme={theme} />

      {/* 1. Sidebar Navigasi */}
      <Sidebar 
        activeMenu={activeMenu}
        onSelectMenu={handleMenuSelect}
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className={`dashboard-main-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <DashboardHeader 
          userName={userProfile.name}
          isSidebarOpen={!isSidebarCollapsed}
          onToggleSidebar={() => {
            if (window.innerWidth <= 768) {
              setIsMobileMenuOpen(prev => !prev);
            } else {
              setIsSidebarCollapsed(prev => !prev);
            }
          }}
          onOpenProfile={() => handleMenuSelect('profile')}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <main className="dashboard-content-area">
          {/* =================================================================
              TAMPILAN 1: DASHBOARD UTAMA (LAYOUT ORIGINAL DENGAN UI/UX DUA MODE)
             ================================================================= */}
          {activeMenu === 'dashboard' && (
            <>
              {/* Hero Section Banner */}
              <section className="dashboard-hero-banner">
                <div className="hero-banner-decor" aria-hidden="true" />

                <div className="hero-content-col">
                  <div className="hero-online-badge">
                    <span className="live-pulse-green" />
                    <span>AI Interviewer Online - Elon Musk</span>
                  </div>

                  <h2 className="hero-title">
                    Siap Menghadapi Interview Kerja?
                  </h2>

                  <p className="hero-description">
                    Latih kemampuan wawancara Anda bersama AI HRD profesional dan dapatkan evaluasi untuk meningkatkan peluang karier.
                  </p>

                  <div className="hero-action-buttons">
                    <button 
                      className="hero-btn-primary"
                      onClick={onStartInterview}
                    >
                      <PlayCircle size={18} />
                      <span>Mulai Simulasi Interview</span>
                    </button>

                    <button 
                      className="hero-btn-secondary"
                      onClick={() => handleMenuSelect('tips')}
                    >
                      <BookOpen size={18} />
                      <span>Pelajari Tips Interview</span>
                    </button>
                  </div>
                </div>

                {/* Showcase 3D Avatar HRD Elon Musk */}
                <div className="hero-avatar-showcase">
                  <div className="showcase-card">
                    <AIHRD3D effectiveStatus="idle" />
                    <div className="showcase-badge-overlay">
                      <span className="showcase-name">Elon Musk</span>
                      <span className="showcase-role">Lead Interviewer</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Empat Kartu Statistik Real (Dari LocalStorage) */}
              <section className="dashboard-stats-grid">
                <StatCard 
                  title="Total Interview"
                  value={stats.totalInterviews}
                  unit="Sesi"
                  icon={BarChart3}
                  trendLabel={stats.totalInterviews === 0 ? "Belum ada sesi" : `${stats.totalInterviews} sesi tersimpan`}
                  gradientTheme="purple"
                />

                <StatCard 
                  title="Rata-rata Skor"
                  value={stats.averageScore}
                  unit="/ 100"
                  icon={Award}
                  trendLabel={stats.averageScore >= 80 ? "Sangat Baik" : stats.averageScore >= 65 ? "Kompeten" : "Perlu Latihan"}
                  gradientTheme="blue"
                />

                <StatCard 
                  title="Total Waktu Berlatih"
                  value={stats.totalPracticeMinutes}
                  unit="Menit"
                  icon={Clock}
                  trendLabel="Akun aktif simulasi"
                  gradientTheme="amber"
                />

                <StatCard 
                  title="Perkembangan Skor"
                  value={stats.scoreGrowth > 0 ? `+${stats.scoreGrowth}` : `${stats.scoreGrowth}`}
                  unit="Poin"
                  icon={TrendingUp}
                  trend={stats.growthDirection === 'up' ? `+${stats.scoreGrowth} Poin` : stats.growthDirection === 'down' ? `-${stats.scoreGrowth} Poin` : "Tetap"}
                  trendDirection={stats.growthDirection}
                  trendLabel="Dibanding sesi lalu"
                  gradientTheme="green"
                />
              </section>

              {/* 2 Kolom Bawah: Riwayat Interview & Panduan Wawancara (Sesuai Mockup Gambar) */}
              <section className="dashboard-bottom-two-col">
                {/* Kolom Kiri: Riwayat Interview */}
                <div className="bottom-card history-preview-card">
                  <div className="bottom-card-header">
                    <h3 className="bottom-card-title">Riwayat Interview</h3>
                    <button 
                      className="btn-view-all-text"
                      onClick={() => handleMenuSelect('history')}
                    >
                      <span>Lihat Semua</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="history-preview-list">
                    {displayedRecentHistory.length === 0 ? (
                      <div className="history-empty-mini">
                        <div className="empty-mini-icon-circle">
                          <History size={20} />
                        </div>
                        <p className="empty-mini-text">tidak ada riwayat interview</p>
                        <button 
                          className="btn-mini-start" 
                          onClick={onStartInterview}
                        >
                          <PlayCircle size={14} />
                          <span>Mulai Wawancara Baru</span>
                        </button>
                      </div>
                    ) : (
                      displayedRecentHistory.map((item, idx) => {
                        const isHigh = item.score >= 65;
                        return (
                          <div 
                            key={item.id || idx} 
                            className="history-preview-item"
                            onClick={() => {
                              if (item.finalResult) onViewResult(item);
                              else handleMenuSelect('history');
                            }}
                          >
                            <div className="history-item-play-icon">
                              <PlayCircle size={18} />
                            </div>
                            <div className="history-item-info">
                              <h4 className="history-item-title">{item.title}</h4>
                              <span className="history-item-date">{item.date}</span>
                            </div>
                            <div className={`history-score-pill ${isHigh ? 'score-high' : 'score-med'}`}>
                              Skor: {item.score}/100
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Kolom Kanan: Panduan Wawancara */}
                <div className="bottom-card guide-preview-card">
                  <div className="bottom-card-header">
                    <h3 className="bottom-card-title">Panduan Wawancara</h3>
                    <span className="guide-count-pill">5 Topik Tips</span>
                  </div>

                  <div className="guide-numbered-list">
                    {guideTips.map((tip) => (
                      <div 
                        key={tip.id} 
                        className="guide-numbered-item"
                        onClick={() => handleMenuSelect('tips')}
                      >
                        <span className="guide-number-circle">{tip.id}</span>
                        <span className="guide-item-text">{tip.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Banner CTA Bawah */}
                  <div className="guide-cta-banner" onClick={onStartInterview} role="button" tabIndex={0}>
                    <div className="cta-banner-icon">
                      <Briefcase size={16} />
                    </div>
                    <span className="cta-banner-text">
                      Persiapkan diri dengan baik, raih karier impianmu!
                    </span>
                    <button className="cta-banner-arrow" aria-label="Mulai Latihan">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* =================================================================
              TAMPILAN 2: PANDUAN & TIPS WAWANCARA (NAVIGASI TERPISAH)
             ================================================================= */}
          {activeMenu === 'tips' && (
            <div className="dashboard-subview-wrapper">
              <div className="subview-nav-bar">
                <button 
                  className="btn-back-dashboard"
                  onClick={() => handleMenuSelect('dashboard')}
                >
                  <ArrowLeft size={16} />
                  <span>Kembali ke Dashboard</span>
                </button>
                <button 
                  className="btn-header-start-interview"
                  onClick={onStartInterview}
                >
                  <PlayCircle size={16} />
                  <span>Wawancara Baru</span>
                </button>
              </div>

              <InterviewTips 
                onStartInterview={onStartInterview} 
                onSelectTipsItem={(tipId) => console.log('Tip dipilih:', tipId)}
              />
            </div>
          )}

          {/* =================================================================
              TAMPILAN 3: SEMUA RIWAYAT INTERVIEW (NAVIGASI TERPISAH)
             ================================================================= */}
          {activeMenu === 'history' && (
            <div className="dashboard-subview-wrapper">
              <div className="subview-nav-bar">
                <button 
                  className="btn-back-dashboard"
                  onClick={() => handleMenuSelect('dashboard')}
                >
                  <ArrowLeft size={16} />
                  <span>Kembali ke Dashboard</span>
                </button>
                <button 
                  className="btn-header-start-interview"
                  onClick={onStartInterview}
                >
                  <PlayCircle size={16} />
                  <span>Wawancara Baru</span>
                </button>
              </div>

              <InterviewHistory 
                history={history}
                onViewResult={onViewResult}
                onStartInterview={onStartInterview}
                onDeleteHistory={handleDeleteHistory}
                onClearAll={handleClearAllHistory}
                showAll={true}
              />
            </div>
          )}

          {/* =================================================================
              TAMPILAN 4: PROFIL PENGGUNA (NAVIGASI TERPISAH)
             ================================================================= */}
          {activeMenu === 'profile' && (
            <div className="dashboard-subview-wrapper">
              <div className="subview-nav-bar">
                <button 
                  className="btn-back-dashboard"
                  onClick={() => handleMenuSelect('dashboard')}
                >
                  <ArrowLeft size={16} />
                  <span>Kembali ke Dashboard</span>
                </button>
                <button 
                  className="btn-header-start-interview"
                  onClick={onStartInterview}
                >
                  <PlayCircle size={16} />
                  <span>Wawancara Baru</span>
                </button>
              </div>

              <UserProfileView 
                userProfile={userProfile}
                onSaveProfile={handleSaveProfile}
                stats={stats}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}