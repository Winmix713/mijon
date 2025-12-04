/**
 * WinMix Prototype Mock Data
 * Contains sample data for features, avatars, testimonials, and integrations
 */

const MOCK_AVATARS = [
  {
    id: '1',
    name: 'Maria Chen',
    role: 'Professional Tipster',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%2310b981" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3EMC%3C/text%3E%3C/svg%3E',
    badge: 'Top Predictor'
  },
  {
    id: '2',
    name: 'James O\'Brien',
    role: 'Data Analyst',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23a855f7" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3EJO%3C/text%3E%3C/svg%3E',
    badge: '500+ Wins'
  },
  {
    id: '3',
    name: 'Priya Patel',
    role: 'Data Scientist',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%230891b2" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3EPP%3C/text%3E%3C/svg%3E',
    badge: null
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    role: 'Coach',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23f59e0b" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3EAH%3C/text%3E%3C/svg%3E',
    badge: null
  },
  {
    id: '5',
    name: 'Sophie Laurent',
    role: 'Sports Journalist',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23ec4899" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3ESL%3C/text%3E%3C/svg%3E',
    badge: null
  },
  {
    id: '6',
    name: 'Marcus Johnson',
    role: 'Statistician',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%238b5cf6" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3EMJ%3C/text%3E%3C/svg%3E',
    badge: null
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    role: 'Investment Manager',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%2306b6d4" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3ELA%3C/text%3E%3C/svg%3E',
    badge: '1000+ ROI'
  },
  {
    id: '8',
    name: 'Carlos Rodriguez',
    role: 'Algorithm Specialist',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%2310b981" width="120" height="120"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold"%3ECR%3C/text%3E%3C/svg%3E',
    badge: null
  }
];

const MOCK_FEATURES = [
  {
    icon: '⚡',
    title: 'AI-Powered Analysis',
    description: 'Advanced pattern recognition trained on years of football data with continuous learning',
    metrics: ['Real-time', 'ML-Driven']
  },
  {
    icon: '🎯',
    title: 'Real-time Predictions',
    description: 'Generate detailed match predictions in seconds with confidence intervals',
    metrics: ['Instant', 'Accurate']
  },
  {
    icon: '📊',
    title: 'Cross-League Intelligence',
    description: 'Discover meta-patterns across 50+ international football leagues',
    metrics: ['Global', 'Comprehensive']
  },
  {
    icon: '🏆',
    title: 'Confidence Metrics',
    description: 'View explainable confidence scores and win probability distributions',
    metrics: ['Transparent', 'Explainable']
  },
  {
    icon: '🔄',
    title: 'Continuous Learning',
    description: 'Models improve daily through our intelligent feedback loop system',
    metrics: ['Adaptive', 'Self-Improving']
  },
  {
    icon: '📈',
    title: 'Market Integration',
    description: 'Blend market odds with AI predictions for maximum edge discovery',
    metrics: ['Smart', 'Profitable']
  }
];

const MOCK_TESTIMONIALS = [
  {
    id: '1',
    quote: 'WinMix transformed how I analyze matches. I\'ve gone from 65% to 89% accuracy in just 3 months. This is genuinely game-changing technology.',
    author: 'Maria Chen',
    role: 'Professional Tipster',
    location: 'Shanghai',
    rating: 5,
    metric: '89% Accuracy'
  },
  {
    id: '2',
    quote: 'The cross-league intelligence feature revealed patterns I never would have spotted manually. My win rate jumped by 24% in the first month alone.',
    author: 'James O\'Brien',
    role: 'Data Analyst',
    location: 'London',
    rating: 5,
    metric: '+24% Win Rate'
  },
  {
    id: '3',
    quote: 'As an institutional investor, I needed governance and transparency. WinMix delivers both with an elegant interface and bulletproof audit trails.',
    author: 'Lisa Anderson',
    role: 'Investment Manager',
    location: 'New York',
    rating: 5,
    metric: '+1000% ROI'
  },
  {
    id: '4',
    quote: 'I was skeptical about AI predictions, but the confidence intervals and explainability features convinced me. Now I use it daily.',
    author: 'Carlos Rodriguez',
    role: 'Algorithm Specialist',
    location: 'Madrid',
    rating: 5,
    metric: '92% Accuracy'
  },
  {
    id: '5',
    quote: 'The real-time updates and rapid analysis changed my entire prediction strategy. Integration was seamless and support was exceptional.',
    author: 'Sophie Laurent',
    role: 'Sports Journalist',
    location: 'Paris',
    rating: 5,
    metric: '5⭐ Experience'
  }
];

const MOCK_INTEGRATIONS = [
  { id: 1, name: 'Pinnacle', logo: '🎯', status: 'active', color: '#10b981' },
  { id: 2, name: 'Betfair', logo: '⚡', status: 'active', color: '#10b981' },
  { id: 3, name: 'SofaSoft', logo: '📊', status: 'active', color: '#10b981' },
  { id: 4, name: 'Flashcore', logo: '🔗', status: 'connecting', color: '#f59e0b' },
  { id: 5, name: 'Opta', logo: '⚙️', status: 'active', color: '#10b981' },
  { id: 6, name: 'Genius Sports', logo: '🎓', status: 'active', color: '#10b981' },
  { id: 7, name: 'Live Score', logo: '📱', status: 'connecting', color: '#f59e0b' },
  { id: 8, name: 'StatsBomb', logo: '📈', status: 'active', color: '#10b981' },
  { id: 9, name: 'API Hub', logo: '🌐', status: 'active', color: '#10b981' }
];

// Make available globally for the prototype script
window.MOCK_AVATARS = MOCK_AVATARS;
window.MOCK_FEATURES = MOCK_FEATURES;
window.MOCK_TESTIMONIALS = MOCK_TESTIMONIALS;
window.MOCK_INTEGRATIONS = MOCK_INTEGRATIONS;
