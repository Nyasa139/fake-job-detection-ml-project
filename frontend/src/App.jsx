import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Zap, Brain, Loader2 } from 'lucide-react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const analyzeJob = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter a job description.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        combined_text: text
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to the analysis engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glass-bg"></div>
      <div className="bg-grid"></div>
      <div className="glass-circle circle1"></div>
      <div class="glass-circle circle2"></div>
      
      <div style={styles.page}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={styles.left}
        >
          <div style={styles.badgePill}>
            <ShieldAlert size={14} style={{ marginRight: 6 }} /> AI Security
          </div>
          <h1 style={styles.heading}>Fake Job Detection</h1>
          <p style={styles.paragraph}>
            Analyze job descriptions and detect whether a posting looks legitimate or fraudulent using advanced machine learning.
          </p>

          <div style={styles.badges}>
            <span style={styles.badge}>
              <Zap size={16} color="#818cf8" /> Fast Result
            </span>
            <span style={styles.badge}>
              <Brain size={16} color="#818cf8" /> Smart Analysis
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={styles.cardContainer}
        >
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Analyze Post</h2>
            
            <form onSubmit={analyzeJob}>
              <label style={styles.label}>Job Description</label>
              <textarea 
                style={styles.textarea}
                placeholder="Example: We are hiring immediately. No experience needed. Pay registration fee first..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.error}>
                  {error}
                </motion.div>
              )}

              <button 
                type="submit" 
                style={styles.button}
                disabled={loading}
              >
                {loading ? <Loader2 className="spinner" size={20} /> : 'Analyze Now'}
              </button>
            </form>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    ...styles.resultBox,
                    borderColor: result.result === 'Fraudulent' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)',
                    color: result.result === 'Fraudulent' ? '#f87171' : '#4ade80',
                    backgroundColor: result.result === 'Fraudulent' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '18px' }}>
                    {result.result === 'Fraudulent' ? '⚠️ Fraudulent Posting' : '✅ Legitimate Posting'}
                  </div>
                  <div style={{ fontSize: '14px', marginTop: '6px', opacity: 0.8 }}>
                    Confidence Score: {(result.score * 100).toFixed(1)}%
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        textarea:focus {
          border-color: #6366f1;
          background: rgba(0, 0, 0, 0.5);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2), 0 0 15px rgba(99, 102, 241, 0.15);
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '80px',
    padding: '40px',
    zIndex: 10,
    maxWidth: '1100px',
    margin: '0 auto',
    flexWrap: 'wrap'
  },
  left: {
    flex: '1 1 400px',
  },
  badgePill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '20px',
    color: '#818cf8',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '20px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  heading: {
    fontSize: '56px',
    lineHeight: 1.1,
    marginBottom: '24px',
    fontWeight: 800,
    letterSpacing: '-1.5px',
    background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  paragraph: {
    fontSize: '18px',
    color: '#94a3b8',
    lineHeight: 1.7,
    fontWeight: 400
  },
  badges: {
    marginTop: '35px',
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap'
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    fontSize: '14px',
    fontWeight: 500,
    color: '#cbd5e1',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
  },
  cardContainer: {
    flex: '1 1 400px',
    maxWidth: '460px',
    width: '100%'
  },
  card: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(25px)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  cardTitle: {
    fontSize: '26px',
    marginBottom: '25px',
    fontWeight: 600,
    color: '#f8fafc',
    letterSpacing: '-0.5px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    color: '#e2e8f0',
    fontWeight: 500,
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    height: '180px',
    resize: 'none',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    outline: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#f1f5f9',
    background: 'rgba(0, 0, 0, 0.3)',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
  },
  button: {
    width: '100%',
    marginTop: '25px',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
  },
  error: {
    color: '#f87171',
    fontSize: '14px',
    marginTop: '10px',
    fontWeight: 500
  },
  resultBox: {
    marginTop: '25px',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid',
    textAlign: 'center'
  }
};

export default App;
