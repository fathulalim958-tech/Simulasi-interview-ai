import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  RotateCcw, 
  Award,
  LayoutDashboard,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  User,
  Bot,
  FileDown,
  FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';
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
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const { 
    score = 0, 
    overallSummary = '',
    strengths = [], 
    weaknesses = [], 
    recommendations = [] 
  } = finalResult || {};

  const numScore = Number(score) || 0;

  // Tentukan predikat evaluasi
  let verdictBadge = "Perlu Pengembangan";
  let badgeClass = "badge-needs-improvement";
  let verdictHeadline = "Masih Ada Ruang Peningkatan";
  let verdictSubtext = "Kandidat memiliki potensi dasar namun perlu memperdalam pemahaman dan artikulasi dalam menjawab.";

  if (numScore >= 80) {
    verdictBadge = "Sangat Direkomendasikan";
    badgeClass = "badge-excellent";
    verdictHeadline = "Performa Wawancara Unggul";
    verdictSubtext = "Kandidat menunjukkan penguasaan materi yang matang, komunikasi terstruktur, dan kesiapan kerja yang sangat kuat.";
  } else if (numScore >= 65) {
    verdictBadge = "Direkomendasikan Bersyarat";
    badgeClass = "badge-good";
    verdictHeadline = "Kandidat Kompeten & Siap Kerja";
    verdictSubtext = "Kandidat mampu menjawab sebagian besar tantangan dengan baik dan memiliki fondasi yang cukup solid.";
  }

  // Kesimpulan keseluruhan yang komprehensif (dari AI atau fallback analitis cerdas)
  const effectiveSummary = overallSummary?.trim() || (() => {
    const candidateName = userData?.name || 'Kandidat';
    const position = userData?.position || 'posisi yang dilamar';
    if (numScore >= 80) {
      return `Secara keseluruhan, ${candidateName} menampilkan performa wawancara yang sangat matang dan unggul untuk posisi ${position}. Kandidat mampu mengartikulasikan keahlian inti, memberikan pendekatan pemecahan masalah yang sistematis, serta memiliki motivasi dan pemahaman budaya kerja yang kuat. Kandidat sangat direkomendasikan untuk tahap selanjutnya.`;
    } else if (numScore >= 65) {
      return `Secara keseluruhan, ${candidateName} memiliki dasar kompetensi yang cukup solid dan kesiapan kerja yang baik pada posisi ${position}. Penyampaian jawaban sudah cukup jelas, dengan ruang peningkatan pada pendalaman contoh kasus konkret dan penyusunan strategi terukur. Kandidat memiliki potensi berkembang pesat dengan arahan yang tepat.`;
    } else {
      return `Berdasarkan evaluasi wawancara, ${candidateName} masih memerlukan latihan terarah dan pendalaman materi untuk posisi ${position}. Pemaparan jawaban masih cenderung umum dan perlu diperkuat dengan metode komunikasi terstruktur (seperti teknik STAR) serta pembuktian keahlian praktis agar lebih meyakinkan pewawancara.`;
    }
  })();

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
      return false;
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

  // =========================================================================
  // FUNGSI SIMPAN PDF RESMI: DESAIN PROFESIONAL, SKOR & TRANSKRIP LENGKAP
  // =========================================================================
  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);

      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 14;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      const candidateName = userData?.name || 'Kandidat';
      const position = userData?.position || 'Pelamar Kerja';
      const experience = userData?.experience || 'Fresh Graduate / Umum';

      const dateStr = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date());

      // Helper Auto Page Break yang rapi
      const checkPageBreak = (neededHeight) => {
        if (y + neededHeight > pageHeight - margin - 15) {
          doc.addPage();
          y = margin + 8;
          // Running header pada halaman lanjutan
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text('DEVINTERVIEW AI HRD • LAPORAN EVALUASI RESMI', margin, y - 3);
          doc.setFont('helvetica', 'normal');
          doc.text(`${candidateName} — ${position}`, pageWidth - margin - 65, y - 3);
          doc.setDrawColor(226, 232, 240);
          doc.line(margin, y - 1, pageWidth - margin, y - 1);
        }
      };

      // 1. Top Decorative Brand Banner
      doc.setFillColor(15, 23, 42); // Navy 900
      doc.rect(0, 0, pageWidth, 6, 'F');
      doc.setFillColor(59, 130, 246); // Electric Blue accent
      doc.rect(0, 6, pageWidth, 1.5, 'F');
      y += 7;

      // 2. Title & Kop Dokumen Resmi
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42);
      doc.text('DEVINTERVIEW AI ASSESSMENT PLATFORM', margin, y + 2);

      y += 6.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('LAPORAN RESMI HASIL EVALUASI KOMPETENSI & TRANSKRIP LENGKAP WAWANCARA KERJA', margin, y);

      y += 4;
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      // 3. Candidate Summary Card (Grid Rapi)
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

      // Col 1: Nama & Posisi
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('NAMA KANDIDAT', margin + 4, y + 5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(candidateName, margin + 4, y + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('POSISI DILAMAR', margin + 4, y + 16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(37, 99, 235);
      doc.text(position, margin + 4, y + 20.5);

      // Col 2: Pewawancara & Pengalaman
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('PEWAWANCARA AI', margin + 68, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Elon Musk (Lead Interviewer)', margin + 68, y + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('RINGKASAN PENGALAMAN', margin + 68, y + 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      const expSplit = doc.splitTextToSize(experience, 55);
      doc.text(expSplit[0] || experience, margin + 68, y + 20.5);

      // Col 3: Tanggal & Status
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('TANGGAL WAWANCARA', margin + 132, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(`${dateStr} WIB`, margin + 132, y + 10);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('STATUS SESI', margin + 132, y + 16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(16, 185, 129);
      doc.text(`Selesai (${totalQuestions} Pertanyaan)`, margin + 132, y + 20.5);

      y += 27;

      // 4. Executive Scorecard
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

      // Theme warna skor
      let scoreTheme = {
        badgeBg: [16, 185, 129],
        pillBg: [240, 253, 244],
        pillBorder: [187, 247, 208],
        pillText: [21, 128, 61]
      };
      if (numScore < 65) {
        scoreTheme = {
          badgeBg: [225, 29, 72],
          pillBg: [255, 241, 242],
          pillBorder: [254, 205, 211],
          pillText: [159, 18, 57]
        };
      } else if (numScore < 80) {
        scoreTheme = {
          badgeBg: [79, 70, 229],
          pillBg: [238, 242, 255],
          pillBorder: [199, 210, 254],
          pillText: [67, 56, 202]
        };
      }

      // Left Score Badge
      const scoreBadgeW = 34;
      doc.setFillColor(scoreTheme.badgeBg[0], scoreTheme.badgeBg[1], scoreTheme.badgeBg[2]);
      doc.roundedRect(margin + 3, y + 3, scoreBadgeW, 18, 2, 2, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text(`${numScore}`, margin + 7, y + 12);
      doc.setFontSize(8.5);
      doc.text('/ 100 POIN', margin + 18, y + 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('TOTAL SKOR EVALUASI', margin + 6, y + 17);

      // Right Verdict Pill & Headline
      doc.setFillColor(scoreTheme.pillBg[0], scoreTheme.pillBg[1], scoreTheme.pillBg[2]);
      doc.setDrawColor(scoreTheme.pillBorder[0], scoreTheme.pillBorder[1], scoreTheme.pillBorder[2]);
      doc.roundedRect(margin + scoreBadgeW + 7, y + 3.5, 54, 5.5, 1, 1, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(scoreTheme.pillText[0], scoreTheme.pillText[1], scoreTheme.pillText[2]);
      doc.text(verdictBadge.toUpperCase(), margin + scoreBadgeW + 9, y + 7.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(verdictHeadline, margin + scoreBadgeW + 7, y + 13.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const subSplit = doc.splitTextToSize(verdictSubtext, contentWidth - scoreBadgeW - 12);
      doc.text(subSplit, margin + scoreBadgeW + 7, y + 18);

      y += 28;

      // 5. Kesimpulan Keseluruhan Hasil Wawancara (Executive Summary)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const splitSummary = doc.splitTextToSize(effectiveSummary, contentWidth - 12);
      const summaryBoxHeight = 8 + (splitSummary.length * 3.8) + 5;
      checkPageBreak(summaryBoxHeight + 3);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, summaryBoxHeight, 1.5, 1.5, 'FD');

      doc.setFillColor(59, 130, 246);
      doc.roundedRect(margin, y, 2.5, summaryBoxHeight, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text('KESIMPULAN KESELURUHAN HASIL INTERVIEW (EXECUTIVE SUMMARY)', margin + 6, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(splitSummary, margin + 6, y + 9.5);

      y += summaryBoxHeight + 3.5;

      // 6. Kartu Analisis Kompetensi (3 Accent Cards)
      const renderCompetencyCard = (title, items, theme, defaultItem) => {
        const lineSpacing = 3.8;
        const paddingY = 3.5;
        const listToRender = items && items.length > 0 ? items : [defaultItem];

        let totalTextLines = 0;
        const processedItems = listToRender.map(item => {
          const lines = doc.splitTextToSize('•  ' + item, contentWidth - 12);
          totalTextLines += lines.length;
          return lines;
        });

        const cardHeight = 8 + (totalTextLines * lineSpacing) + (listToRender.length * 1.5) + (paddingY * 2);
        checkPageBreak(cardHeight + 2);

        // Card Background
        doc.setFillColor(theme.bg[0], theme.bg[1], theme.bg[2]);
        doc.setDrawColor(theme.border[0], theme.border[1], theme.border[2]);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'FD');

        // Left Accent Bar
        doc.setFillColor(theme.accent[0], theme.accent[1], theme.accent[2]);
        doc.roundedRect(margin, y, 2.5, cardHeight, 1, 1, 'F');

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(theme.title[0], theme.title[1], theme.title[2]);
        doc.text(title, margin + 6, y + 5);

        // Bullets
        let curY = y + 9.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);

        processedItems.forEach(lines => {
          doc.text(lines, margin + 6, curY);
          curY += (lines.length * lineSpacing) + 1.2;
        });

        y += cardHeight + 3.5;
      };

      renderCompetencyCard(
        'KELEBIHAN & KEKUATAN UTAMA (KEY STRENGTHS)',
        strengths,
        {
          bg: [240, 253, 244],
          border: [187, 247, 208],
          accent: [16, 185, 129],
          title: [21, 128, 61]
        },
        'Respons positif pada perkenalan diri dan motivasi kerja yang baik.'
      );

      renderCompetencyCard(
        'AREA PENINGKATAN & PENGEMBANGAN (AREAS FOR IMPROVEMENT)',
        weaknesses,
        {
          bg: [255, 241, 242],
          border: [254, 205, 211],
          accent: [244, 63, 94],
          title: [159, 18, 57]
        },
        'Dapat memperjelas detail teknis dan langkah implementasi nyata saat menjawab.'
      );

      renderCompetencyCard(
        'REKOMENDASI KARIR & PENGEMBANGAN STRATEGIS (RECOMMENDATIONS)',
        recommendations,
        {
          bg: [255, 251, 235],
          border: [254, 243, 199],
          accent: [245, 158, 11],
          title: [146, 64, 14]
        },
        'Terapkan metode STAR (Situation, Task, Action, Result) secara terstruktur pada setiap studi kasus.'
      );

      // 6. Transkrip Lengkap Percakapan Wawancara
      checkPageBreak(30);
      y += 2;
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5.5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text('TRANSKRIP LENGKAP SEMUA PERCAKAPAN WAWANCARA', margin, y);

      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Rekaman kronologis dialog tanya jawab antara Elon Musk (Lead Interviewer) dan ${candidateName}:`, margin, y);
      y += 6;

      let qCount = 0;
      let aCount = 0;

      if (validChat.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Tidak ada rekaman percakapan yang tersimpan pada sesi ini.', margin, y);
        y += 8;
      } else {
        validChat.forEach((item) => {
          const isAI = item.sender === 'assistant';
          if (isAI) qCount++;
          else aCount++;

          const senderBadge = isAI
            ? `PERTANYAAN #${qCount} • ELON MUSK (LEAD INTERVIEWER)`
            : `JAWABAN #${aCount} • ${candidateName.toUpperCase()} (KANDIDAT)`;

          const cleanText = cleanMessage(item.message);
          const splitMsg = doc.splitTextToSize(cleanText, contentWidth - 10);
          const blockHeight = 7 + (splitMsg.length * 3.8) + 4;

          checkPageBreak(blockHeight + 3);

          if (isAI) {
            // Box AI: Light Slate + Blue Accent
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(margin, y, contentWidth, blockHeight, 1.5, 1.5, 'FD');
            doc.setFillColor(59, 130, 246);
            doc.roundedRect(margin, y, 2.5, blockHeight, 1, 1, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(37, 99, 235);
            doc.text(senderBadge, margin + 5, y + 4.5);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(30, 41, 59);
            doc.text(splitMsg, margin + 5, y + 9);
            y += blockHeight + 2.5;
          } else {
            // Box User: Light Mint + Green Accent
            doc.setFillColor(240, 253, 244);
            doc.setDrawColor(187, 247, 208);
            doc.roundedRect(margin, y, contentWidth, blockHeight, 1.5, 1.5, 'FD');
            doc.setFillColor(16, 185, 129);
            doc.roundedRect(margin, y, 2.5, blockHeight, 1, 1, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(21, 128, 61);
            doc.text(senderBadge, margin + 5, y + 4.5);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(30, 41, 59);
            doc.text(splitMsg, margin + 5, y + 9);
            y += blockHeight + 3;
          }
        });
      }

      // 7. Footer Resmi & Penomoran Halaman di Setiap Lembar
      const totalPages = doc.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, 287, pageWidth - margin, 287);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text('DevInterview AI HRD Platform • Dokumen Resmi Hasil Wawancara Kerja (Confidential)', margin, 291);
        doc.text(`Halaman ${p} dari ${totalPages}`, pageWidth - margin - 22, 291);
      }

      // 8. Unduh Berkas PDF
      const safeName = candidateName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const safePos = position.replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`Laporan-Interview-${safeName}-${safePos}.pdf`);
    } catch (error) {
      console.error("Gagal membuat file PDF:", error);
      alert("Terjadi kendala teknis saat memproses berkas PDF. Silakan coba kembali.");
    } finally {
      setIsExportingPdf(false);
    }
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
              <span className="evaluator-role">Lead Evaluator</span>
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

        {/* Kesimpulan Keseluruhan Hasil Wawancara */}
        <div className="overall-summary-card">
          <div className="overall-summary-header">
            <div className="summary-icon-box">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="overall-summary-title">Kesimpulan Keseluruhan Hasil Wawancara</h3>
              <span className="overall-summary-subtitle">Ringkasan Evaluasi Menyeluruh oleh Elon Musk</span>
            </div>
          </div>
          <p className="overall-summary-text">{effectiveSummary}</p>
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
            REKAP TRANSKRIP PERCAKAPAN WAWANCARA LENGKAP
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

        {/* Action Buttons: Bersih & Terfokus */}
        <div className="result-actions">
          {onBackToDashboard && (
            <button onClick={onBackToDashboard} className="action-btn-secondary">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          )}

          <button onClick={onRestart} className="primary-restart-btn">
            <RotateCcw size={18} />
            <span>Mulai Wawancara Baru</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="btn-download-pdf"
            disabled={isExportingPdf}
            title="Download Dokumen Laporan Lengkap PDF"
          >
            <FileDown size={18} />
            <span>{isExportingPdf ? "Membuat PDF..." : "Simpan PDF Lengkap"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
