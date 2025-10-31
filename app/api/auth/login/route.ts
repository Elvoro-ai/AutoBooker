import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Base de données temporaire en mémoire (en production, utilisez une vraie base de données)
const users = [
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation des champs requis
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Recherche de l'utilisateur
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Préparation de la réponse (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json(
      {
        message: 'Connexion réussie',
        user: userWithoutPassword,
        token
      },
      { status: 200 }
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
    console.error('Erreur lors de la connexion:', error)
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}