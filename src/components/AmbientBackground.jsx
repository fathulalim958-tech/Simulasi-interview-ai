import React from 'react';
import './AmbientBackground.css';

/**
 * Komponen Latar Belakang Gelombang Gradien Ambient (Wave Ribbons)
 * Menampilkan pita gelombang sutra 3D yang halus & dinamis (Light & Dark Mode)
 * persis seperti pada gambar referensi mockup.
 */
export default function AmbientBackground({ theme = 'dark' }) {
  const isLight = theme === 'light';

  return (
    <div className={`ambient-bg-wrapper ${isLight ? 'ambient-light' : 'ambient-dark'}`} aria-hidden="true">
      {/* 1. Ambient Glow Orbs di sudut-sudut strategis */}
      <div className="ambient-glow orb-1" />
      <div className="ambient-glow orb-2" />
      <div className="ambient-glow orb-3" />

      {/* 2. SVG Pita Gelombang Fluida (Flowing Silk Ribbons) */}
      <svg
        className="ambient-waves-svg"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradien Dark Mode */}
          <linearGradient id="darkWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338ca" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#7c3aed" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#2563eb" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="darkWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="darkWaveGrad3" x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.8" />
          </linearGradient>

          {/* Gradien Light Mode */}
          <linearGradient id="lightWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#e2e8f0" stopOpacity="0.75" />
            <stop offset="75%" stopColor="#cbd5e1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="lightWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#e2e8f0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.4" />
          </linearGradient>

          <filter id="ambientBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="35" />
          </filter>
          <filter id="softBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="15" />
          </filter>
        </defs>

        {isLight ? (
          /* ===================================================
             PITA GELOMBANG LIGHT MODE (SILVER-WHITE FLUID WAVES)
             =================================================== */
          <g className="waves-group-light">
            {/* Gelombang Latar 1: Pita Lebar Diagonal dari kiri atas ke kanan bawah */}
            <path
              d="M-100,-100 C300,200 600,50 1100,450 C1600,850 1800,700 2100,1200 L2100,1200 L-100,1200 Z"
              fill="url(#lightWaveGrad1)"
              filter="url(#ambientBlur)"
              opacity="0.85"
            />

            {/* Gelombang Utama 2: Pita Sutra Melengkung Tajam di Bagian Kiri & Bawah */}
            <path
              d="M-200,600 C200,350 550,750 950,550 C1350,350 1700,650 2100,400 L2100,1200 L-200,1200 Z"
              fill="url(#lightWaveGrad2)"
              opacity="0.65"
            />

            {/* Gelombang Aksen 3: Lengkungan Elegan Melewati Area Sidebar */}
            <path
              d="M-100,150 C250,220 400,650 650,850 C900,1050 1400,950 1950,1150"
              stroke="rgba(255, 255, 255, 0.95)"
              strokeWidth="48"
              fill="none"
              filter="url(#softBlur)"
              opacity="0.7"
            />
            <path
              d="M-80,180 C270,250 420,670 680,870 C920,1060 1420,960 1970,1160"
              stroke="rgba(203, 213, 225, 0.45)"
              strokeWidth="24"
              fill="none"
              opacity="0.5"
            />
          </g>
        ) : (
          /* ===================================================
             PITA GELOMBANG DARK MODE (ELECTRIC VIOLET / NEBULA BLUE)
             =================================================== */
          <g className="waves-group-dark">
            {/* Gelombang Latar 1: Kabut Kosmik Ungu Gelap */}
            <path
              d="M-100,-100 C400,150 700,50 1200,500 C1700,950 1850,750 2100,1200 L2100,1200 L-100,1200 Z"
              fill="url(#darkWaveGrad1)"
              filter="url(#ambientBlur)"
              opacity="0.65"
            />

            {/* Gelombang Utama 2: Pita Sutra Menyala Melintang dari Kiri ke Kanan Bawah */}
            <path
              d="M-200,650 C250,300 650,750 1100,500 C1550,250 1800,600 2150,350 L2150,1200 L-200,1200 Z"
              fill="url(#darkWaveGrad2)"
              opacity="0.5"
            />

            {/* Gelombang Aksen 3: Garis Pita Neon Ungu-Biru yang Tegas di Balik Sidebar */}
            <path
              d="M-80,120 C280,240 450,650 720,880 C1000,1100 1500,950 2050,1180"
              stroke="url(#darkWaveGrad3)"
              strokeWidth="60"
              fill="none"
              filter="url(#ambientBlur)"
              opacity="0.75"
            />
            <path
              d="M-60,140 C290,250 460,660 740,890 C1010,1110 1520,960 2070,1190"
              stroke="rgba(139, 92, 246, 0.7)"
              strokeWidth="18"
              fill="none"
              filter="url(#softBlur)"
              opacity="0.8"
            />
            <path
              d="M-50,150 C300,260 470,670 750,900 C1020,1120 1530,970 2080,1200"
              stroke="rgba(56, 189, 248, 0.85)"
              strokeWidth="4"
              fill="none"
              opacity="0.9"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
