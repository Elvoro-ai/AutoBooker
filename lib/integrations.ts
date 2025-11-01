// AutoBooker - Intégrations API avec services externes
// Configuration sécurisée des API keys via variables d'environnement

// Types pour les réponses API
export interface CalendlyEvent {
  uri: string
  name: string
  status: string
  start_time: string
  end_time: string
  event_type: string
  location?: {
    type: string
    location?: string
  }
  invitees_counter: {
    total: number
    active: number
    limit: number
  }
}

export interface StripePayment {
  id: string
  amount: number
  currency: string
  status: string
  customer?: string
  metadata?: Record<string, string>
}

// Calendly API Integration
export class CalendlyAPI {
  private apiKey: string
  private baseURL = 'https://api.calendly.com'

  constructor() {
    this.apiKey = process.env.CALENDLY_API_KEY || ''
    if (!this.apiKey) {
      console.warn('CALENDLY_API_KEY non configurée')
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Calendly API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getUser() {
    return this.request('/users/me')
  }

  async getEvents(user: string, options: {
    count?: number
    page_token?: string
    sort?: 'start_time:asc' | 'start_time:desc'
    status?: 'active' | 'canceled'
    min_start_time?: string
    max_start_time?: string
  } = {}) {
    const params = new URLSearchParams()
    params.append('user', user)
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString())
      }
    })

    return this.request(`/scheduled_events?${params.toString()}`)
  }

  async createWebhook(url: string, events: string[]) {
    return this.request('/webhook_subscriptions', {
      method: 'POST',
      body: JSON.stringify({
        url,
        events,
        organization: process.env.CALENDLY_ORGANIZATION_URI,
        scope: 'organization'
      })
    })
  }
}

// OpenAI API Integration
export class OpenAIAPI {
  private apiKey: string
  private baseURL = 'https://api.openai.com/v1'

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('OPENAI_API_KEY non configurée')
    }
  }

  async generateBookingConfirmation(booking: {
    customerName: string
    service: string
    date: string
    time: string
  }) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant IA d\'AutoBooker. Génère des messages de confirmation de réservation personnalisés, professionnels et chaleureux en français.'
          },
          {
            role: 'user',
            content: `Génère un message de confirmation pour: Client: ${booking.customerName}, Service: ${booking.service}, Date: ${booking.date}, Heure: ${booking.time}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Confirmation générée'
  }

  async optimizeBookingSlots(pastBookings: any[]) {
    // Analyse IA pour optimiser les créneaux
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Analyse les données de réservation et suggère des optimisations pour améliorer le taux de conversion.'
          },
          {
            role: 'user',
            content: `Analyse ces données de réservation: ${JSON.stringify(pastBookings.slice(0, 10))}`
          }
        ],
        max_tokens: 300
      })
    })

    const data = await response.json()
    return data.choices[0]?.message?.content || 'Analyse non disponible'
  }
}

// Stripe API Integration
export class StripeAPI {
  private secretKey: string
  private publishableKey: string
  private baseURL = 'https://api.stripe.com/v1'

  constructor() {
    this.secretKey = process.env.STRIPE_SECRET_KEY || ''
    this.publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || ''
    if (!this.secretKey) {
      console.warn('STRIPE_SECRET_KEY non configurée')
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Stripe API Error: ${response.status}`)
    }

    return response.json()
  }

  async createPaymentIntent(amount: number, currency = 'eur', metadata: Record<string, string> = {}) {
    const params = new URLSearchParams({
      amount: amount.toString(),
      currency,
      'metadata[booking_id]': metadata.booking_id || '',
      'metadata[customer_name]': metadata.customer_name || '',
      'metadata[service]': metadata.service || ''
    })

    return this.request('/payment_intents', {
      method: 'POST',
      body: params
    })
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    return this.request(`/payment_intents/${paymentIntentId}`)
  }

  async createCustomer(email: string, name: string, metadata: Record<string, string> = {}) {
    const params = new URLSearchParams({
      email,
      name,
      ...Object.fromEntries(Object.entries(metadata).map(([k, v]) => [`metadata[${k}]`, v]))
    })

    return this.request('/customers', {
      method: 'POST',
      body: params
    })
  }
}

// Twilio API Integration
export class TwilioAPI {
  private accountSid: string
  private authToken: string
  private phoneNumber: string
  private baseURL: string

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || ''
    this.authToken = process.env.TWILIO_AUTH_TOKEN || ''
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || ''
    this.baseURL = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`
    
    if (!this.accountSid || !this.authToken) {
      console.warn('Twilio credentials non configurées')
    }
  }

  async sendSMS(to: string, message: string) {
    const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')
    
    const response = await fetch(`${this.baseURL}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: this.phoneNumber,
        To: to,
        Body: message
      })
    })

    if (!response.ok) {
      throw new Error(`Twilio API Error: ${response.status}`)
    }

    return response.json()
  }

  async sendBookingConfirmation(to: string, booking: {
    customerName: string
    service: string
    date: string
    time: string
    confirmationCode: string
  }) {
    const message = `🎉 AutoBooker - Réservation confirmée !

Bonjour ${booking.customerName},

Votre réservation est confirmée :
• Service: ${booking.service}
• Date: ${booking.date}
• Heure: ${booking.time}
• Code: ${booking.confirmationCode}

Merci de votre confiance !
AutoBooker Team`

    return this.sendSMS(to, message)
  }

  async sendReminder(to: string, booking: any) {
    const message = `⏰ Rappel AutoBooker

RDV demain à ${booking.time} pour ${booking.service}.

Code: ${booking.confirmationCode}

À bientôt !`

    return this.sendSMS(to, message)
  }
}

// Gmail API Integration
export class GmailAPI {
  private clientId: string
  private clientSecret: string
  private refreshToken: string

  constructor() {
    this.clientId = process.env.GMAIL_CLIENT_ID || ''
    this.clientSecret = process.env.GMAIL_CLIENT_SECRET || ''
    this.refreshToken = process.env.GMAIL_REFRESH_TOKEN || ''
    
    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      console.warn('Gmail OAuth credentials non configurées')
    }
  }

  private async getAccessToken() {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      })
    })

    const data = await response.json()
    return data.access_token
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent?: string) {
    const accessToken = await this.getAccessToken()
    
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      htmlContent
    ].join('\n')

    const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedEmail
      })
    })

    if (!response.ok) {
      throw new Error(`Gmail API Error: ${response.status}`)
    }

    return response.json()
  }

  async sendBookingConfirmation(to: string, booking: any) {
    const subject = `🎉 Confirmation de votre réservation AutoBooker - ${booking.confirmationCode}`
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">✨ AutoBooker</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Réservation confirmée avec succès !</p>
        </div>
        
        <div style="padding: 30px; background-color: #f8fafc;">
          <h2 style="color: #334155; margin-bottom: 20px;">Bonjour ${booking.customer.firstName} 👋</h2>
          
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Votre réservation a été confirmée avec succès. Voici les détails :
          </p>
          
          <div style="background: white; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
            <table style="width: 100%; border-spacing: 0;">
              <tr><td style="padding: 8px 0; color: #64748b;">Service :</td><td style="padding: 8px 0; font-weight: bold; color: #334155;">${booking.serviceName}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Date :</td><td style="padding: 8px 0; font-weight: bold; color: #334155;">${booking.date}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Heure :</td><td style="padding: 8px 0; font-weight: bold; color: #334155;">${booking.time}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Durée :</td><td style="padding: 8px 0; font-weight: bold; color: #334155;">${booking.serviceDuration}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Code de confirmation :</td><td style="padding: 8px 0; font-weight: bold; color: #667eea;">${booking.confirmationCode}</td></tr>
            </table>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #0369a1; margin: 0 0 10px 0;">💡 Informations importantes</h3>
            <ul style="color: #0c4a6e; margin: 0; padding-left: 20px;">
              <li>Conservez ce code de confirmation : <strong>${booking.confirmationCode}</strong></li>
              <li>Un rappel vous sera envoyé 24h avant le rendez-vous</li>
              <li>En cas d'empêchement, prévenez-nous au moins 2h à l'avance</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://autobooker.vercel.app/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accéder au Dashboard</a>
          </div>
        </div>
        
        <div style="background: #334155; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; opacity: 0.8;">Merci de faire confiance à AutoBooker !</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.6;">Cette confirmation a été générée automatiquement.</p>
        </div>
      </div>
    `

    return this.sendEmail(to, subject, htmlContent)
  }
}

// Export des instances configurées
export const calendlyAPI = new CalendlyAPI()
export const openaiAPI = new OpenAIAPI()
export const stripeAPI = new StripeAPI()
export const twilioAPI = new TwilioAPI()
export const gmailAPI = new GmailAPI()