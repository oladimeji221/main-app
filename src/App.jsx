import { useState, useRef, useEffect } from 'react'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark,
  CheckCircle,
  MapPin,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Home,
  Search,
  Camera,
  AlertCircle,
  User,
  Wifi,
  Battery,
  Signal,
  LogIn
} from 'lucide-react'
import ModernCamera from './components/ModernCamera'
import ModernSafetyReport from './components/ModernSafetyReport'
import LoginScreen from './components/LoginScreen'
import AdminPanel from './components/AdminPanel'
import './App.css'

const VideoPost = ({ post, isActive, onVideoClick }) => {
  const [liked, setLiked] = useState(post.engagement.liked)
  const [likeCount, setLikeCount] = useState(post.engagement.likes)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isActive])

  const handleLike = () => {
    if (!liked) {
      createHeartConfetti()
      setLiked(true)
      setLikeCount(prev => prev + 1)
    } else {
      setLiked(false)
      setLikeCount(prev => prev - 1)
    }
  }

  const handleVideoClick = () => {
    setShowControls(true)
    setTimeout(() => setShowControls(false), 3000)
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
    onVideoClick?.()
  }

  const handleMuteToggle = (e) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const createHeartConfetti = () => {
    const hearts = ['❤️', '💖', '💕', '💗', '💓']
    
    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('div')
      heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)]
      heart.className = 'heart-confetti'
      // Concentrate hearts in the middle 60% of the screen
      heart.style.left = (20 + Math.random() * 60) + 'vw'
      heart.style.animationDelay = Math.random() * 2 + 's'
      
      document.body.appendChild(heart)
      setTimeout(() => heart.remove(), 3000)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getCategoryClass = (category) => {
    const classes = {
      'Emergency': 'category-emergency',
      'Traffic Update': 'category-traffic',
      'Safety Alert': 'category-safety',
      'Community News': 'category-community',
      'Weather': 'category-weather'
    }
    return classes[category] || 'category-community'
  }

  return (
    <div className="video-post" onClick={handleVideoClick}>
      {/* Video Element */}
      <video
        ref={videoRef}
        className="video-element"
        poster={post.media.thumbnail}
        muted={isMuted}
        loop
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={post.media.url} type="video/mp4" />
      </video>

      {/* Video Controls */}
      <div className={`video-controls ${showControls ? 'visible' : ''}`}>
        {!isPlaying && (
          <button className="play-pause-btn">
            <Play size={32} />
          </button>
        )}
        
        <button 
          onClick={handleMuteToggle}
          className="absolute top-16 right-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* HD Badge */}
      <div className="hd-badge">HD</div>

      {/* 4WARD Watermark */}
      <div className="watermark">4WARD</div>

      {/* Actions Sidebar */}
      <div className="actions-sidebar">
        {/* User Avatar */}
        <div className="user-avatar">
          {post.user.avatar}
          {post.user.verified && (
            <div className="verified-badge">
              <CheckCircle size={12} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <button 
          onClick={(e) => {
            e.stopPropagation()
            handleLike()
          }}
          className={`action-btn ${liked ? 'liked' : ''}`}
        >
          <Heart size={28} className={liked ? 'fill-current' : ''} />
          <span className="action-count">{formatNumber(likeCount)}</span>
        </button>

        <button 
          onClick={(e) => e.stopPropagation()}
          className="action-btn"
        >
          <MessageCircle size={28} />
          <span className="action-count">{formatNumber(post.engagement.comments)}</span>
        </button>

        <button 
          onClick={(e) => e.stopPropagation()}
          className="action-btn"
        >
          <Share size={28} />
          <span className="action-count">{formatNumber(post.engagement.shares)}</span>
        </button>

        <button 
          onClick={(e) => e.stopPropagation()}
          className="action-btn"
        >
          <Bookmark size={28} />
        </button>
      </div>

      {/* Content Overlay */}
      <div className="content-overlay">
        {/* Example Content Badge */}
        <div className="example-badge">
          Example Content - Sponsored by 4WARD
        </div>

        {/* Category Badge */}
        <div className={`category-badge ${getCategoryClass(post.category)}`}>
          {post.priority && <AlertTriangle size={10} className="mr-1" />}
          {post.category}
        </div>

        {/* User Info */}
        <div className="user-info">
          <div className="username">
            @{post.user.username}
            {post.user.verified && (
              <CheckCircle size={14} className="text-green-400" />
            )}
          </div>
          
          {/* Content - Limited to 2 lines */}
          <div className="post-content">
            {post.content}
          </div>

          {/* Location and Time */}
          <div className="post-meta">
            <MapPin size={12} />
            <span>{post.location}</span>
            <span>•</span>
            <span>{post.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatusBar = ({ user, onLoginClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="status-bar">
      <div className="status-left">
        <span>{currentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })}</span>
      </div>
      <div className="status-right">
        {!user && (
          <button 
            onClick={onLoginClick}
            className="text-white text-sm font-medium hover:underline mr-2"
          >
            <LogIn size={14} className="inline mr-1" />
            Login
          </button>
        )}
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={14} />
        <span>85%</span>
      </div>
    </div>
  )
}

const BottomNavigation = ({ activeTab, setActiveTab, onCameraClick }) => {
  return (
    <div className="bottom-nav">
      <button 
        onClick={() => setActiveTab('home')}
        className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
      >
        <Home size={24} />
        <span className="nav-label">Home</span>
      </button>

      <button 
        onClick={() => setActiveTab('discover')}
        className={`nav-btn ${activeTab === 'discover' ? 'active' : ''}`}
      >
        <Search size={24} />
        <span className="nav-label">Discover</span>
      </button>

      <button 
        onClick={onCameraClick}
        className="camera-btn"
      >
        <Camera size={28} />
      </button>

      <button 
        onClick={() => setActiveTab('emergency')}
        className={`nav-btn ${activeTab === 'emergency' ? 'active' : ''}`}
      >
        <AlertCircle size={24} />
        <span className="nav-label">Emergency</span>
      </button>

      <button 
        onClick={() => setActiveTab('profile')}
        className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
      >
        <User size={24} />
        <span className="nav-label">Profile</span>
      </button>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [user, setUser] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [showSafetyReport, setShowSafetyReport] = useState(false)
  const [capturedMedia, setCapturedMedia] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [posts, setPosts] = useState([])

  // Initialize with sample video data
  useEffect(() => {
    if (posts.length === 0) {
      setPosts(samplePosts)
    }
  }, [posts.length])

  // Sample video data with Nigerian safety reporting content
  const samplePosts = [
    {
      id: 1,
      user: {
        username: '4ward_official',
        avatar: '4W',
        verified: true
      },
      category: 'Community News',
      priority: false,
      content: 'Welcome to 4WARD - Nigeria\'s premier safety community! 🇳🇬 Together, we build safer communities.',
      location: 'Lagos, Nigeria',
      timestamp: '2h',
      media: {
        url: '/videos/4ward-welcome.mp4',
        thumbnail: '/images/4ward-welcome-thumb.jpg'
      },
      engagement: {
        likes: 25800,
        comments: 1200,
        shares: 892,
        liked: false
      }
    },
    {
      id: 2,
      user: {
        username: 'sarah_ade',
        avatar: 'SA',
        verified: true
      },
      category: 'Traffic Update',
      priority: false,
      content: 'Traffic update: Heavy congestion on Third Mainland Bridge. Alternative routes via Ikoyi Bridge recommended.',
      location: 'Lagos Island, Lagos',
      timestamp: '4h',
      media: {
        url: '/videos/traffic-update.mp4',
        thumbnail: '/images/4ward-welcome-thumb.jpg'
      },
      engagement: {
        likes: 157,
        comments: 23,
        shares: 45,
        liked: false
      }
    },
    {
      id: 3,
      user: {
        username: 'lagos_safety',
        avatar: 'LS',
        verified: true
      },
      category: 'Safety Alert',
      priority: true,
      content: 'SAFETY ALERT: Increased security presence in Victoria Island area. Citizens advised to remain vigilant.',
      location: 'Victoria Island, Lagos',
      timestamp: '6h',
      media: {
        url: '/videos/security-alert.mp4',
        thumbnail: '/images/4ward-welcome-thumb.jpg'
      },
      engagement: {
        likes: 891,
        comments: 156,
        shares: 234,
        liked: false
      }
    }
  ]

  const handleVideoClick = () => {
    // Handle video interaction
  }

  const handleCameraClick = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    setShowCamera(true)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLoginModal(false)
    
    // Check if user is admin (admin@4ward.com or admin role)
    if (userData.email === 'admin@4ward.com' || userData.role === 'admin') {
      setShowAdminPanel(true)
    }
  }

  const handleAdminLogout = () => {
    setShowAdminPanel(false)
    setUser(null)
  }

  const handleCameraCapture = (mediaData) => {
    setCapturedMedia(mediaData)
    setShowCamera(false)
    setShowSafetyReport(true)
  }

  const handleSafetyReportSubmit = (reportData) => {
    const newPost = {
      id: Date.now(),
      user: {
        username: user.username || 'user',
        avatar: user.username ? user.username.substring(0, 2).toUpperCase() : 'U',
        verified: false
      },
      category: reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1),
      priority: reportData.urgency === 'high' || reportData.urgency === 'critical',
      content: reportData.description,
      location: reportData.location,
      timestamp: 'now',
      media: {
        url: reportData.media?.url || '/videos/4ward-welcome.mp4',
        thumbnail: reportData.media?.url || '/images/4ward-welcome-thumb.jpg'
      },
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      }
    }
    
    setPosts(prev => [newPost, ...prev])
    setCurrentVideoIndex(0)
    setCapturedMedia(null)
    setShowSafetyReport(false)
  }

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop
    const videoHeight = window.innerHeight
    const newIndex = Math.round(scrollTop / videoHeight)
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < posts.length) {
      setCurrentVideoIndex(newIndex)
    }
  }

  const displayPosts = posts.length > 0 ? posts : samplePosts

  // Show login screen if no user is logged in
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Show admin panel if user is admin
  if (showAdminPanel) {
    return <AdminPanel onLogout={handleAdminLogout} currentUser={user} />
  }

  return (
    <div className="tiktok-app">
      {/* Status Bar */}
      <StatusBar 
        user={user}
        onLoginClick={() => setShowLoginModal(true)}
      />

      {/* Video Feed */}
      <div className="video-feed" onScroll={handleScroll}>
        {displayPosts.map((post, index) => (
          <VideoPost
            key={post.id}
            post={post}
            isActive={index === currentVideoIndex}
            onVideoClick={handleVideoClick}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCameraClick={handleCameraClick}
      />

      {/* Modern Camera and Safety Report */}
      <ModernCamera
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        reportType="safety"
      />
      
      <ModernSafetyReport
        isOpen={showSafetyReport}
        onClose={() => {
          setShowSafetyReport(false)
          setCapturedMedia(null)
        }}
        onSubmit={handleSafetyReportSubmit}
        capturedMedia={capturedMedia}
      />
    </div>
  )
}

export default App
