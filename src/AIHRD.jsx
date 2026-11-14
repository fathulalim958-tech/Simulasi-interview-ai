import React from 'react';
import AIHRD3D from './components/AIHRD3D';
import { CheckCircle2, Mic, BrainCircuit } from 'lucide-react';
import './AIHRD.css';

/**
 * Komponen Visual HRD Elon Musk (Real-Time 3D Model)
 */
export default function AIHRD({ 
  isSpeaking = false, 
  isLoading = false,
  isListening = false,
  status = null 
}) {
  const effectiveStatus = status || (
    isLoading ? 'thinking' :
    isSpeaking ? 'speaking' :
    isListening ? 'listening' :
    'idle'
  );

  return (
    <div className={`ai-hrd-stage status-${effectiveStatus}`}>
      {/* Video Conference Card */}
      <div className={`hrd-video-card card-${effectiveStatus}`}>
        {/* Concentric Audio Wave Rings saat Elon berbicara */}
        {effectiveStatus === 'speaking' && (
          <div className="soundwave-rings-container" aria-hidden="true">
            <div className="soundwave-ring ring-1" />
            <div className="soundwave-ring ring-2" />
            <div className="soundwave-ring ring-3" />
          </div>
        )}

        {/* 3D Model Elon Musk */}
        <div className="ai-hrd-3d-stage">
          <AIHRD3D effectiveStatus={effectiveStatus} />
        </div>

        {/* Top-Left: AI Status & Feedback */}
        <div className="ai-status-badge">
          {effectiveStatus === 'speaking' && (
            <>
              <span className="status-dot dot-speaking" />
              <span>Elon berbicara</span>
              <div className="mini-audio-bars">
                <span className="mini-bar" />
                <span className="mini-bar" />
                <span className="mini-bar" />
                <span className="mini-bar" />
              </div>
            </>
          )}

          {effectiveStatus === 'thinking' && (
            <>
              <span className="status-dot dot-thinking" />
              <BrainCircuit size={13} />
              <span>Elon menganalisis jawaban...</span>
            </>
          )}

          {effectiveStatus === 'listening' && (
            <>
              <span className="status-dot dot-listening" />
              <Mic size={13} />
              <span>Elon menyimak</span>
            </>
          )}

          {effectiveStatus === 'idle' && (
            <>
              <span className="status-dot dot-online" />
              <span>Elon Musk • Siap Wawancara</span>
            </>
          )}
        </div>

        {/* Bottom-Left: Name & Role Card */}
        <div className="ai-name-card">
          <div className="ai-name-details">
            <div className="ai-name-title">
              Elon Musk
              <CheckCircle2 size={14} className="ai-verified-icon" />
            </div>
            <div className="ai-name-subtitle">
              Interviewer
              <span className="ai-company-pill">Executive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
