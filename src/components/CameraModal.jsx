import { useState, useRef } from 'react'
import { 
  X, 
  Camera, 
  Video, 
  Image, 
  MapPin, 
  AlertTriangle,
  Upload
} from 'lucide-react'

const CameraModal = ({ isOpen, onClose, onPost }) => {
  const [captureMode, setCaptureMode] = useState('photo') // 'photo' or 'video'
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [category, setCategory] = useState('Community News')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)

  if (!isOpen) return null

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setMediaFile(file)
      const url = URL.createObjectURL(file)
      setMediaPreview(url)
    }
  }

  const handlePost = async () => {
    if (!mediaFile || !caption.trim()) {
      alert('Please add media and caption before posting')
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newPost = {
      id: Date.now(),
      user: {
        username: 'current_user',
        avatar: 'CU',
        verified: false
      },
      category: category,
      priority: category === 'Emergency' || category === 'Safety Alert',
      content: caption,
      location: 'Lagos, Nigeria',
      timestamp: 'now',
      media: {
        url: mediaPreview,
        thumbnail: mediaPreview,
        type: captureMode
      },
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      }
    }

    onPost(newPost)
    
    // Reset form
    setMediaFile(null)
    setMediaPreview(null)
    setCaption('')
    setCategory('Community News')
    setIsUploading(false)
    onClose()
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Create Safety Report</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Media Capture Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Add Media</h3>
            
            {mediaPreview ? (
              <div className="relative">
                {captureMode === 'photo' ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    className="w-full h-48 object-cover rounded-lg"
                    controls
                  />
                )}
                <button
                  onClick={() => {
                    setMediaFile(null)
                    setMediaPreview(null)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setCaptureMode('photo')
                    fileInputRef.current?.click()
                  }}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                >
                  <Camera size={24} className="text-gray-600 mb-2" />
                  <span className="text-sm text-gray-600">Photo</span>
                </button>

                <button
                  onClick={() => {
                    setCaptureMode('video')
                    videoInputRef.current?.click()
                  }}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                >
                  <Video size={24} className="text-gray-600 mb-2" />
                  <span className="text-sm text-gray-600">Video</span>
                </button>

                <button
                  onClick={() => {
                    setCaptureMode('photo')
                    fileInputRef.current?.click()
                  }}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 transition-colors"
                >
                  <Image size={24} className="text-gray-600 mb-2" />
                  <span className="text-sm text-gray-600">Gallery</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-900">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening in your area? Describe the safety situation..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500">
              {caption.length}/500
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-900">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    category === cat
                      ? `${getCategoryColor(cat)} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'Emergency' && <AlertTriangle size={16} className="inline mr-1" />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>Lagos, Nigeria</span>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePost}
            disabled={!mediaFile || !caption.trim() || isUploading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Posting...
              </>
            ) : (
              <>
                <Upload size={20} />
                Post to 4WARD
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CameraModal
