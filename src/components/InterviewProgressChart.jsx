import React, { useState, useMemo } from 'react';
import { Activity, Calendar, Briefcase } from 'lucide-react';
import './InterviewProgressChart.css';

export default function InterviewProgressChart({ history = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Urutkan riwayat dari yang terlama ke yang terbaru (kronologis kiri ke kanan)
  const chartData = useMemo(() => {
    if (!Array.isArray(history) || history.length === 0) return [];
    const valid = history.filter(item => item && typeof item === 'object');
    // Ambil maksimal 10 sesi terakhir secara kronologis
    return [...valid].reverse().slice(-10).map((item, idx) => ({
      sessionNumber: idx + 1,
      id: item.id || `session_${idx}`,
      position: item.position || item.title || 'Simulasi Wawancara',
      score: Number(item.score) || 0,
      date: item.formattedDate || item.date || 'Sesi ini',
      status: item.status || (Number(item.score) >= 80 ? 'Sangat Direkomendasikan' : Number(item.score) >= 65 ? 'Direkomendasikan' : 'Perlu Latihan')
    }));
  }, [history]);

  // Hitung metrik ringkasan
  const metrics = useMemo(() => {
    if (chartData.length === 0) {
      return { maxScore: 0, latestScore: 0, avgScore: 0, trendDiff: 0 };
    }
    const scores = chartData.map(d => d.score);
    const maxScore = Math.max(...scores);
    const latestScore = scores[scores.length - 1];
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const trendDiff = scores.length > 1 ? latestScore - scores[scores.length - 2] : 0;

    return { maxScore, latestScore, avgScore, trendDiff };
  }, [chartData]);

  // Dimensi SVG
  const svgWidth = 760;
  const svgHeight = 220;
  const paddingLeft = 50;
  const paddingRight = 35;
  const paddingTop = 25;
  const paddingBottom = 40;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;
  const plotBottom = svgHeight - paddingBottom;

  // Koordinat titik data
  const points = useMemo(() => {
    if (chartData.length === 0) return [];
    if (chartData.length === 1) {
      const x = paddingLeft + (plotWidth / 2);
      const y = plotBottom - ((chartData[0].score / 100) * plotHeight);
      return [{ ...chartData[0], x, y }];
    }

    return chartData.map((d, idx) => {
      const x = paddingLeft + (idx * (plotWidth / (chartData.length - 1)));
      const y = plotBottom - ((d.score / 100) * plotHeight);
      return { ...d, x, y };
    });
  }, [chartData, plotWidth, plotHeight, plotBottom, paddingLeft]);

  // Pembuat garis lengkung halus (Cubic Bezier Spline)
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i !== points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }, [points]);

  // Area Path (di bawah garis lengkung untuk efek gradasi glowing)
  const areaPath = useMemo(() => {
    if (points.length < 2) return '';
    const firstX = points[0].x.toFixed(1);
    const lastX = points[points.length - 1].x.toFixed(1);
    return `${linePath} L ${lastX} ${plotBottom} L ${firstX} ${plotBottom} Z`;
  }, [linePath, points, plotBottom]);

  const gridLevels = [100, 75, 50, 25, 0];

  return (
    <div className="interview-chart-card">
      <div className="chart-header">
        <div className="chart-title-group">
          <div className="chart-icon-circle">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="chart-heading">Grafik Perkembangan Skor Interview</h3>
            <p className="chart-subheading">
              Visualisasi tren peningkatan nilai dari sesi ke sesi secara kronologis
            </p>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="chart-metrics-row">
            <div className="chart-metric-pill pill-max">
              <span className="metric-label">Tertinggi</span>
              <span className="metric-val">{metrics.maxScore}</span>
            </div>
            <div className="chart-metric-pill pill-avg">
              <span className="metric-label">Rata-rata</span>
              <span className="metric-val">{metrics.avgScore}</span>
            </div>
            <div className="chart-metric-pill pill-latest">
              <span className="metric-label">Terakhir</span>
              <span className="metric-val">{metrics.latestScore}</span>
            </div>
          </div>
        )}
      </div>

      <div className="chart-svg-container">
        {chartData.length === 0 ? (
          <div className="chart-empty-state">
            <Activity size={32} className="empty-chart-icon" />
            <h4>Belum Ada Data Grafik Perkembangan</h4>
            <p>Selesaikan sesi simulasi interview untuk memantau grafik kenaikan skor performa Anda di sini.</p>
          </div>
        ) : (
          <div className="chart-interactive-wrapper">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="chart-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Gradien Area Grafik */}
                <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>

                {/* Gradien Garis Kurva */}
                <linearGradient id="scoreLineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>

                {/* Filter Glow pada Garis */}
                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Garis Grid Horizontal & Label Sumbu Y */}
              {gridLevels.map((lvl) => {
                const yPos = plotBottom - ((lvl / 100) * plotHeight);
                return (
                  <g key={lvl} className="grid-line-group">
                    <line
                      x1={paddingLeft}
                      y1={yPos}
                      x2={svgWidth - paddingRight}
                      y2={yPos}
                      className="chart-grid-line"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={yPos + 3.5}
                      className="chart-y-label"
                    >
                      {lvl}
                    </text>
                  </g>
                );
              })}

              {/* Garis Target Ideal 75 */}
              <line
                x1={paddingLeft}
                y1={plotBottom - (0.75 * plotHeight)}
                x2={svgWidth - paddingRight}
                y2={plotBottom - (0.75 * plotHeight)}
                className="chart-target-line"
              />

              {/* Area Fill Gradient (Hanya jika data > 1) */}
              {points.length > 1 && (
                <path d={areaPath} fill="url(#scoreAreaGradient)" />
              )}

              {/* Garis Kurva Utama */}
              {points.length > 1 && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#scoreLineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#lineGlow)"
                  className="chart-main-path"
                />
              )}

              {/* Titik Data Poin Interaktif */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPoint?.id === pt.id;
                const isLatest = idx === points.length - 1;
                let dotFillColor = "#3b82f6";
                if (pt.score >= 80) dotFillColor = "#10b981";
                else if (pt.score < 50) dotFillColor = "#ef4444";

                return (
                  <g
                    key={pt.id || idx}
                    className="chart-point-group"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => setHoveredPoint(pt)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Ring luar jika titik aktif atau terbaru */}
                    {(isLatest || isHovered) && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 11 : 8.5}
                        fill={dotFillColor}
                        opacity={isHovered ? 0.35 : 0.22}
                        className={isLatest ? "pulse-circle" : ""}
                      />
                    )}

                    {/* Titik Utama */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6.5 : 5}
                      fill={dotFillColor}
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="chart-data-dot"
                    />

                    {/* Angka Skor di Atas Titik */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      className={`chart-score-text ${isHovered ? 'hovered-score' : ''}`}
                    >
                      {pt.score}
                    </text>

                    {/* Label Sumbu X di Bawah (Nomor Sesi) */}
                    <text
                      x={pt.x}
                      y={plotBottom + 18}
                      className="chart-x-label"
                    >
                      Sesi {pt.sessionNumber}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip Mengambang Interaktif Saat Titik Disorot */}
            {hoveredPoint && (
              <div
                className="chart-floating-tooltip"
                style={{
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                  top: `${Math.max(10, (hoveredPoint.y / svgHeight) * 100 - 32)}%`
                }}
              >
                <div className="tooltip-header">
                  <span className="tooltip-session">Sesi #{hoveredPoint.sessionNumber}</span>
                  <span className={`tooltip-badge ${hoveredPoint.score >= 80 ? 'badge-high' : hoveredPoint.score >= 65 ? 'badge-mid' : 'badge-low'}`}>
                    {hoveredPoint.score} / 100
                  </span>
                </div>
                <div className="tooltip-body">
                  <div className="tooltip-row">
                    <Briefcase size={12} />
                    <span>{hoveredPoint.position}</span>
                  </div>
                  <div className="tooltip-row">
                    <Calendar size={12} />
                    <span>{hoveredPoint.date}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
