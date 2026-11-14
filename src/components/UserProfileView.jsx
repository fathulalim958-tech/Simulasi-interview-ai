import React, { useState } from 'react';
import { User, Mail, Briefcase, Award, CheckCircle2, Save, Sparkles, Clock, Target } from 'lucide-react';

export default function UserProfileView({ 
  userProfile = {}, 
  onSaveProfile,
  stats = {}
}) {
  const [name, setName] = useState(() => userProfile?.name || 'budi');
  const [title, setTitle] = useState(() => userProfile?.title || 'Software Engineer');
  const [email, setEmail] = useState(() => userProfile?.email || 'budi@example.com');
  const [bio, setBio] = useState(() => userProfile?.bio || 'Kandidat profesional yang berfokus pada teknologi modern, arsitektur perangkat lunak, dan problem solving.');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated = {
      ...userProfile,
      name: name.trim(),
      title: title.trim(),
      email: email.trim(),
      bio: bio.trim()
    };

    onSaveProfile?.(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const initialLetter = name ? name.trim().charAt(0).toUpperCase() : 'B';

  return (
    <div className="dashboard-section-card profile-page-card">
      {/* Header Profil */}
      <div className="section-card-header profile-card-header">
        <div className="profile-banner-flex">
          <div className="profile-large-avatar">
            <span>{initialLetter}</span>
            <span className="avatar-online-badge" />
          </div>

          <div className="profile-banner-info">
            <div className="profile-name-row">
              <h2 className="profile-display-name">{name || 'Kandidat'}</h2>
              <span className="profile-verified-badge">
                <Sparkles size={12} />
                <span>Candidate Aktif</span>
              </span>
            </div>
            <p className="profile-display-title">{title || 'Job Seeker'}</p>
            <p className="profile-display-email">{email || 'email@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Ringkasan Statistik Kandidat */}
      <div className="profile-stats-row">
        <div className="profile-stat-box">
          <div className="profile-stat-icon icon-purple">
            <Target size={18} />
          </div>
          <div>
            <div className="profile-stat-val">{stats?.totalSessions || 3} Sesi</div>
            <div className="profile-stat-lbl">Simulasi Selesai</div>
          </div>
        </div>

        <div className="profile-stat-box">
          <div className="profile-stat-icon icon-blue">
            <Award size={18} />
          </div>
          <div>
            <div className="profile-stat-val">{stats?.averageScore || 38} / 100</div>
            <div className="profile-stat-lbl">Rata-rata Skor</div>
          </div>
        </div>

        <div className="profile-stat-box">
          <div className="profile-stat-icon icon-green">
            <Clock size={18} />
          </div>
          <div>
            <div className="profile-stat-val">{stats?.totalPracticeMinutes || 11} Menit</div>
            <div className="profile-stat-lbl">Waktu Latihan</div>
          </div>
        </div>
      </div>

      {/* Notifikasi Simpan Sukses */}
      {isSaved && (
        <div className="profile-save-alert">
          <CheckCircle2 size={16} />
          <span>Profil berhasil disimpan dan diperbarui di seluruh dashboard!</span>
        </div>
      )}

      {/* Form Edit Profil */}
      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-section-title">
          <User size={16} />
          <span>Informasi Pribadi & Preferensi Karier</span>
        </div>

        <div className="profile-form-grid">
          <div className="profile-form-group">
            <label className="profile-field-label">Nama Lengkap</label>
            <div className="profile-input-wrapper">
              <User size={16} className="profile-input-icon" />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="profile-text-input"
                placeholder="Masukkan nama lengkap Anda"
                required
              />
            </div>
          </div>

          <div className="profile-form-group">
            <label className="profile-field-label">Target Posisi / Profesi</label>
            <div className="profile-input-wrapper">
              <Briefcase size={16} className="profile-input-icon" />
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="profile-text-input"
                placeholder="Contoh: Frontend Developer / UI/UX Designer"
              />
            </div>
          </div>

          <div className="profile-form-group full-width">
            <label className="profile-field-label">Alamat Email</label>
            <div className="profile-input-wrapper">
              <Mail size={16} className="profile-input-icon" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="profile-text-input"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <div className="profile-form-group full-width">
            <label className="profile-field-label">Ringkasan Profil / Bio Singkat</label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="profile-textarea-input"
              placeholder="Ceritakan latar belakang profesional dan keahlian utama Anda..."
            />
          </div>
        </div>

        <div className="profile-form-actions">
          <button type="submit" className="btn-save-profile">
            <Save size={16} />
            <span>Simpan Perubahan Profil</span>
          </button>
        </div>
      </form>
    </div>
  );
}
