import { NextRequest, NextResponse } from 'next/server'

// Simulation de données pour les statistiques du dashboard
function generateDashboardStats() {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  
  return {
    overview: {
      totalBookings: 2847,
      totalBookingsChange: 12.5,
      conversionRate: 68.3,
      conversionRateChange: 5.2,
      activeCustomers: 1294,
      activeCustomersChange: 8.1,
      averageBookingTime: '2.4min',
      averageBookingTimeChange: -15.3
    },
    
    recentBookings: [
      {
        id: 1,
        customer: {
          firstName: 'Sophie',
          lastName: 'Martin',
          email: 'sophie.martin@email.com',
          avatar: '👩‍💼'
        },
        service: 'Consultation Premium',
        date: '2025-11-01',
        time: '14:30',
        status: 'confirmed',
        amount: 150
      },
      {
        id: 2,
        customer: {
          firstName: 'Thomas',
          lastName: 'Dubois',
          email: 'thomas.dubois@medcare.fr',
          avatar: '👨‍💼'
        },
        service: 'Réunion Stratégie',
        date: '2025-11-01',
        time: '16:00',
        status: 'pending',
        amount: 300
      },
      {
        id: 3,
        customer: {
          firstName: 'Marie',
          lastName: 'Leclerc',
          email: 'marie.leclerc@eduplus.fr',
          avatar: '👩‍🏫'
        },
        service: 'Formation IA',
        date: '2025-11-02',
        time: '09:00',
        status: 'confirmed',
        amount: 300
      },
      {
        id: 4,
        customer: {
          firstName: 'Pierre',
          lastName: 'Durand',
          email: 'pierre.durand@techcorp.com',
          avatar: '👨‍🔧'
        },
        service: 'Audit Processus',
        date: '2025-11-02',
        time: '11:30',
        status: 'cancelled',
        amount: 250
      },
      {
        id: 5,
        customer: {
          firstName: 'Julie',
          lastName: 'Bernard',
          email: 'julie.bernard@innovation.co',
          avatar: '👩‍🎨'
        },
        service: 'Workshop Innovation',
        date: '2025-11-03',
        time: '15:00',
        status: 'confirmed',
        amount: 450
      }
    ],
    
    upcomingEvents: [
      {
        id: 1,
        title: 'Réunion équipe marketing',
        time: '10:00 - 11:00',
        attendees: 8,
        type: 'meeting',
        location: 'Salle de conférence A',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Présentation client Acme Corp',
        time: '14:00 - 15:30',
        attendees: 12,
        type: 'presentation',
        location: 'Salle de présentation',
        priority: 'high'
      },
      {
        id: 3,
        title: 'Formation nouveaux outils',
        time: '16:00 - 17:00',
        attendees: 25,
        type: 'training',
        location: 'Salle de formation',
        priority: 'medium'
      },
      {
        id: 4,
        title: 'Revue hebdomadaire',
        time: '09:00 - 10:00',
        attendees: 6,
        type: 'review',
        location: 'Bureau direction',
        priority: 'low'
      }
    ],
    
    bookingTrends: {
      daily: [
        { date: '2025-10-25', bookings: 12, revenue: 1800 },
        { date: '2025-10-26', bookings: 8, revenue: 1200 },
        { date: '2025-10-27', bookings: 15, revenue: 2250 },
        { date: '2025-10-28', bookings: 18, revenue: 2700 },
        { date: '2025-10-29', bookings: 22, revenue: 3300 },
        { date: '2025-10-30', bookings: 25, revenue: 3750 },
        { date: '2025-10-31', bookings: 28, revenue: 4200 }
      ],
      weekly: [
        { week: 'Sem 40', bookings: 89, revenue: 13350 },
        { week: 'Sem 41', bookings: 95, revenue: 14250 },
        { week: 'Sem 42', bookings: 102, revenue: 15300 },
        { week: 'Sem 43', bookings: 118, revenue: 17700 },
        { week: 'Sem 44', bookings: 128, revenue: 19200 }
      ]
    },
    
    servicePopularity: [
      {
        service: 'Consultation Premium',
        bookings: 847,
        percentage: 29.8,
        revenue: 127050,
        trend: 'up'
      },
      {
        service: 'Formation IA',
        bookings: 623,
        percentage: 21.9,
        revenue: 186900,
        trend: 'up'
      },
      {
        service: 'Workshop Innovation',
        bookings: 512,
        percentage: 18.0,
        revenue: 230400,
        trend: 'stable'
      },
      {
        service: 'Audit Processus',
        bookings: 465,
        percentage: 16.3,
        revenue: 116250,
        trend: 'down'
      },
      {
        service: 'Autres services',
        bookings: 400,
        percentage: 14.0,
        revenue: 80000,
        trend: 'up'
      }
    ],
    
    customerSatisfaction: {
      overall: 4.8,
      totalReviews: 1247,
      distribution: {
        5: 856, // 68.7%
        4: 278, // 22.3%
        3: 87,  // 7.0%
        2: 18,  // 1.4%
        1: 8    // 0.6%
      },
      recentFeedback: [
        {
          customer: 'Sophie Martin',
          rating: 5,
          comment: 'Service exceptionnel, équipe très professionnelle !',
          date: '2025-10-30',
          service: 'Consultation Premium'
        },
        {
          customer: 'Thomas Dubois',
          rating: 5,
          comment: 'Formation très claire et adaptée à nos besoins.',
          date: '2025-10-29',
          service: 'Formation IA'
        },
        {
          customer: 'Marie Leclerc',
          rating: 4,
          comment: 'Bonne expérience, quelques améliorations possibles.',
          date: '2025-10-28',
          service: 'Workshop Innovation'
        }
      ]
    },
    
    notifications: [
      {
        id: 1,
        type: 'booking',
        title: 'Nouvelle réservation',
        message: 'Sophie Martin a réservé une Consultation Premium pour demain 14h30',
        time: '2 min',
        read: false,
        priority: 'medium'
      },
      {
        id: 2,
        type: 'reminder',
        title: 'Rappel - Réunion marketing',
        message: 'Réunion équipe marketing dans 30 minutes',
        time: '5 min',
        read: false,
        priority: 'high'
      },
      {
        id: 3,
        type: 'system',
        title: 'Mise à jour disponible',
        message: 'Nouvelle version d\'AutoBooker disponible avec des améliorations',
        time: '1h',
        read: true,
        priority: 'low'
      }
    ],
    
    quickActions: [
      {
        id: 'new-booking',
        title: 'Nouvelle réservation',
        description: 'Créer une réservation rapidement',
        icon: 'plus',
        color: 'primary',
        href: '/booking'
      },
      {
        id: 'calendar',
        title: 'Voir le calendrier',
        description: 'Consulter le planning complet',
        icon: 'calendar',
        color: 'secondary',
        href: '/calendar'
      },
      {
        id: 'analytics',
        title: 'Analytics détaillées',
        description: 'Rapports et analyses avancées',
        icon: 'chart',
        color: 'success',
        href: '/analytics'
      },
      {
        id: 'settings',
        title: 'Paramètres',
        description: 'Configurer votre compte',
        icon: 'settings',
        color: 'gray',
        href: '/settings'
      }
    ]
  }
}  

// GET - Récupérer les statistiques du dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 24h, 7d, 30d, 90d
    const section = searchParams.get('section') // overview, bookings, trends, etc.
    
    const stats = generateDashboardStats()
    
    // Si une section spécifique est demandée
    if (section && stats[section as keyof typeof stats]) {
      return NextResponse.json(
        {
          section,
          period,
          data: stats[section as keyof typeof stats]
        },
        { status: 200 }
      )
    }
    
    // Retourner toutes les statistiques
    return NextResponse.json(
      {
        period,
        timestamp: new Date().toISOString(),
        ...stats
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST - Marquer les notifications comme lues
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationIds, markAllAsRead } = body
    
    if (markAllAsRead) {
      // Marquer toutes les notifications comme lues
      return NextResponse.json(
        { message: 'Toutes les notifications ont été marquées comme lues' },
        { status: 200 }
      )
    }
    
    if (notificationIds && Array.isArray(notificationIds)) {
      // Marquer les notifications spécifiques comme lues
      return NextResponse.json(
        { 
          message: `${notificationIds.length} notification(s) marquée(s) comme lue(s)`,
          updatedIds: notificationIds
        },
        { status: 200 }
      )
    }
    
    return NextResponse.json(
      { message: 'Paramètres invalides' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}