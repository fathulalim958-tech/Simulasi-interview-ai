import React from 'react';
import { History, Award, ArrowRight, Clock, Trash2, PlayCircle } from 'lucide-react';

export default function InterviewHistory({ 
  history = [], 
  onViewResult, 
  onStartInterview,
  onDeleteHistory,
  onClearAll,
  showAll = false
}) {
  const formatDuration = (seconds = 180) => {
    const s = Number(seconds) || 180;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}d`;
  };

  const safeList = Array.isArray(history) ? history : [];
  const displayedHistory = showAll ? safeList : safeList.slice(0, 5);

  const handleDeleteItem = (e, item) => {
    e.stopPropagation();
    const pos = item?.position || item?.title || 'Sesi';
    if (window.confirm(`Hapus riwayat sesi ${pos}?`)) {
      onDeleteHistory?.(item?.id);
    }
  };

  const handleClearAllItems = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat interview? Data yang dihapus tidak dapat dipulihkan.")) {
      onClearAll?.();
    }
  };

  const handleView = (item) => {
    if (item?.finalResult && onViewResult) {
      onViewResult(item);
    } else if (onStartInterview) {
      onStartInterview();
    }
  };

  return (
    <div className="dashboard-section-card interview-history-card">
      <div className="section-card-header">
        <div className="header-title-flex">
          <History size={20} className="section-title-icon icon-purple" />
          <div>
            <h2 className="section-heading">
              {showAll ? "Semua Riwayat Interview" : "Riwayat Interview Terakhir"}
            </h2>
            <p className="section-subheading">Catatan dan rekam jejak hasil simulasi evaluasi AI Anda.</p>
          </div>
        </div>

        <div className="history-header-actions">
          {displayedHistory.length > 0 && onClearAll && (
            <button 
              className="btn-clear-history" 
              onClick={handleClearAllItems}
              title="Hapus Seluruh Riwayat"
            >
              <Trash2 size={14} />
              <span>Hapus Semua</span>
            </button>
          )}

          {onStartInterview && (
            <button className="view-all-link-btn" onClick={onStartInterview} title="Mulai Sesi Wawancara Baru">
              <PlayCircle size={14} />
              <span>+ Wawancara Baru</span>
            </button>
          )}
        </div>
      </div>

      {displayedHistory.length === 0 ? (
        <div className="history-empty-state">
          <div className="empty-state-icon-circle">
            <History size={32} />
          </div>
          <h3 className="empty-state-title">tidak ada riwayat interview</h3>
          <p className="empty-state-desc">
            Belum ada rekam jejak simulasi wawancara yang tersimpan. Mulai wawancara baru untuk melihat riwayat dan hasil evaluasi AI di sini.
          </p>
          {onStartInterview && (
            <button className="empty-state-action-btn" onClick={onStartInterview}>
              <PlayCircle size={16} />
              <span>Mulai Wawancara Baru</span>
            </button>
          )}
        </div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Posisi Pekerjaan</th>
                <th>Tanggal</th>
                <th>Durasi</th>
                <th>Skor</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedHistory.map((item, idx) => {
                const score = Number(item?.score) || 0;
                let scoreBadgeClass = "badge-score-low";
                if (score >= 80) scoreBadgeClass = "badge-score-high";
                else if (score >= 65) scoreBadgeClass = "badge-score-mid";

                const itemId = item?.id || `item_${idx}`;
                const pos = item?.position || item?.title || 'Simulasi Interview';
                const name = item?.candidateName || 'budi';
                const dateText = item?.formattedDate || item?.date || 'Baru saja';
                const statusText = item?.status || (score >= 80 ? 'Sangat Direkomendasikan' : score >= 65 ? 'Direkomendasikan' : 'Perlu Latihan');

                return (
                  <tr key={itemId} className="history-row">
                    <td>
                      <div className="position-cell">
                        <span className="position-name">{pos}</span>
                        <span className="candidate-subname">{name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="date-cell-text">{dateText}</span>
                    </td>
                    <td>
                      <span className="duration-pill">
                        <Clock size={12} />
                        {formatDuration(item?.durationSeconds)}
                      </span>
                    </td>
                    <td>
                      <div className={`score-pill ${scoreBadgeClass}`}>
                        <Award size={13} />
                        <span>{score} / 100</span>
                      </div>
                    </td>
                    <td>
                      <span className="status-tag-cell">{statusText}</span>
                    </td>
                    <td className="text-right">
                      <div className="history-row-actions">
                        <button 
                          className="btn-view-result"
                          onClick={() => handleView(item)}
                          title="Buka Halaman Evaluasi Lengkap"
                        >
                          <span>Lihat Hasil</span>
                          <ArrowRight size={14} />
                        </button>
                        {onDeleteHistory && (
                          <button 
                            className="btn-delete-row"
                            onClick={(e) => handleDeleteItem(e, item)}
                            title="Hapus Riwayat Sesi Ini"
                            aria-label="Hapus Riwayat"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
