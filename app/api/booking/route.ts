import { NextRequest, NextResponse } from 'next/server'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Base de données temporaire pour les réservations
let bookings: any[] = [
  {
    id: 1,
    serviceId: 1,
    serviceName: 'Consultation Premium',
    servicePrice: 150,
    serviceDuration: '60 min',
    date: '2025-11-01',
    time: '14:30',
    status: 'confirmed',
    customer: {
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@email.com',
      phone: '06 12 34 56 78',
      company: 'TechStart'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    confirmationCode: 'AB-001-2025',
    notes: 'Première consultation pour optimisation processus'
  },
  {
    id: 2,
    serviceId: 2,
    serviceName: 'Formation IA',
    servicePrice: 300,
    serviceDuration: '2h',
    date: '2025-11-02',
    time: '09:00',
    status: 'confirmed',
    customer: {
      firstName: 'Thomas',
      lastName: 'Dubois',
      email: 'thomas.dubois@medcare.fr',
      phone: '06 98 76 54 32',
      company: 'MedCare'
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Hier
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    confirmationCode: 'AB-002-2025',
    notes: 'Formation spécialisée pour équipe médicale'
  }
]

// Services disponibles
const services = [
  {
    id: 1,
    name: 'Consultation Premium',
    duration: '60 min',
    price: 150,
    description: 'Séance de consultation approfondie avec nos experts',
    category: 'consultation'
  },
  {
    id: 2,
    name: 'Formation IA',
    duration: '2h',
    price: 300,
    description: 'Formation complète sur les outils d\'intelligence artificielle',
    category: 'formation'
  },
  {
    id: 3,
    name: 'Audit Processus',
    duration: '90 min',
    price: 250,
    description: 'Analyse et optimisation de vos processus métier',
    category: 'audit'
  },
  {
    id: 4,
    name: 'Workshop Innovation',
    duration: '3h',
    price: 450,
    description: 'Atelier collaboratif pour stimuler l\'innovation',
    category: 'workshop'
  }
]

// Génération d'un code de confirmation unique
function generateConfirmationCode(): string {
  const year = new Date().getFullYear()
  const nextId = bookings.length + 1
  return `AB-${nextId.toString().padStart(3, '0')}-${year}`
}

// Validation des créneaux horaires
function isValidTimeSlot(date: string, time: string): boolean {
  const bookingDateTime = new Date(`${date}T${time}:00`)
  const now = new Date()
  
  // Vérifier que la date n'est pas dans le passé
  if (bookingDateTime <= now) {
    return false
  }
  
  // Vérifier que le créneau n'est pas déjà réservé
  const conflictingBooking = bookings.find(booking => 
    booking.date === date && 
    booking.time === time && 
    booking.status !== 'cancelled'
  )
  
  return !conflictingBooking
}

// Fonction d'envoi d'email (simulation)
function sendConfirmationEmail(booking: any): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulation d'envoi d'email
    console.log(`📧 Email de confirmation envoyé à ${booking.customer.email}`)
    console.log(`Code de confirmation: ${booking.confirmationCode}`)
    console.log(`Service: ${booking.serviceName}`)
    console.log(`Date: ${format(new Date(booking.date), 'EEEE dd MMMM yyyy', { locale: fr })}`)
    console.log(`Heure: ${booking.time}`)
    resolve(true)
  })
}

// POST - Créer une nouvelle réservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service, date, time, customer } = body

    // Validation des données requises
    if (!service?.id || !date || !time || !customer) {
      return NextResponse.json(
        { message: 'Données de réservation incomplètes' },
        { status: 400 }
      )
    }

    // Validation des informations client
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      return NextResponse.json(
        { message: 'Informations client incomplètes' },
        { status: 400 }
      )
    }

    // Vérification que le service existe
    const selectedService = services.find(s => s.id === service.id)
    if (!selectedService) {
      return NextResponse.json(
        { message: 'Service non trouvé' },
        { status: 404 }
      )
    }

    // Vérification de la disponibilité du créneau
    if (!isValidTimeSlot(date, time)) {
      return NextResponse.json(
        { message: 'Créneau non disponible' },
        { status: 409 }
      )
    }

    // Création de la réservation
    const newBooking = {
      id: bookings.length + 1,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      date,
      time,
      status: 'confirmed',
      customer: {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
        company: customer.company?.trim() || ''
      },
      notes: customer.message?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmationCode: generateConfirmationCode(),
      paymentStatus: 'pending',
      reminderSent: false
    }

    // Ajout à la base de données
    bookings.push(newBooking)

    // Envoi de l'email de confirmation (simulation)
    await sendConfirmationEmail(newBooking)

    return NextResponse.json(
      {
        message: 'Réservation créée avec succès',
        booking: newBooking
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// GET - Récupérer les réservations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const customerId = searchParams.get('customerId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredBookings = [...bookings]

    // Filtrage par statut
    if (status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status)
    }

    // Filtrage par date
    if (date) {
      filteredBookings = filteredBookings.filter(booking => booking.date === date)
    }

    // Filtrage par client (par email)
    if (customerId) {
      filteredBookings = filteredBookings.filter(booking => 
        booking.customer.email === customerId
      )
    }

    // Tri par date de création (plus récent en premier)
    filteredBookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Pagination
    const total = filteredBookings.length
    const paginatedBookings = filteredBookings.slice(offset, offset + limit)

    // Statistiques
    const stats = {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      pending: bookings.filter(b => b.status === 'pending').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.servicePrice, 0)
    }

    return NextResponse.json(
      {
        bookings: paginatedBookings,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        },
        stats
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

// PUT - Mettre à jour une réservation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, date, time, notes } = body

    if (!id) {
      return NextResponse.json(
        { message: 'ID de réservation requis' },
        { status: 400 }
      )
    }

    const bookingIndex = bookings.findIndex(b => b.id === id)
    if (bookingIndex === -1) {
      return NextResponse.json(
        { message: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Mise à jour des champs autorisés
    const booking = bookings[bookingIndex]
    
    if (status) booking.status = status
    if (date) booking.date = date
    if (time) booking.time = time
    if (notes) booking.notes = notes
    
    booking.updatedAt = new Date().toISOString()

    return NextResponse.json(
      {
        message: 'Réservation mise à jour avec succès',
        booking
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Annuler une réservation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    if (!id) {
      return NextResponse.json(
        { message: 'ID de réservation requis' },
        { status: 400 }
      )
    }

    const bookingIndex = bookings.findIndex(b => b.id === id)
    if (bookingIndex === -1) {
      return NextResponse.json(
        { message: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Annulation (soft delete)
    bookings[bookingIndex].status = 'cancelled'
    bookings[bookingIndex].updatedAt = new Date().toISOString()

    return NextResponse.json(
      {
        message: 'Réservation annulée avec succès',
        booking: bookings[bookingIndex]
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error)
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}