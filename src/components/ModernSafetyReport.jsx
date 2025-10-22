import { useState } from 'react'
import { 
  X, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Camera, 
  Send,
  Zap,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'

const ModernSafetyReport = ({ isOpen, onClose, onSubmit, capturedMedia = null }) => {
  const [reportData, setReportData] = useState({
    type: 'security',
    urgency: 'medium',
    description: '',
    location: capturedMedia?.location || 'Detecting location...',
    visibility: 'public',
    anonymous: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reportTypes = [
    { id: 'fire', label: 'Fire Emergency', icon: '🔥', color: '#ff4444' },
    { id: 'medical', label: 'Medical Emergency', icon: '🏥', color: '#4CAF50' },
    { id: 'security', label: 'Security Incident', icon: '🚨', color: '#ff9800' },
    { id: 'traffic', label: 'Traffic Incident', icon: '🚗', color: '#2196F3' },
    { id: 'weather', label: 'Weather Alert', icon: '⛈️', color: '#9C27B0' },
    { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: '#607D8B' }
  ]

  const urgencyLevels = [
    { id: 'low', label: 'Low Priority', color: '#4CAF50' },
    { id: 'medium', label: 'Medium Priority', color: '#ff9800' },
    { id: 'high', label: 'High Priority', color: '#ff4444' },
    { id: 'critical', label: 'CRITICAL', color: '#d32f2f' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    const report = {
      ...reportData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      media: capturedMedia,
      status: 'submitted'
    }

    onSubmit(report)
    setIsSubmitting(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modern-report-overlay">
      <div className="report-container">
        {/* Header */}
        <div className="report-header">
          <div className="header-content">
            <AlertTriangle size={24} className="header-icon" />
            <div>
              <h2>Safety Report</h2>
              <p>Document and report safety incidents</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Incident Type Selection */}
          <div className="form-section">
            <label className="section-label">
              <AlertTriangle size={18} />
              Incident Type
            </label>
            <div className="type-grid">
              {reportTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setReportData(prev => ({ ...prev, type: type.id }))}
                  className={`type-btn ${reportData.type === type.id ? 'active' : ''}`}
                  style={{ '--accent-color': type.color }}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Level */}
          <div className="form-section">
            <label className="section-label">
              <Zap size={18} />
              Urgency Level
            </label>
            <div className="urgency-selector">
              {urgencyLevels.map(level => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setReportData(prev => ({ ...prev, urgency: level.id }))}
                  className={`urgency-btn ${reportData.urgency === level.id ? 'active' : ''}`}
                  style={{ '--urgency-color': level.color }}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Media Preview */}
          {capturedMedia && (
            <div className="form-section">
              <label className="section-label">
                <Camera size={18} />
                Captured Evidence
              </label>
              <div className="media-preview">
                {capturedMedia.type === 'photo' ? (
                  <img src={capturedMedia.url} alt="Evidence" className="evidence-media" />
                ) : (
                  <video src={capturedMedia.url} controls className="evidence-media" />
                )}
                <div className="media-info">
                  <p>📍 {capturedMedia.location}</p>
                  <p>🕒 {new Date(capturedMedia.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="form-section">
            <label className="section-label">
              Description
            </label>
            <textarea
              value={reportData.description}
              onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what happened, when, and any immediate actions taken..."
              className="description-input"
              rows={4}
              required
            />
            <div className="char-count">
              {reportData.description.length}/500
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <label className="section-label">
              <MapPin size={18} />
              Location
            </label>
            <div className="location-display">
              <MapPin size={16} />
              <span>{reportData.location}</span>
              <button type="button" className="update-location">
                Update
              </button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="form-section">
            <label className="section-label">
              <Shield size={18} />
              Privacy & Visibility
            </label>
            <div className="privacy-options">
              <div className="privacy-row">
                <button
                  type="button"
                  onClick={() => setReportData(prev => ({ ...prev, visibility: 'public' }))}
                  className={`privacy-btn ${reportData.visibility === 'public' ? 'active' : ''}`}
                >
                  <Eye size={16} />
                  Public Report
                </button>
                <button
                  type="button"
                  onClick={() => setReportData(prev => ({ ...prev, visibility: 'authorities' }))}
                  className={`privacy-btn ${reportData.visibility === 'authorities' ? 'active' : ''}`}
                >
                  <Shield size={16} />
                  Authorities Only
                </button>
              </div>
              <label className="anonymous-toggle">
                <input
                  type="checkbox"
                  checked={reportData.anonymous}
                  onChange={(e) => setReportData(prev => ({ ...prev, anonymous: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
                <span>Submit anonymously</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || !reportData.description.trim()}
            className="submit-btn"
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner"></div>
                Submitting Report...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Safety Report
              </>
            )}
          </button>
        </form>

        {/* Emergency Contact */}
        <div className="emergency-contact">
          <p>For immediate emergencies, call:</p>
          <div className="emergency-numbers">
            <a href="tel:199" className="emergency-number">
              🚨 Police: 199
            </a>
            <a href="tel:199" className="emergency-number">
              🔥 Fire: 199
            </a>
            <a href="tel:199" className="emergency-number">
              🏥 Medical: 199
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernSafetyReport
