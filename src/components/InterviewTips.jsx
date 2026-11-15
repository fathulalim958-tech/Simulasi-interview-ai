import React, { useState } from 'react';
import { 
  Lightbulb, 
  UserCheck, 
  MessageSquare, 
  Target, 
  Briefcase, 
  HelpCircle, 
  ArrowRight,
  X,
  CheckCircle2,
  Award
} from 'lucide-react';

const TIPS_DATA = [
  {
    id: 'scoring-criteria',
    icon: Award,
    badge: 'Bobot 100%',
    title: 'Kriteria & Bobot Penilaian Skor',
    subtitle: 'Transparansi Sistem Pembobotan AI (0 - 100 Poin)',
    summary: 'Skor akhir wawancara dihitung secara objektif dari 4 pilar utama: Kompetensi Profesi (35%), Pemecahan Masalah (25%), Struktur Komunikasi (20%), dan Sikap Profesional (20%).',
    criteria: [
      {
        label: 'Kompetensi & Relevansi Profesi',
        weight: 35,
        color: '#3b82f6',
        desc: 'Pemahaman konsep dasar, penguasaan istilah bidang kerja, dan ketepatan solusi sesuai posisi yang dilamar.'
      },
      {
        label: 'Logika & Pemecahan Masalah (Problem Solving)',
        weight: 25,
        color: '#8b5cf6',
        desc: 'Kemampuan menganalisis akar masalah, berpikir kritis (first-principles), dan inisiatif solusi yang realistis.'
      },
      {
        label: 'Struktur Komunikasi & Artikulasi',
        weight: 20,
        color: '#10b981',
        desc: 'Penggunaan metode STAR (Situation, Task, Action, Result), artikulasi jelas, tidak berbelit-belit, dan relevan.'
      },
      {
        label: 'Sikap Profesional, Adaptabilitas & Etika',
        weight: 20,
        color: '#f59e0b',
        desc: 'Kolaborasi tim, penanganan tekanan kerja, komitmen integritas, serta visi kontribusi bagi organisasi.'
      }
    ],
    thresholds: [
      { score: '80 – 100 Poin', status: 'Sangat Direkomendasikan', color: '#10b981', note: 'Jawaban matang, terstruktur, mendalam, dan memiliki pembuktian studi kasus kuat.' },
      { score: '65 – 79 Poin', status: 'Direkomendasikan', color: '#3b82f6', note: 'Kompeten dan cukup solid, dengan sedikit ruang peningkatan pada detail teknis.' },
      { score: '< 65 Poin', status: 'Perlu Latihan', color: '#ef4444', note: 'Jawaban terlalu singkat/umum, kurang relevan, atau sesi diakhiri lebih awal.' }
    ],
    details: [
      'Selesaikan Semua Pertanyaan: Menjawab lengkap seluruh 7 pertanyaan adalah syarat mutlak untuk memperoleh kalkulasi skor 100% komprehensif.',
      'Gunakan Bukti Nyata (Metode STAR): Paparkan pengalaman kerja konkret dengan situasi, tindakan, dan hasil terukur agar skor Kompetensi & Komunikasi optimal.',
      'Ketenangan & Artikulasi: Jeda sejenak 2-3 detik sebelum menjawab membantu merapikan alur berpikir dan mencerminkan kematangan profesional.'
    ]
  },
  {
    id: 'intro',
    icon: UserCheck,
    badge: 'Best Practice',
    title: 'Cara Memperkenalkan Diri dengan Baik',
    subtitle: 'Metode Present - Past - Future (2 Menit Emas)',
    summary: 'Awali dengan peran dan keahlian Anda saat ini, rangkum pengalaman penting masa lalu, lalu tutup dengan alasan melamar posisi ini.',
    details: [
      'Gunakan rumus Present-Past-Future: Jelaskan apa yang Anda kerjakan sekarang, apa prestasi relevan di masa lalu, dan mengapa posisi ini adalah langkah masa depan yang tepat.',
      'Hindari mengulang isi CV kata per kata. Ceritakan nilai tambah dan kepribadian profesional Anda.',
      'Jaga durasi perkenalan diri antara 90 hingga 120 detik agar tetap fokus dan memikat pewawancara.'
    ]
  },
  {
    id: 'answering',
    icon: MessageSquare,
    badge: 'Best Practice',
    title: 'Cara Menjawab Pertanyaan HRD',
    subtitle: 'Artikulasi Jelas, Jujur & Relevan',
    summary: 'Fokus langsung ke inti pertanyaan tanpa berputar-putar, sertakan contoh nyata, dan sesuaikan dengan budaya perusahaan.',
    details: [
      'Dengarkan pertanyaan sampai tuntas sebelum mulai menjawab. Berhenti sejenak 2-3 detik untuk menyusun pemikiran adalah hal yang wajar dan profesional.',
      'Kaitkan jawaban dengan kebutuhan spesifik posisi yang dilamar, bukan hanya sekadar teori.',
      'Gunakan intonasi ramah, percaya diri, dan tatap kamera secara konsisten dalam wawancara video.'
    ]
  },
  {
    id: 'star',
    icon: Target,
    badge: 'Best Practice',
    title: 'Teknik STAR dalam Menjawab Pertanyaan',
    subtitle: 'Situation, Task, Action, Result',
    summary: 'Metode paling teruji untuk menjawab pertanyaan berbasis perilaku (Behavioral Questions) dengan terstruktur dan meyakinkan.',
    details: [
      'Situation: Gambarkan konteks atau tantangan situasi nyata yang Anda hadapi di tempat kerja.',
      'Task: Jelaskan tanggung jawab spesifik apa yang harus Anda selesaikan dalam situasi tersebut.',
      'Action: Uraikan langkah taktis dan keputusan yang Anda ambil secara mandiri maupun kolaboratif.',
      'Result: Paparkan hasil terukur (metrik/persentase) dan pembelajaran berharga yang didapat.'
    ]
  },
  {
    id: 'experience',
    icon: Briefcase,
    badge: 'Best Practice',
    title: 'Cara Menjelaskan Pengalaman Kerja',
    subtitle: 'Fokus pada Kontribusi & Dampak Nyata',
    summary: 'Tekankan dampak solusi yang Anda ciptakan bagi tim atau bisnis, bukan sekadar daftar rutinitas tugas harian.',
    details: [
      'Sebutkan metrik kuantitatif jika memungkinkan (misal: "berhasil mempercepat waktu load 40%" atau "mengurangi bug sebesar 25%").',
      'Ceritakan peran kepemimpinan atau inisiatif proaktif yang pernah Anda ambil saat proyek mengalami kendala.',
      'Hubungkan keahlian lama Anda dengan kontribusi yang siap Anda berikan di perusahaan tujuan.'
    ]
  },
  {
    id: 'difficult',
    icon: HelpCircle,
    badge: 'Best Practice',
    title: 'Tips Menghadapi Pertanyaan Sulit',
    subtitle: 'Ketenangan, Klarifikasi & Pola Pikir Solutif',
    summary: 'Saat menghadapi pertanyaan tak terduga atau kelemahan diri, fokus pada pola pikir solutif dan komitmen berkembang.',
    details: [
      'Jangan panik saat belum mengetahui jawaban pasti. Katakan dengan jujur bagaimana pendekatan Anda dalam mencari solusi.',
      'Untuk pertanyaan seputar kelemahan: pilih kelemahan nyata yang tidak fatal, lalu jelaskan langkah konkret yang sedang Anda ambil untuk memperbaikinya.',
      'Jangan ragu mengajukan pertanyaan klarifikasi jika ada konteks pertanyaan HRD yang belum sepenuhnya Anda pahami.'
    ]
  }
];

export default function InterviewTips() {
  const [selectedTip, setSelectedTip] = useState(null);

  return (
    <div className="dashboard-section-card interview-tips-card">
      <div className="section-card-header">
        <div className="header-title-flex">
          <Lightbulb size={20} className="section-title-icon icon-blue" />
          <div>
            <h2 className="section-heading">Tips & Panduan Wawancara Kerja</h2>
            <p className="section-subheading">Strategi teruji, kriteria skor, dan panduan untuk tampil memukau pewawancara.</p>
          </div>
        </div>
      </div>

      <div className="tips-grid">
        {TIPS_DATA.map((tip) => {
          const Icon = tip.icon;
          const isCriteria = tip.id === 'scoring-criteria';

          return (
            <div
              key={tip.id}
              className={`tip-card ${isCriteria ? 'tip-card-criteria' : ''}`}
            >
              <div className="tip-card-top">
                <div className={`tip-icon-box ${isCriteria ? 'icon-box-gold' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className={`tip-badge ${isCriteria ? 'badge-criteria' : ''}`}>
                  {tip.badge || 'Best Practice'}
                </span>
              </div>

              <h3 className="tip-title">{tip.title}</h3>
              <span className="tip-subtitle">{tip.subtitle}</span>
              <p className="tip-summary">{tip.summary}</p>

              <button 
                className="tip-read-more-btn"
                onClick={() => setSelectedTip(tip)}
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Popup Detail Tips & Kriteria Penilaian */}
      {selectedTip && (
        <div className="tips-modal-backdrop" onClick={() => setSelectedTip(null)}>
          <div className="tips-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="tips-modal-header">
              <div className="modal-title-flex">
                <div className="modal-icon-box">
                  <selectedTip.icon size={22} />
                </div>
                <div>
                  <h3 className="modal-heading">{selectedTip.title}</h3>
                  <span className="modal-subheading">{selectedTip.subtitle}</span>
                </div>
              </div>
              <button 
                className="modal-close-btn"
                onClick={() => setSelectedTip(null)}
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <div className="tips-modal-body">
              <p className="modal-main-desc">{selectedTip.summary}</p>

              {/* Tampilan Visual Rincian Bobot Kriteria (Khusus Kartu Kriteria Penilaian) */}
              {selectedTip.criteria && (
                <div className="modal-criteria-wrapper">
                  <h4 className="modal-section-title">Rincian Pembobotan Nilai (Total 100%):</h4>
                  <div className="criteria-bars-list">
                    {selectedTip.criteria.map((item, idx) => (
                      <div key={idx} className="criteria-bar-item">
                        <div className="criteria-bar-header">
                          <span className="criteria-name">{item.label}</span>
                          <span className="criteria-weight" style={{ color: item.color }}>{item.weight}%</span>
                        </div>
                        <div className="criteria-progress-track">
                          <div
                            className="criteria-progress-fill"
                            style={{ width: `${item.weight * 2.5}%`, backgroundColor: item.color }}
                          />
                        </div>
                        <p className="criteria-desc">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tampilan Standar Rentang Predikat Kelulusan */}
              {selectedTip.thresholds && (
                <div className="modal-thresholds-wrapper" style={{ marginTop: '14px', marginBottom: '14px' }}>
                  <h4 className="modal-section-title">Standar Predikat Kelulusan:</h4>
                  <div className="threshold-grid">
                    {selectedTip.thresholds.map((th, idx) => (
                      <div key={idx} className="threshold-pill-item" style={{ borderLeft: `3px solid ${th.color}` }}>
                        <div className="threshold-header">
                          <span className="threshold-status">{th.status}</span>
                          <span className="threshold-score" style={{ color: th.color }}>{th.score}</span>
                        </div>
                        <div className="threshold-note">{th.note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <h4 className="modal-section-title">Panduan Penting & Implementasi:</h4>
              <ul className="modal-detail-list">
                {selectedTip.details.map((point, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={16} className="point-check-icon" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tips-modal-footer">
              <button 
                className="modal-dismiss-btn"
                onClick={() => setSelectedTip(null)}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
