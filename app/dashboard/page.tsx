'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Bell,
  Settings,
  BarChart3,
  Filter,
  Download,
  Search,
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react'

const stats = [
  {
    title: 'Réservations Totales',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: CalendarDays,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Taux de Conversion',
    value: '68.3%',
    change: '+5.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Clients Actifs',
    value: '1,294',
    change: '+8.1%',
    trend: 'up',
    icon: Users,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Temps Moyen',
    value: '2.4min',
    change: '-15.3%',
    trend: 'down',
    icon: Clock,
    color: 'from-orange-500 to-orange-600'
  }
]

const recentBookings = [
  {
    id: 1,
    client: 'Sophie Martin',
    service: 'Consultation Premium',
    date: '2025-11-01',
    time: '14:30',
    status: 'confirmed',
    avatar: '👩‍💼'
  },
  {
    id: 2,
    client: 'Thomas Dubois',
    service: 'Réunion Stratégie',
    date: '2025-11-01',
    time: '16:00',
    status: 'pending',
    avatar: '👨‍💼'
  },
  {
    id: 3,
    client: 'Marie Leclerc',
    service: 'Formation IA',
    date: '2025-11-02',
    time: '09:00',
    status: 'confirmed',
    avatar: '👩‍🏫'
  },
  {
    id: 4,
    client: 'Pierre Durand',
    service: 'Audit Processus',
    date: '2025-11-02',
    time: '11:30',
    status: 'cancelled',
    avatar: '👨‍🔧'
  },
  {
    id: 5,
    client: 'Julie Bernard',
    service: 'Workshop Innovation',
    date: '2025-11-03',
    time: '15:00',
    status: 'confirmed',
    avatar: '👩‍🎨'
  }
]

const upcomingEvents = [
  {
    id: 1,
    title: 'Réunion équipe marketing',
    time: '10:00 - 11:00',
    attendees: 8,
    type: 'meeting'
  },
  {
    id: 2,
    title: 'Présentation client Acme Corp',
    time: '14:00 - 15:30',
    attendees: 12,
    type: 'presentation'
  },
  {
    id: 3,
    title: 'Formation nouveaux outils',
    time: '16:00 - 17:00',
    attendees: 25,
    type: 'training'
  }
]

// Fonctions utilitaires
function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'confirmed':
      return <CheckCircle2 className="w-4 h-4" />
    case 'pending':
      return <AlertCircle className="w-4 h-4" />
    case 'cancelled':
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [notifications] = useState(3)
  const [user] = useState({
    name: 'John Doe',
    email: 'john@autobooker.com',
    avatar: '👨‍💼',
    plan: 'Premium'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-primary-600" />
                <span className="text-2xl font-bold gradient-text">AutoBooker</span>
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              <h1 className="hidden md:block text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                )}
              </button>
              
              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.plan}</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-lg">
                  {user.avatar}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Bonjour {user.name.split(' ')[0]} ! 👋
              </h2>
              <p className="text-gray-600">
                Voici un aperçu de vos performances aujourd'hui.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="btn-secondary flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
              <button className="btn-primary flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle réservation
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className={`text-sm mt-2 flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        stat.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Réservations Récentes</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-500">
                      <Filter className="w-5 h-5" />
                    </button>
                    <select 
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="24h">24h</option>
                      <option value="7d">7 jours</option>
                      <option value="30d">30 jours</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{booking.avatar}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{booking.client}</p>
                          <p className="text-sm text-gray-500">{booking.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{booking.date}</p>
                          <p className="text-sm text-gray-500">{booking.time}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Planning Aujourd'hui</h3>
              </div>
              <div className="p-6 space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {event.attendees} participant{event.attendees > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle réservation
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Voir le calendrier
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </button>
                <button className="w-full btn-secondary flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fonctions utilitaires exportées
function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'confirmed':
      return <CheckCircle2 className="w-4 h-4" />
    case 'pending':
      return <AlertCircle className="w-4 h-4" />
    case 'cancelled':
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}