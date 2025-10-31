import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const lexend = Lexend({ 
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'AutoBooker - SaaS de Réservation Intelligent',
  description: 'Automatisez vos réservations avec l\'IA. Plateforme SaaS premium pour la gestion intelligente des réservations et des rendez-vous.',
  keywords: 'réservation, saas, ia, automatisation, booking, rendez-vous',
  authors: [{ name: 'Elvoro-ai' }],
  creator: 'Elvoro-ai',
  publisher: 'AutoBooker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://autobooker.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'AutoBooker - SaaS de Réservation Intelligent',
    description: 'Automatisez vos réservations avec l\'IA. Plateforme SaaS premium pour la gestion intelligente des réservations.',
    siteName: 'AutoBooker',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutoBooker - SaaS de Réservation Intelligent',
    description: 'Automatisez vos réservations avec l\'IA. Plateforme SaaS premium.',
    creator: '@elvoro_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${lexend.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prévention du flash de contenu non stylé
              (function() {
                var theme = localStorage.getItem('theme') || 'light';
                document.documentElement.classList.add(theme);
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          {/* Navigation globale sera ajoutée ici */}
          <main className="relative">
            {children}
          </main>
          
          {/* Footer global sera ajouté ici */}
          <footer className="bg-gray-900 text-white py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-2xl font-bold gradient-text mb-4">AutoBooker</h3>
                  <p className="text-gray-400 mb-4">
                    La plateforme SaaS la plus avancée pour automatiser vos réservations avec l'intelligence artificielle.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <span className="sr-only">Twitter</span>
                      🐦
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <span className="sr-only">LinkedIn</span>
                      💼
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <span className="sr-only">GitHub</span>
                      💻
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Produit</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Statut</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Communauté</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 pt-8 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-400 text-sm">
                    © 2025 AutoBooker. Tous droits réservés.
                  </p>
                  <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Confidentialité
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      CGU
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                      Cookies
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Analytics et scripts */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              // Google Analytics ou autres scripts
              console.log('🚀 AutoBooker SaaS chargé avec succès!');
            `
          }}
        />
      </body>
    </html>
  )
}