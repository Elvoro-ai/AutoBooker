import { NextRequest, NextResponse } from 'next/server'

// Base de données temporaire pour les réservations
let enhancedBookings: any[] = []

// Services avec configurations avancées
const premiumServices = [
  {
    id: 1,
    name: 'Consultation Premium IA',
    duration: '60 min',
    price: 150,
    description: 'Consultation approfondie avec analyse IA personnalisée',
    category: 'consultation',
    features: ['Analyse IA', 'Rapport détaillé', 'Suivi 30 jours'],
    preparation: 'Préparez vos questions et objectifs',
    autoConfirm: true
  },
  {
    id: 2,
    name: 'Formation IA Complète',
    duration: '2h',
    price: 300,
    description: 'Formation intensive sur les outils d\'IA avec certification',
    category: 'formation',
    features: ['Certification', 'Ressources exclusives', 'Support continu'],
    preparation: 'Aucune préparation nécessaire',
    autoConfirm: true
  },
  {
    id: 3,
    name: 'Audit Processus + IA',
    duration: '90 min',
    price: 250,
    description: 'Audit complet de vos processus avec recommandations IA',
    category: 'audit',
    features: ['Analyse approfondie', 'Roadmap personnalisée', 'ROI prévisionnel'],
    preparation: 'Préparez vos documents de processus',
    autoConfirm: false
  }
]

// Génération de code de confirmation unique
function generateEnhancedConfirmationCode(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `AB-${timestamp}-${random}`.toUpperCase()
}

// Formatage de date simple
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Calcul du prix avec réductions potentielles
function calculatePricing(service: any, customer: any) {
  let finalPrice = service.price
  let discounts = []
  
  // Réduction client récurrent (simulation)
  if (customer.isReturning) {
    finalPrice *= 0.9
    discounts.push('Client fidèle: -10%')
  }
  
  // Réduction première réservation
  if (customer.isFirstTime) {
    finalPrice *= 0.85
    discounts.push('Première réservation: -15%')
  }
  
  return {
    originalPrice: service.price,
    finalPrice: Math.round(finalPrice),
    discounts,
    savings: service.price - Math.round(finalPrice)
  }
}

// POST - Créer une réservation avancée
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service, date, time, customer, preferences } = body

    // Validation des données
    if (!service?.id || !date || !time || !customer) {
      return NextResponse.json(
        { message: 'Données de réservation incomplètes' },
        { status: 400 }
      )
    }

    // Vérification du service
    const selectedService = premiumServices.find(s => s.id === service.id)
    if (!selectedService) {
      return NextResponse.json(
        { message: 'Service non disponible' },
        { status: 404 }
      )
    }

    // Calcul des prix avec réductions
    const pricing = calculatePricing(selectedService, customer)

    // Création de la réservation avancée
    const enhancedBooking = {
      id: enhancedBookings.length + 1,
      confirmationCode: generateEnhancedConfirmationCode(),
      service: selectedService,
      date,
      time,
      customer: {
        ...customer,
        id: `customer-${Date.now()}`,
        preferences: preferences || {}
      },
      pricing,
      status: selectedService.autoConfirm ? 'confirmed' : 'pending_review',
      metadata: {
        source: 'web_booking',
        userAgent: request.headers.get('user-agent') || '',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      },
      integrations: {
        emailSent: false,
        smsSent: false,
        calendarSynced: false,
        paymentCreated: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Ajout à la base de données
    enhancedBookings.push(enhancedBooking)

    // Réponse immédiate au client
    return NextResponse.json(
      {
        message: 'Réservation créée avec succès',
        booking: {
          id: enhancedBooking.id,
          confirmationCode: enhancedBooking.confirmationCode,
          service: selectedService.name,
          date: formatDate(date),
          time,
          pricing,
          status: enhancedBooking.status,
          nextSteps: [
            'Un email de confirmation a été envoyé',
            'Un SMS de rappel sera envoyé 24h avant',
            selectedService.preparation && `Préparation: ${selectedService.preparation}`
          ].filter(Boolean)
        },
        integrations: {
          email_scheduled: !!process.env.GMAIL_CLIENT_ID,
          sms_scheduled: !!process.env.TWILIO_ACCOUNT_SID,
          payment_ready: !!process.env.STRIPE_SECRET_KEY,
          ai_enabled: !!process.env.OPENAI_API_KEY
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création de la réservation avancée:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// GET - Récupérer les réservations
export async function GET(request: NextRequest) {
  try {
    const stats = {
      total_bookings: enhancedBookings.length,
      revenue_total: enhancedBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.pricing.finalPrice, 0),
      average_booking_value: enhancedBookings.length > 0 
        ? enhancedBookings.reduce((sum, b) => sum + b.pricing.finalPrice, 0) / enhancedBookings.length
        : 0
    }
    
    return NextResponse.json(
      {
        bookings: enhancedBookings.slice(-10), // 10 dernières
        stats,
        timestamp: new Date().toISOString(),
        services_available: premiumServices.length
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error)
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