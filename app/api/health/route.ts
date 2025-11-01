import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const timestamp = new Date().toISOString()
    const uptime = process.uptime()
    
    // Vérification des variables d'environnement critiques
    const envCheck = {
      nextauth_url: !!process.env.NEXTAUTH_URL,
      jwt_secret: !!process.env.JWT_SECRET,
      calendly_api: !!process.env.CALENDLY_API_KEY,
      openai_api: !!process.env.OPENAI_API_KEY,
      stripe_secret: !!process.env.STRIPE_SECRET_KEY,
      twilio_sid: !!process.env.TWILIO_ACCOUNT_SID,
      gmail_client: !!process.env.GMAIL_CLIENT_ID,
      resend_api: !!process.env.RESEND_API_KEY
    }
    
    const allConfigured = Object.values(envCheck).every(Boolean)
    
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp,
        uptime: `${Math.floor(uptime)}s`,
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        services: {
          database: 'memory', // Sera 'postgresql' avec une vraie DB
          auth: 'jwt',
          payments: 'stripe',
          calendar: 'calendly',
          ai: 'openai',
          sms: 'twilio',
          email: 'resend'
        },
        configuration: {
          all_env_vars_present: allConfigured,
          missing_vars: Object.entries(envCheck)
            .filter(([_, present]) => !present)
            .map(([key]) => key)
        },
        endpoints: {
          auth: '/api/auth/login',
          register: '/api/auth/register',
          booking: '/api/booking',
          dashboard: '/api/dashboard/stats'
        },
        build_info: {
          nextjs: '15.0.3',
          node: process.version,
          platform: process.platform,
          arch: process.arch
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}