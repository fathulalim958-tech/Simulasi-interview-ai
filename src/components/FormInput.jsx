import React, { useState } from 'react';
import { User, Briefcase, FileText, ArrowRight, ArrowLeft, Edit3 } from 'lucide-react';
import './FormInput.css';

export default function FormInput({ onStart, onBack }) {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [position, setPosition] = useState('');
  const [customPosition, setCustomPosition] = useState('');

  const isCustom = position === 'CUSTOM';
  const effectivePosition = isCustom ? customPosition.trim() : position;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && experience.trim() && effectivePosition) {
      // Buka kunci AudioContext / SpeechSynthesis dalam event klik pengguna
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      onStart({ 
        name: name.trim(), 
        experience: experience.trim(), 
        position: effectivePosition
      });
    } else {
      alert('Harap lengkapi seluruh field (Nama, Pengalaman, dan Posisi) sebelum memulai wawancara!');
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        {/* Navigation back to Dashboard */}
        {onBack && (
          <button 
            type="button" 
            className="form-back-nav-btn" 
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              marginBottom: '16px',
              padding: '0',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Dashboard</span>
          </button>
        )}

        {/* Header Preview Interviewer */}
        <div className="form-header-badge">
          <div className="form-avatar-preview form-avatar-initials">
            EM
          </div>
          <div className="form-interviewer-info">
            <span className="interviewer-name">Elon Musk</span>
            <span className="interviewer-role">Executive Tech Interviewer</span>
          </div>
        </div>

        <h1 className="form-title">Simulasi Wawancara AI</h1>
        <p className="form-subtitle">
          Wawancara kerja interaktif dengan video call dan analisis suara real-time.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <div className="input-group">
            <div className="input-label-wrapper">
              <User size={13} />
              <label htmlFor="candidate-name">Nama Lengkap</label>
            </div>
            <input 
              id="candidate-name"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="form-input" 
              placeholder="Contoh: Budi Pratama" 
              required
            />
          </div>

          {/* Posisi yang Dilamar */}
          <div className="input-group">
            <div className="input-label-wrapper">
              <Briefcase size={13} />
              <label htmlFor="candidate-position">Posisi yang Dilamar</label>
            </div>
            <select 
              id="candidate-position"
              value={position} 
              onChange={(e) => setPosition(e.target.value)} 
              className="form-input"
              required
            >
              <option value="">-- Pilih Posisi Pekerjaan --</option>

              <optgroup label="💻 Teknologi & Software (IT)">
                <option value="Web Developer">Web Developer (Frontend / Fullstack)</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Mobile App Developer">Mobile App Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Data Scientist">Data Scientist / AI Engineer</option>
                <option value="Business Analyst">Business Analyst</option>
                <option value="System Analyst">System Analyst</option>
                <option value="QA Tester">QA Tester / Automation</option>
              </optgroup>

              <optgroup label="💼 Bisnis, Keuangan & HR">
                <option value="Staff Akuntansi & Keuangan">Staff Akuntansi & Keuangan (Finance & Accounting)</option>
                <option value="Human Resources (HR) Specialist">Human Resources (HR) / Talent Acquisition</option>
              </optgroup>

              <optgroup label="📢 Pemasaran & Media Kreatif">
                <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
                <option value="Content Writer & Copywriter">Content Writer / Copywriter</option>
              </optgroup>

              <optgroup label="🤝 Penjualan & Pelayanan (Frontliner)">
                <option value="Sales & Business Development">Sales & Business Development Executive</option>
                <option value="Customer Service Specialist">Customer Service / Support Specialist</option>
              </optgroup>

              <optgroup label="📋 Administrasi & Operasional">
                <option value="Staff Administrasi Perkantoran">Staff Administrasi Perkantoran</option>
                <option value="Supply Chain & Logistik Officer">Supply Chain & Logistik Officer</option>
              </optgroup>

              <optgroup label="✨ Posisi Lainnya">
                <option value="CUSTOM">➕ Lainnya (Ketik Posisi Sendiri...)</option>
              </optgroup>
            </select>

            {/* Input Tambahan Jika Memilih 'Lainnya' */}
            {isCustom && (
              <div className="custom-position-wrapper" style={{ marginTop: '10px' }}>
                <div className="input-label-wrapper" style={{ color: '#60a5fa' }}>
                  <Edit3 size={12} />
                  <label htmlFor="custom-position-input">Ketik Nama Posisi Spesifik</label>
                </div>
                <input
                  id="custom-position-input"
                  type="text"
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  className="form-input"
                  placeholder="Misal: Guru Bahasa Inggris, Barista, Staff Gudang, Desainer Grafis..."
                  required
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Pengalaman Kerja */}
          <div className="input-group">
            <div className="input-label-wrapper">
              <FileText size={13} />
              <label htmlFor="candidate-experience">Ringkasan Pengalaman Kerja</label>
            </div>
            <textarea 
              id="candidate-experience"
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              className="form-input" 
              rows="3" 
              placeholder="Ceritakan latar belakang, proyek, atau keahlian utama Anda..."
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            <span>Mulai Sesi Wawancara</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
