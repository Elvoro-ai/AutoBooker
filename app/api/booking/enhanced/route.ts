import { NextRequest, NextResponse } from 'next/server'
import { openaiAPI, gmailAPI, twilioAPI, stripeAPI } from '@/lib/integrations'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Base de données des réservations (en mémoire pour la démo)
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
    autoConfirm: false // Nécessite validation manuelle
  },
  {
    id: 4,
    name: 'Workshop Innovation IA',
    duration: '3h',
    price: 450,
    description: 'Atelier collaboratif pour intégrer l\'IA dans votre entreprise',
    category: 'workshop',
    features: ['Atelier interactif', 'Plan d\'action', 'Équipe complète'],
    preparation: 'Brief équipe et cas d\'usage',
    autoConfirm: false
  }
]

// Génération de code de confirmation unique
function generateEnhancedConfirmationCode(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `AB-${timestamp}-${random}`.toUpperCase()
}

// Calcul du prix avec réductions potentielles
function calculatePricing(service: any, customer: any) {
  let finalPrice = service.price
  let discounts = []
  
  // Réduction client récurrent (simulation)
  if (customer.isReturning) {
    finalPrice *= 0.9 // -10%
    discounts.push('Client fidèle: -10%')
  }
  
  // Réduction première réservation
  if (customer.isFirstTime) {
    finalPrice *= 0.85 // -15%
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

    // Intégrations asynchrones (en parallèle)
    const integrationPromises = []

    // 1. Génération de message personnalisé avec IA
    try {
      const aiConfirmation = await openaiAPI.generateBookingConfirmation({
        customerName: `${customer.firstName} ${customer.lastName}`,
        service: selectedService.name,
        date: format(new Date(date), 'EEEE dd MMMM yyyy', { locale: fr }),
        time
      })
      enhancedBooking.aiMessage = aiConfirmation
    } catch (error) {
      console.warn('IA message generation failed:', error)
    }

    // 2. Envoi d'email de confirmation
    if (process.env.GMAIL_CLIENT_ID) {
      integrationPromises.push(
        gmailAPI.sendBookingConfirmation(customer.email, enhancedBooking)
          .then(() => {
            enhancedBooking.integrations.emailSent = true
            console.log(`✅ Email envoyé à ${customer.email}`)
          })
          .catch(error => {
            console.warn('Email sending failed:', error)
          })
      )
    }

    // 3. Envoi de SMS de confirmation
    if (process.env.TWILIO_ACCOUNT_SID && customer.phone) {
      integrationPromises.push(
        twilioAPI.sendBookingConfirmation(customer.phone, {
          customerName: `${customer.firstName} ${customer.lastName}`,
          service: selectedService.name,
          date: format(new Date(date), 'dd/MM/yyyy'),
          time,
          confirmationCode: enhancedBooking.confirmationCode
        })
          .then(() => {
            enhancedBooking.integrations.smsSent = true
            console.log(`✅ SMS envoyé à ${customer.phone}`)
          })
          .catch(error => {
            console.warn('SMS sending failed:', error)
          })
      )
    }

    // 4. Création d'intention de paiement Stripe
    if (process.env.STRIPE_SECRET_KEY && pricing.finalPrice > 0) {
      integrationPromises.push(
        stripeAPI.createPaymentIntent(
          pricing.finalPrice * 100, // Stripe utilise les centimes
          'eur',
          {
            booking_id: enhancedBooking.id.toString(),
            customer_name: `${customer.firstName} ${customer.lastName}`,
            service: selectedService.name,
            confirmation_code: enhancedBooking.confirmationCode
          }
        )
          .then((paymentIntent) => {
            enhancedBooking.integrations.paymentCreated = true
            enhancedBooking.paymentIntent = {
              id: paymentIntent.id,
              client_secret: paymentIntent.client_secret,
              status: paymentIntent.status
            }
            console.log(`✅ Payment Intent créé: ${paymentIntent.id}`)
          })
          .catch(error => {
            console.warn('Payment Intent creation failed:', error)
          })
      )
    }

    // Exécution des intégrations en parallèle (sans bloquer)
    Promise.all(integrationPromises)
      .then(() => {
        console.log(`✅ Toutes les intégrations terminées pour ${enhancedBooking.confirmationCode}`)
      })
      .catch(error => {
        console.warn('Certaines intégrations ont échoué:', error)
      })

    // Réponse immédiate au client
    return NextResponse.json(
      {
        message: 'Réservation créée avec succès',
        booking: {
          id: enhancedBooking.id,
          confirmationCode: enhancedBooking.confirmationCode,
          service: selectedService.name,
          date: format(new Date(date), 'EEEE dd MMMM yyyy', { locale: fr }),
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

// GET - Récupérer les réservations avec analytics IA
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAnalytics = searchParams.get('analytics') === 'true'
    const customerId = searchParams.get('customer_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let results = [...enhancedBookings]
    
    // Filtrage par client
    if (customerId) {
      results = results.filter(b => b.customer.id === customerId)
    }
    
    // Tri par date de création
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    // Limitation
    results = results.slice(0, limit)
    
    let aiAnalytics = null
    
    // Ajout d'analytics IA si demandé et disponible
    if (includeAnalytics && process.env.OPENAI_API_KEY && enhancedBookings.length > 0) {
      try {
        aiAnalytics = await openaiAPI.optimizeBookingSlots(enhancedBookings)
      } catch (error) {
        console.warn('AI analytics failed:', error)
      }
    }
    
    // Statistiques avancées
    const advancedStats = {
      total_bookings: enhancedBookings.length,
      revenue_total: enhancedBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.pricing.finalPrice, 0),
      average_booking_value: enhancedBookings.length > 0 
        ? enhancedBookings.reduce((sum, b) => sum + b.pricing.finalPrice, 0) / enhancedBookings.length
        : 0,
      conversion_rate: enhancedBookings.length > 0 
        ? (enhancedBookings.filter(b => b.status === 'confirmed').length / enhancedBookings.length) * 100
        : 0,
      popular_services: premiumServices.map(service => ({
        ...service,
        booking_count: enhancedBookings.filter(b => b.service.id === service.id).length
      })).sort((a, b) => b.booking_count - a.booking_count),
      integration_health: {
        email: enhancedBookings.filter(b => b.integrations.emailSent).length,
        sms: enhancedBookings.filter(b => b.integrations.smsSent).length,
        payments: enhancedBookings.filter(b => b.integrations.paymentCreated).length
      }
    }
    
    return NextResponse.json(
      {
        bookings: results,
        stats: advancedStats,
        ai_insights: aiAnalytics,
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