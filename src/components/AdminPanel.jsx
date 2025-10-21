import { useState, useEffect } from 'react'
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  Calendar,
  MessageSquare,
  Flag,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react'

const AdminPanel = ({ onLogout, currentUser }) => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [reports, setReports] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Initialize with sample data
  useEffect(() => {
    // Sample reports data
    setReports([
      {
        id: 1,
        type: 'Emergency',
        title: 'Fire outbreak at Victoria Island',
        description: 'Large fire reported at commercial building on Ahmadu Bello Way',
        location: 'Victoria Island, Lagos',
        reporter: 'John Adebayo',
        reporterPhone: '+234 803 123 4567',
        timestamp: '2024-01-15 14:30:00',
        status: 'active',
        urgency: 'critical',
        verified: false,
        responders: ['Lagos Fire Service', 'LASEMA'],
        media: ['/images/fire-report.jpg'],
        coordinates: { lat: 6.4281, lng: 3.4219 }
      },
      {
        id: 2,
        type: 'Traffic',
        title: 'Major accident on Third Mainland Bridge',
        description: 'Multi-vehicle collision causing severe traffic congestion',
        location: 'Third Mainland Bridge, Lagos',
        reporter: 'Sarah Okafor',
        reporterPhone: '+234 805 987 6543',
        timestamp: '2024-01-15 13:15:00',
        status: 'resolved',
        urgency: 'high',
        verified: true,
        responders: ['FRSC', 'Lagos State Traffic Management'],
        media: ['/images/traffic-accident.jpg'],
        coordinates: { lat: 6.4698, lng: 3.4219 }
      },
      {
        id: 3,
        type: 'Security',
        title: 'Suspicious activity in Ikeja area',
        description: 'Reports of unusual gathering and potential security threat',
        location: 'Ikeja, Lagos',
        reporter: 'Michael Okonkwo',
        reporterPhone: '+234 807 456 7890',
        timestamp: '2024-01-15 12:45:00',
        status: 'investigating',
        urgency: 'medium',
        verified: true,
        responders: ['Nigeria Police Force'],
        media: [],
        coordinates: { lat: 6.6018, lng: 3.3515 }
      }
    ])

    // Sample users data
    setUsers([
      {
        id: 1,
        username: 'johnadebayo',
        fullName: 'John Adebayo',
        email: 'john@example.com',
        phone: '+234 803 123 4567',
        location: 'Lagos, Nigeria',
        joinDate: '2024-01-10',
        status: 'active',
        verified: true,
        reportsCount: 5,
        lastActive: '2024-01-15 14:30:00',
        role: 'user'
      },
      {
        id: 2,
        username: 'sarahokafor',
        fullName: 'Sarah Okafor',
        email: 'sarah@example.com',
        phone: '+234 805 987 6543',
        location: 'Abuja, Nigeria',
        joinDate: '2024-01-08',
        status: 'active',
        verified: true,
        reportsCount: 12,
        lastActive: '2024-01-15 13:15:00',
        role: 'user'
      },
      {
        id: 3,
        username: 'michaelokonkwo',
        fullName: 'Michael Okonkwo',
        email: 'michael@example.com',
        phone: '+234 807 456 7890',
        location: 'Port Harcourt, Nigeria',
        joinDate: '2024-01-05',
        status: 'suspended',
        verified: false,
        reportsCount: 3,
        lastActive: '2024-01-14 18:20:00',
        role: 'user'
      }
    ])

    // Sample statistics
    setStats({
      totalUsers: 1247,
      activeReports: 23,
      resolvedToday: 15,
      emergencyAlerts: 3,
      verifiedReports: 89,
      responseTime: '12 min',
      userGrowth: '+15%',
      reportAccuracy: '94%'
    })
  }, [])

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-red-500',
      'investigating': 'bg-yellow-500',
      'resolved': 'bg-green-500',
      'pending': 'bg-blue-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getUrgencyColor = (urgency) => {
    const colors = {
      'critical': 'text-red-600 bg-red-100',
      'high': 'text-orange-600 bg-orange-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'low': 'text-green-600 bg-green-100'
    }
    return colors[urgency] || 'text-gray-600 bg-gray-100'
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredUsers = users.filter(user => {
    return user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.username.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const DashboardTab = () => (
    <div className="admin-dashboard">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue-500">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
            <span className="stat-change positive">{stats.userGrowth}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red-500">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.activeReports}</h3>
            <p>Active Reports</p>
            <span className="stat-change">{stats.emergencyAlerts} critical</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green-500">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.resolvedToday}</h3>
            <p>Resolved Today</p>
            <span className="stat-change positive">+{stats.reportAccuracy}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-purple-500">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.responseTime}</h3>
            <p>Avg Response</p>
            <span className="stat-change positive">-2 min</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2>Recent Emergency Reports</h2>
        <div className="recent-reports">
          {reports.slice(0, 5).map(report => (
            <div key={report.id} className="report-item">
              <div className="report-status">
                <div className={`status-indicator ${getStatusColor(report.status)}`}></div>
              </div>
              <div className="report-details">
                <h4>{report.title}</h4>
                <p>{report.location} • {report.reporter}</p>
                <span className="report-time">{report.timestamp}</span>
              </div>
              <div className={`urgency-badge ${getUrgencyColor(report.urgency)}`}>
                {report.urgency}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <button className="action-btn emergency">
            <AlertCircle size={20} />
            Broadcast Emergency Alert
          </button>
          <button className="action-btn">
            <Download size={20} />
            Export Reports
          </button>
          <button className="action-btn">
            <BarChart3 size={20} />
            Generate Analytics
          </button>
          <button className="action-btn">
            <Settings size={20} />
            System Settings
          </button>
        </div>
      </div>
    </div>
  )

  const ReportsTab = () => (
    <div className="admin-reports">
      {/* Search and Filter */}
      <div className="reports-header">
        <h2>Safety Reports Management</h2>
        <div className="reports-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-table">
        <div className="table-header">
          <div>Report</div>
          <div>Location</div>
          <div>Reporter</div>
          <div>Status</div>
          <div>Urgency</div>
          <div>Actions</div>
        </div>
        {filteredReports.map(report => (
          <div key={report.id} className="table-row">
            <div className="report-cell">
              <h4>{report.title}</h4>
              <p>{report.description.substring(0, 60)}...</p>
              <span className="report-time">{report.timestamp}</span>
            </div>
            <div className="location-cell">
              <MapPin size={16} />
              {report.location}
            </div>
            <div className="reporter-cell">
              <div>
                <strong>{report.reporter}</strong>
                <p>{report.reporterPhone}</p>
              </div>
            </div>
            <div className="status-cell">
              <span className={`status-badge ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
              {report.verified && <CheckCircle size={16} className="verified-icon" />}
            </div>
            <div className="urgency-cell">
              <span className={`urgency-badge ${getUrgencyColor(report.urgency)}`}>
                {report.urgency}
              </span>
            </div>
            <div className="actions-cell">
              <button className="action-icon" title="View Details">
                <Eye size={16} />
              </button>
              <button className="action-icon" title="Edit">
                <Edit size={16} />
              </button>
              <button className="action-icon danger" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const UsersTab = () => (
    <div className="admin-users">
      <div className="users-header">
        <h2>User Management</h2>
        <div className="users-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-user-btn">
            <Users size={20} />
            Add User
          </button>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div>User</div>
          <div>Contact</div>
          <div>Location</div>
          <div>Status</div>
          <div>Reports</div>
          <div>Actions</div>
        </div>
        {filteredUsers.map(user => (
          <div key={user.id} className="table-row">
            <div className="user-cell">
              <div className="user-avatar">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4>{user.fullName}</h4>
                <p>@{user.username}</p>
                <span className="join-date">Joined {user.joinDate}</span>
              </div>
            </div>
            <div className="contact-cell">
              <p>{user.email}</p>
              <p>{user.phone}</p>
            </div>
            <div className="location-cell">
              <MapPin size={16} />
              {user.location}
            </div>
            <div className="status-cell">
              <span className={`status-badge ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                {user.status}
              </span>
              {user.verified && <UserCheck size={16} className="verified-icon" />}
            </div>
            <div className="reports-cell">
              <strong>{user.reportsCount}</strong>
              <p>reports</p>
            </div>
            <div className="actions-cell">
              <button className="action-icon" title="View Profile">
                <Eye size={16} />
              </button>
              <button className="action-icon" title="Edit User">
                <Edit size={16} />
              </button>
              <button className="action-icon" title={user.status === 'active' ? 'Suspend' : 'Activate'}>
                {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="admin-panel">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-logo">
          <img src="/4ward-logo.png" alt="4WARD Admin" className="admin-logo-img" />
          <span>Admin Panel</span>
        </div>
        <div className="admin-user">
          <Bell size={20} />
          <div className="user-info">
            <span>{currentUser?.fullName || 'Admin User'}</span>
            <p>Administrator</p>
          </div>
          <button onClick={onLogout} className="logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="admin-nav">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <BarChart3 size={20} />
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
        >
          <AlertTriangle size={20} />
          Reports
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          <Users size={20} />
          Users
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          <PieChart size={20} />
          Analytics
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Settings size={20} />
          Settings
        </button>
      </div>

      {/* Admin Content */}
      <div className="admin-content">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'analytics' && (
          <div className="admin-analytics">
            <h2>Analytics & Reports</h2>
            <p>Analytics dashboard coming soon...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="admin-settings">
            <h2>System Settings</h2>
            <p>Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
