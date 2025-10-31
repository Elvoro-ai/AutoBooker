'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CalendarDays, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Clock, 
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Réservation Instantanée',
    description: 'Réservez en un clic avec notre IA avancée qui trouve automatiquement les meilleurs créneaux.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Sécurité Maximale',
    description: 'Vos données sont protégées par un chiffrement de niveau bancaire et une authentification multi-facteurs.',
    color: 'from-green-400 to-blue-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avancées',
    description: 'Tableaux de bord en temps réel avec insights IA pour optimiser vos taux de réservation.',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: Users,
    title: 'Gestion Multi-Utilisateurs',
    description: 'Collaborez efficacement avec votre équipe grâce aux rôles et permissions granulaires.',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    icon: Clock,
    title: 'Automatisation 24/7',
    description: 'Notre IA travaille pour vous 24h/24, même pendant votre sommeil.',
    color: 'from-red-400 to-pink-500'
  },
  {
    icon: CalendarDays,
    title: 'Intégrations Natives',
    description: 'Synchronisation parfaite avec Google Calendar, Outlook, Zoom et plus de 100 autres outils.',
    color: 'from-teal-400 to-cyan-500'
  }
]

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'CEO, TechStart',
    content: 'AutoBooker a révolutionné notre gestion des rendez-vous. +300% de conversions en 2 mois !',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    name: 'Thomas Dubois',
    role: 'Fondateur, MedCare',
    content: 'L\'IA d\'AutoBooker prédit parfaitement les annulations. Un gain de temps incroyable.',
    rating: 5,
    avatar: '👨‍⚕️'
  },
  {
    name: 'Marie Leclerc',
    role: 'Directrice, EduPlus',
    content: 'Interface intuitive, support excellent. Nos étudiants adorent la simplicité.',
    rating: 5,
    avatar: '👩‍🏫'
  }
]

const stats = [
  { label: 'Réservations Traitées', value: '2.4M+', suffix: '' },
  { label: 'Clients Satisfaits', value: '12K+', suffix: '' },
  { label: 'Temps Économisé', value: '85%', suffix: '' },
  { label: 'Taux de Conversion', value: '94%', suffix: '' }
]

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 glass-effect"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold gradient-text">AutoBooker</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Témoignages</a>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Connexion
              </Link>
              <Link href="/register" className="btn-primary">
                Essai Gratuit
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">Révolutionnez</span><br />
                <span className="text-gray-900">Vos Réservations</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                L'IA la plus avancée pour automatiser, optimiser et transformer 
                votre processus de réservation en machine à conversions.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link href="/register" className="btn-primary text-lg px-8 py-4 group">
                Démarrer Gratuitement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/demo" className="btn-secondary text-lg px-8 py-4">
                Voir la Démo
              </Link>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fonctionnalités <span className="gradient-text">Exceptionnelles</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment AutoBooker transforme chaque aspect de votre processus de réservation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 group hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-6 group-hover:animate-pulse`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos Clients <span className="gradient-text">Adorent</span> AutoBooker
            </h2>
            <p className="text-xl text-gray-600">
              Rejoignez des milliers d'entreprises qui ont transformé leurs réservations
            </p>
          </div>
          
          <div className="relative">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card-premium p-12 max-w-4xl mx-auto text-center"
            >
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl font-medium text-gray-900 mb-8 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-4xl">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à Révolutionner Vos Réservations ?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Rejoignez plus de 12 000 entreprises qui font confiance à AutoBooker pour leurs réservations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
              Commencer Maintenant - Gratuit
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-all duration-200">
              Parler à un Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}