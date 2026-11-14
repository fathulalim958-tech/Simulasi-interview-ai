import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Root React Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#070a13',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '650px',
            width: '100%'
          }}>
            <h2 style={{ margin: '0 0 12px 0', color: '#f87171' }}>Terjadi Kesalahan pada Aplikasi</h2>
            <p style={{ margin: '0 0 16px 0', color: '#e2e8f0', fontSize: '14px' }}>
              {this.state.error?.message || 'Gagal memuat antarmuka.'}
            </p>
            <pre style={{
              background: '#0f172a',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              overflow: 'auto',
              maxHeight: '200px',
              color: '#94a3b8'
            }}>
              {this.state.error?.stack || String(this.state.error)}
            </pre>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{
                marginTop: '16px',
                padding: '10px 18px',
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Reset Data & Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Tangkap global unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global Error caught:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)

