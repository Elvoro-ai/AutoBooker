import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Base de données temporaire en mémoire (en production, utilisez une vraie base de données)
let users = [
  {
    id: 1,
    email: 'demo@autobooker.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4dg.bV4q2G', // demo123
    firstName: 'Demo',
    lastName: 'User',
    company: 'AutoBooker Demo',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'admin@autobooker.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4dg.bV4q2G', // demo123
    firstName: 'Admin',
    lastName: 'AutoBooker',
    company: 'AutoBooker',
    role: 'admin',
    createdAt: new Date().toISOString()
  }
]

const JWT_SECRET = process.env.JWT_SECRET || 'autobooker-secret-key-change-in-production'

// Fonction de validation email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Fonction de validation mot de passe
function isValidPassword(password: string): boolean {
  return password.length >= 8
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, company, password } = body

    // Validation des champs requis
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    // Validation du format email
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Validation du mot de passe
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Vérification si l'email existe déjà
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { message: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    // Hashage du mot de passe
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Création du nouvel utilisateur
    const newUser = {
      id: users.length + 1,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company?.trim() || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      emailVerified: false, // En production, implémenter la vérification email
      plan: 'free',
      subscription: {
        status: 'active',
        plan: 'free',
        startDate: new Date().toISOString(),
        features: [
          'reservations_basic',
          'calendar_sync',
          'email_notifications'
        ]
      }
    }

    // Ajout à la base de données temporaire
    users.push(newUser)

    // Génération du token JWT
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Préparation de la réponse (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser

    const response = NextResponse.json(
      {
        message: 'Compte créé avec succès',
        user: userWithoutPassword,
        token
      },
      { status: 201 }
    )

    // Définition du cookie HTTP-only pour le token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Méthode GET pour obtenir des statistiques (admin uniquement)
export async function GET(request: NextRequest) {
  try {
    // En production, vérifier les permissions admin
    const stats = {
      totalUsers: users.length,
      newUsersToday: users.filter(user => {
        const today = new Date().toDateString()
        const userDate = new Date(user.createdAt).toDateString()
        return today === userDate
      }).length,
      activeUsers: users.filter(user => user.role !== 'inactive').length
    }

    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Méthode OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}