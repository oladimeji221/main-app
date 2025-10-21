import { useState, useEffect } from 'react'
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Phone,
  MapPin,
  Shield,
  Wifi,
  Battery,
  Signal
} from 'lucide-react'

const LoginScreen = ({ onLogin }) => {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    phone: '',
    location: 'Lagos, Nigeria'
  })

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (mode === 'login') {
      // Login logic
      const user = {
        id: Date.now(),
        username: formData.email.split('@')[0],
        fullName: 'Current User',
        email: formData.email,
        avatar: formData.email.charAt(0).toUpperCase() + formData.email.charAt(1).toUpperCase(),
        verified: false,
        location: 'Lagos, Nigeria',
        joinedDate: new Date().toISOString()
      }
      onLogin(user)
    } else {
      // Signup logic
      const user = {
        id: Date.now(),
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
        verified: false,
        location: formData.location,
        joinedDate: new Date().toISOString()
      }
      onLogin(user)
    }

    setIsLoading(false)
  }

  const isFormValid = () => {
    if (mode === 'login') {
      return formData.email && formData.password
    } else {
      return formData.email && formData.password && formData.username && formData.fullName
    }
  }

  const categories = [
    'Community News',
    'Traffic Update', 
    'Safety Alert',
    'Emergency',
    'Weather'
  ]

  const getCategoryColor = (cat) => {
    const colors = {
      'Emergency': 'bg-red-500',
      'Traffic Update': 'bg-orange-500',
      'Safety Alert': 'bg-red-400',
      'Community News': 'bg-green-500',
      'Weather': 'bg-blue-500'
    }
    return colors[cat] || 'bg-gray-500'
  }

  return (
    <div className="login-screen">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span>{currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}</span>
        </div>
        <div className="status-right">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={14} />
          <span>85%</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="login-content">
        {/* Header */}
        <div className="login-header">
          <div className="logo-section">
            <img src="/4ward-logo.png" alt="4WARD Logo" className="logo-image" />
            <p className="app-subtitle">Nigeria's Premier Safety Community</p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="welcome-section">
          <h2 className="welcome-title">
            {mode === 'login' ? 'Welcome Back' : 'Join the Community'}
          </h2>
          <p className="welcome-description">
            {mode === 'login' 
              ? 'Sign in to access safety reports and community updates' 
              : 'Create your account to start reporting and staying safe'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-container">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-container">
                  <span className="username-prefix">@</span>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="username"
                    className="form-input username-input"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-container">
                  <Phone size={20} className="input-icon" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+234 xxx xxx xxxx"
                    className="form-input"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-container">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                className="form-input password-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            /* Location */
            <div className="form-group">
              <label className="form-label">Location</label>
              <div className="input-container">
                <MapPin size={20} className="input-icon" />
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="form-select"
                >
                  <option value="Lagos, Nigeria">Lagos, Nigeria</option>
                  <option value="Abuja, Nigeria">Abuja, Nigeria</option>
                  <option value="Port Harcourt, Nigeria">Port Harcourt, Nigeria</option>
                  <option value="Kano, Nigeria">Kano, Nigeria</option>
                  <option value="Ibadan, Nigeria">Ibadan, Nigeria</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In to 4WARD' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="toggle-section">
          <p className="toggle-text">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="toggle-button"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Terms */}
        {mode === 'signup' && (
          <div className="terms-section">
            <p className="terms-text">
              By creating an account, you agree to our{' '}
              <a href="#" className="terms-link">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="terms-link">Privacy Policy</a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginScreen
