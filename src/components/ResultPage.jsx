import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  RotateCcw, 
  Printer, 
  Award,
  LayoutDashboard,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  User,
  Bot
} from 'lucide-react';
import './ResultPage.css';

export default function ResultPage({ 
  finalResult, 
  onRestart, 
  onBackToDashboard, 
  userData,
  chatHistory = []
}) {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const { 
    score = 0, 
    strengths = [], 
    weaknesses = [], 
    recommendations = [] 
  } = finalResult || {};

  const numScore = Number(score) || 0;

  // Tentukan predikat evaluasi
  let verdictBadge = "Perlu Pengembangan";
  let badgeClass = "badge-needs-improvement";
  let verdictHeadline = "Masih Ada Ruang Peningkatan";
  let verdictSubtext = "Kandidat memiliki potensi dasar namun perlu memperdalam pemahaman teknis dan artikulasi dalam menjawab.";

  if (numScore >= 80) {
    verdictBadge = "Sangat Direkomendasikan";
    badgeClass = "badge-excellent";
    verdictHeadline = "Performa Wawancara Unggul";
    verdictSubtext = "Kandidat menunjukkan penguasaan materi yang matang, komunikasi terstruktur, dan pemahaman industri yang kuat.";
  } else if (numScore >= 65) {
    verdictBadge = "Direkomendasikan Bersyarat";
    badgeClass = "badge-good";
    verdictHeadline = "Kandidat Kompeten & Siap Kerja";
    verdictSubtext = "Kandidat mampu menjawab sebagian besar tantangan dengan baik dan memiliki fondasi yang cukup solid.";
  }

  // Helper untuk membersihkan format markdown dan meta tag
  const cleanMessage = (text) => {
    if (!text) return '';
    return text
      .replace(/[*#_~`>]/g, '')
      .replace(/\{[\s\S]*\}/g, '')
      .replace(/^\s*(?:pertanyaan|soal|nomor|no)?\s*\d+[.:)-]?\s*/i, '')
      .replace(/^\s*pertanyaan\s*(?:ke-?\d+|pertama|kedua|ketiga|keempat|kelima|keenam|ketujuh)[.:)]?\s*/i, '')
      .replace(/\s*\([^)]*(?:waiting|menunggu|response|respon|final|terakhir|question|pertanyaan|catatan|note)[^)]*\)/gi, '')
      .replace(/\s*\[[^\]]*(?:waiting|menunggu|response|respon|final|terakhir|question|pertanyaan|catatan|note)[^\]]*\]/gi, '')
      .trim();
  };

  // Filter riwayat percakapan yang valid (bukan JSON evaluasi mentah)
  const validChat = (Array.isArray(chatHistory) ? chatHistory : []).filter(item => {
    if (!item || !item.message) return false;
    const trimmed = item.message.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}') && trimmed.includes('finalResult')) {
      return false; // Jangan tampilkan JSON evaluasi di daftar percakapan
    }
    return cleanMessage(item.message).length > 0;
  });

  const totalQuestions = validChat.filter(c => c.sender === 'assistant').length;
  const totalAnswers = validChat.filter(c => c.sender === 'user').length;

  // Fungsi salin seluruh teks transkrip percakapan ke clipboard
  const handleCopyTranscript = () => {
    if (validChat.length === 0) return;

    const transcriptText = validChat.map((item) => {
      const sender = item.sender === 'assistant' ? 'Elon Musk (Interviewer)' : (userData?.name || 'Kandidat');
      return `[${sender}]\n${cleanMessage(item.message)}\n`;
    }).join('\n');

    const fullExport = `=== TRANSKRIP WAWANCARA: ${userData?.name || 'Kandidat'} (${userData?.position || 'Posisi'}) ===\n` +
      `Skor Evaluasi: ${numScore}/100 - ${verdictBadge}\n\n` +
      transcriptText;

    navigator.clipboard.writeText(fullExport).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
      console.warn("Gagal menyalin transkrip:", err);
    });
  };

  return (
    <div className="result-container">
      <div className="result-card-wrapper">
        {/* Header Hasil Evaluasi */}
        <header className="result-header">
          <div className="result-title-group">
            <h1>Hasil Evaluasi Wawancara</h1>
            <p>
              Kandidat: <strong>{userData?.name || 'Kandidat'}</strong> • Posisi: <strong>{userData?.position || 'Pelamar Kerja'}</strong>
            </p>
          </div>

          <div className="evaluator-tag">
            <div className="evaluator-avatar evaluator-avatar-initials">
              EM
            </div>
            <div className="evaluator-info">
              <span className="evaluator-name">Elon Musk</span>
              <span className="evaluator-role">Lead Evaluator • Executive</span>
            </div>
          </div>
        </header>

        {/* Skor Overview Section */}
        <div className="score-overview-section">
          <div className="score-radial-box">
            <span className="score-number">{numScore}</span>
            <span className="score-scale">/ 100 POIN</span>
          </div>

          <div className="score-verdict-box">
            <span className={`score-badge ${badgeClass}`}>
              <Award size={14} />
              {verdictBadge}
            </span>
            <h2 className="score-headline">{verdictHeadline}</h2>
            <p className="score-subtext">{verdictSubtext}</p>
          </div>
        </div>

        {/* Analysis Cards Grid */}
        <div className="analysis-cards-grid">
          {/* Kelebihan */}
          <div className="analysis-card">
            <div className="analysis-card-header header-green">
              <CheckCircle2 size={19} />
              <span>Kelebihan & Kekuatan (Strengths)</span>
            </div>
            <ul className="eval-list">
              {strengths.length > 0 ? (
                strengths.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>Respons positif pada pengenalan diri dan etos kerja.</li>
              )}
            </ul>
          </div>

          {/* Area Peningkatan */}
          <div className="analysis-card">
            <div className="analysis-card-header header-red">
              <AlertCircle size={19} />
              <span>Area Peningkatan (Weaknesses)</span>
            </div>
            <ul className="eval-list">
              {weaknesses.length > 0 ? (
                weaknesses.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>Dapat memperjelas detail implementasi teknis pada proyek sebelumnya.</li>
              )}
            </ul>
          </div>

          {/* Rekomendasi Karir */}
          <div className="analysis-card full-width">
            <div className="analysis-card-header header-gold">
              <Lightbulb size={19} />
              <span>Rekomendasi Pengembangan (Recommendations)</span>
            </div>
            <ul className="eval-list">
              {recommendations.length > 0 ? (
                recommendations.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>Latih teknik STAR (Situation, Task, Action, Result) untuk menyusun jawaban yang lebih komprehensif.</li>
              )}
            </ul>
          </div>
        </div>

        {/* =========================================================================
            FITUR BARU: REKAP TRANSKRIP PERCAKAPAN WAWANCARA (HASIL DI-RECORD)
           ========================================================================= */}
        <section className="transcript-section">
          <div className="transcript-header">
            <div className="transcript-title-wrapper">
              <div className="transcript-icon-circle">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="transcript-title">Rekaman Transkrip Percakapan</h3>
                <p className="transcript-subtitle">
                  {validChat.length > 0 
                    ? `${totalQuestions} Pertanyaan diajukan • ${totalAnswers} Jawaban kandidat tercatat`
                    : "Tidak ada dialog tersimpan"}
                </p>
              </div>
            </div>

            <div className="transcript-actions">
              {validChat.length > 0 && (
                <button 
                  type="button"
                  className="btn-copy-transcript"
                  onClick={handleCopyTranscript}
                  title="Salin Seluruh Percakapan ke Clipboard"
                >
                  {isCopied ? <Check size={14} className="icon-success" /> : <Copy size={14} />}
                  <span>{isCopied ? "Tersalin!" : "Salin Dialog"}</span>
                </button>
              )}

              <button 
                type="button"
                className="btn-toggle-transcript"
                onClick={() => setIsTranscriptOpen(prev => !prev)}
                title={isTranscriptOpen ? "Sembunyikan Percakapan" : "Buka Percakapan"}
              >
                <span>{isTranscriptOpen ? "Tutup" : "Lihat Dialog"}</span>
                {isTranscriptOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {isTranscriptOpen && (
            <div className="transcript-body">
              {validChat.length === 0 ? (
                <div className="transcript-empty">
                  <p>Tidak ada rekaman percakapan yang tersimpan pada sesi ini.</p>
                </div>
              ) : (
                <div className="transcript-bubbles-list">
                  {validChat.map((item, index) => {
                    const isAI = item.sender === 'assistant';
                    return (
                      <div 
                        key={index} 
                        className={`transcript-row ${isAI ? 'row-ai' : 'row-user'}`}
                      >
                        <div className="transcript-avatar-badge">
                          {isAI ? (
                            <div className="avatar-chip ai-chip" title="Elon Musk (Interviewer)">
                              <Bot size={13} />
                              <span>Elon Musk</span>
                            </div>
                          ) : (
                            <div className="avatar-chip user-chip" title={userData?.name || 'Kandidat'}>
                              <span>{userData?.name || 'Anda'}</span>
                              <User size={13} />
                            </div>
                          )}
                        </div>

                        <div className={`transcript-bubble ${isAI ? 'bubble-ai' : 'bubble-user'}`}>
                          <div className="bubble-message-text">
                            {cleanMessage(item.message)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <div className="result-actions">
          {onBackToDashboard && (
            <button onClick={onBackToDashboard} className="print-report-btn">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          )}

          <button onClick={onRestart} className="primary-restart-btn">
            <RotateCcw size={18} />
            <span>Mulai Wawancara Baru</span>
          </button>

          <button onClick={() => window.print()} className="print-report-btn">
            <Printer size={18} />
            <span>Cetak Evaluasi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
