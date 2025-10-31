# 🚀 AutoBooker SaaS - Plateforme de Réservation Intelligente

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

> La plateforme SaaS la plus avancée pour automatiser vos réservations avec l'intelligence artificielle.

## ✨ Fonctionnalités Principales

### 🎯 **Core Features**
- **Réservation Instantanée** - Réservez en un clic avec notre IA avancée
- **Dashboard Analytics** - Tableaux de bord en temps réel avec insights IA
- **Gestion Multi-Utilisateurs** - Rôles et permissions granulaires
- **Automatisation 24/7** - Notre IA travaille pour vous en permanence
- **Intégrations Natives** - Google Calendar, Outlook, Zoom et 100+ outils
- **Sécurité Maximale** - Chiffrement de niveau bancaire

### 🚀 **Technologies Utilisées**
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + JWT Authentication
- **Base de données**: PostgreSQL + Prisma ORM
- **Animations**: Framer Motion
- **UI Components**: Radix UI + Lucide Icons
- **Deployment**: Vercel + Serverless Functions

## 🛠️ Installation et Configuration

### Prérequis
- Node.js 18.17.0 ou supérieur
- npm ou yarn
- PostgreSQL (optionnel pour développement)

### Installation

```bash
# Cloner le repository
git clone https://github.com/Elvoro-ai/AutoBooker.git
cd AutoBooker

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Configurer les variables d'environnement
# Éditer .env.local avec vos valeurs

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

### Configuration des Variables d'Environnement

```bash
# Minimum requis pour le développement
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=votre-jwt-secret-super-securise
DATABASE_URL="postgresql://username:password@localhost:5432/autobooker"
```

Voir `.env.example` pour la configuration complète.

## 📁 Structure du Projet

```
AutBooker/
├── app/                          # App Router Next.js 15
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentification
│   │   ├── booking/              # Gestion réservations
│   │   └── dashboard/            # Statistiques
│   ├── dashboard/                # Dashboard principal
│   ├── login/                    # Page connexion
│   ├── register/                 # Page inscription
│   ├── booking/                  # Page réservation
│   ├── globals.css               # Styles globaux
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Page d'accueil
├── components/                    # Composants réutilisables
├── lib/                          # Utilitaires et config
├── public/                       # Fichiers statiques
├── styles/                       # Styles additionnels
└── types/                        # Types TypeScript
```

## 🚀 Déploiement

### Déploiement sur Vercel (Recommandé)

1. **Connecter à Vercel**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Configuration Vercel**
   - Framework Preset: **Next.js**
   - Build Command: (laisser vide)
   - Output Directory: (laisser vide)
   - Install Command: (laisser vide)

3. **Variables d'Environnement**
   ```bash
   # Dans Vercel Dashboard > Settings > Environment Variables
   NEXTAUTH_URL=https://votre-domaine.vercel.app
   JWT_SECRET=votre-jwt-secret-production
   DATABASE_URL=votre-database-url-production
   ```

### Déploiement Manuel

```bash
# Build de production
npm run build

# Test local du build
npm run start

# Déployer sur votre plateforme préférée
```

## 📚 API Documentation

### Authentication

```typescript
// POST /api/auth/login
{
  "email": "demo@autobooker.com",
  "password": "demo123"
}

// POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "password": "securepassword"
}
```

### Bookings

```typescript
// POST /api/booking
{
  "service": {
    "id": 1,
    "name": "Consultation Premium",
    "price": 150
  },
  "date": "2025-11-01",
  "time": "14:30",
  "customer": {
    "firstName": "Sophie",
    "lastName": "Martin",
    "email": "sophie@example.com",
    "phone": "06 12 34 56 78"
  }
}

// GET /api/booking?status=confirmed&limit=10
// PUT /api/booking (mise à jour)
// DELETE /api/booking?id=1 (annulation)
```

### Dashboard Stats

```typescript
// GET /api/dashboard/stats
// GET /api/dashboard/stats?period=7d&section=overview
```

## 🔐 Sécurité

- **JWT Authentication** avec tokens sécurisés
- **Password Hashing** avec bcrypt (12 rounds)
- **HTTP-Only Cookies** pour les tokens
- **CORS Configuration** pour les API
- **Input Validation** sur tous les endpoints
- **Rate Limiting** sur les API sensibles
- **Headers de Sécurité** (CSP, HSTS, etc.)

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage

# Linting
npm run lint

# Type checking
npm run type-check
```

## 👥 Comptes de Démonstration

```
👨‍💼 Utilisateur Demo:
Email: demo@autobooker.com
Mot de passe: demo123

🔑 Administrateur:
Email: admin@autobooker.com  
Mot de passe: demo123
```

## 📊 Performances

- **Lighthouse Score**: 95+ sur tous les métriques
- **Core Web Vitals**: Optimisé pour les performances
- **Bundle Size**: Optimisé avec code splitting
- **SEO**: Meta tags et structure optimisés
- **Accessibility**: Conforme aux standards WCAG

## 🔄 Roadmap

### Version 1.1 (Novembre 2025)
- [ ] Intégration Stripe pour paiements
- [ ] Notifications push en temps réel
- [ ] API Webhook pour intégrations tierces
- [ ] Export PDF des réservations

### Version 1.2 (Décembre 2025)
- [ ] Application mobile React Native
- [ ] IA prédictive pour optimisation créneaux
- [ ] Système de reviews et notes
- [ ] Multi-langue (EN, ES, DE)

### Version 2.0 (Q1 2026)
- [ ] Marketplace de services
- [ ] Outils de marketing automatisé
- [ ] Intégration CRM avancée
- [ ] Analytics prédictives avec ML

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📧 Support

- **Documentation**: [docs.autobooker.com](https://docs.autobooker.com)
- **Email**: support@autobooker.com
- **Discord**: [Communauté AutoBooker](https://discord.gg/autobooker)
- **GitHub Issues**: [Issues](https://github.com/Elvoro-ai/AutoBooker/issues)

## 👏 Remerciements

- **Next.js Team** pour le framework incroyable
- **Vercel** pour la plateforme de déploiement
- **Tailwind CSS** pour le système de design
- **Framer Motion** pour les animations fluides
- **Communauté Open Source** pour l'inspiration

---

<div align="center">
  <p><strong>Fait avec ❤️ par l'équipe Elvoro AI</strong></p>
  <p>
    <a href="https://github.com/Elvoro-ai">GitHub</a> • 
    <a href="https://twitter.com/elvoro_ai">Twitter</a> • 
    <a href="https://linkedin.com/company/elvoro-ai">LinkedIn</a>
  </p>
</div>