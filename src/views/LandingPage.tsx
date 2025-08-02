import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  Database, 
  Zap, 
  Settings,
  Star,
  Github,
  ExternalLink,
  Palette,
  Eye,
  Infinity,
  Sparkles,
  Layout,
  Layers,
  CircleDot,
  Rainbow,
  Wand2
} from 'lucide-react';
import { themes } from '@/themes';


export default function InfinityDashboardLanding() {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* New Interactive Theme Showcase */}
      <InteractiveThemeShowcase onThemeChange={setCurrentTheme} />

      {/* Features Overview */}
      <FeaturesSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        {/* Geometric Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon 
                points="30,4 52,16 52,36 30,48 8,36 8,16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="hero-content text-center relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="space-y-12">
          {/* Logo and Brand */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-30">
                  <Infinity size={120} className="text-primary" />
                </div>
                <Infinity size={120} className="relative text-primary drop-shadow-2xl" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Infinity Dashboard
              </h1>
              <h2 className="text-2xl md:text-3xl text-base-content/80 font-light">
                Dynamic • Customizable • Enterprise-Ready
              </h2>
            </div>
          </div>

          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in animation-delay-200">
            {[
              "30+ Themes", 
              "Dynamic RBAC", 
              "Typography Control", 
              "Real-time Updates",
              "Enterprise Security",
              "Mobile Responsive"
            ].map((feature, index) => (
              <span key={index} className="badge badge-ghost badge-lg px-4 py-2 text-sm font-medium">
                {feature}
              </span>
            ))}
          </div>

          {/* Main Description */}
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in animation-delay-400">
            <h3 className="text-xl md:text-2xl text-base-content/90 leading-relaxed">
              A comprehensive React + FastAPI application featuring dynamic theming, 
              advanced typography controls, and enterprise-grade Role-Based Access Control (RBAC).
            </h3>
            
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
              Built with modern technologies and best practices, Infinity Dashboard provides 
              everything you need for scalable, secure, and beautiful web applications.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-600">
            <button className="btn btn-primary btn-lg group">
              <span>Explore Dashboard</span>
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="btn btn-secondary btn-outline btn-lg">
              <Shield size={20} className="mr-2" />
              Sign In
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in animation-delay-800">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">30+</div>
              <div className="text-base-content/60">Themes</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-secondary">50+</div>
              <div className="text-base-content/60">Components</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-base-content/60">Responsive</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-info">∞</div>
              <div className="text-base-content/60">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// New Interactive Theme Showcase Component
const InteractiveThemeShowcase = ({ onThemeChange } : any) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [showThemeGrid, setShowThemeGrid] = useState(false);

  // Auto-cycle through themes
  useEffect(() => {
    if (!isAutoMode) return;
    
    const interval = setInterval(() => {
      setCurrentThemeIndex(prev => {
        const nextIndex = (prev + 1) % themes.length;
        onThemeChange(themes[nextIndex].name);
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoMode, onThemeChange]);

  const handleThemeSelect = (themeIndex : any) => {
    setCurrentThemeIndex(themeIndex);
    onThemeChange(themes[themeIndex].name);
  };

  return (
    <section className="py-20 bg-base-200 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Rainbow className="w-10 h-10 text-primary" />
            Interactive Theme Studio
            <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Experience our revolutionary theme system with real-time previews, automatic cycling, 
            and instant customization controls.
          </p>
        </div>

        {/* Fixed Theme Preview Card */}
        <div className="flex justify-center mb-12">
          <div className="card bg-base-100 shadow-2xl border border-base-300 w-full max-w-5xl relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
            </div>
            
            <div className="card-body p-8 relative z-10">
              {/* Theme Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <CircleDot className="w-6 h-6 text-primary animate-pulse" />
                  <h3 className="text-3xl font-bold text-primary">
                    {themes[currentThemeIndex]?.displayName}
                  </h3>
                  <CircleDot className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div className="flex justify-center gap-2">
                  <span className={`badge ${themes[currentThemeIndex]?.isDark ? "badge-secondary" : "badge-primary"}`}>
                    {themes[currentThemeIndex]?.isDark ? "Dark Theme" : "Light Theme"}
                  </span>
                  <span className="badge badge-ghost">
                    {currentThemeIndex + 1} of {themes.length}
                  </span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Color Palette Display */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Color Palette
                  </h4>
                  
                  {/* Main Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="w-full h-16 bg-primary rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                        <div className="absolute bottom-2 left-2 text-primary-content text-xs font-medium">
                          Primary
                        </div>
                      </div>
                      <div className="w-full h-16 bg-secondary rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                        <div className="absolute bottom-2 left-2 text-secondary-content text-xs font-medium">
                          Secondary
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-full h-16 bg-accent rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                        <div className="absolute bottom-2 left-2 text-accent-content text-xs font-medium">
                          Accent
                        </div>
                      </div>
                      <div className="w-full h-16 bg-neutral rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                        <div className="absolute bottom-2 left-2 text-neutral-content text-xs font-medium">
                          Neutral
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Colors */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="w-full h-8 bg-success rounded shadow flex items-center justify-center">
                      <span className="text-success-content text-xs font-medium">Success</span>
                    </div>
                    <div className="w-full h-8 bg-warning rounded shadow flex items-center justify-center">
                      <span className="text-warning-content text-xs font-medium">Warning</span>
                    </div>
                    <div className="w-full h-8 bg-error rounded shadow flex items-center justify-center">
                      <span className="text-error-content text-xs font-medium">Error</span>
                    </div>
                    <div className="w-full h-8 bg-info rounded shadow flex items-center justify-center">
                      <span className="text-info-content text-xs font-medium">Info</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Components Preview */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    Component Preview
                  </h4>
                  
                  {/* Buttons */}
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <button className="btn btn-primary btn-sm">Primary</button>
                      <button className="btn btn-secondary btn-sm">Secondary</button>
                      <button className="btn btn-accent btn-sm">Accent</button>
                      <button className="btn btn-ghost btn-sm">Ghost</button>
                    </div>
                    
                    {/* Progress and Loading */}
                    <div className="space-y-2">
                      <progress className="progress progress-primary w-full" value="70" max="100"></progress>
                      <div className="flex items-center gap-2">
                        <span className="loading loading-spinner loading-sm text-primary"></span>
                        <span className="text-sm">Loading components...</span>
                      </div>
                    </div>

                    {/* Form Elements */}
                    <div className="space-y-2">
                      <input type="text" placeholder="Sample input" className="input input-bordered input-sm w-full" />
                      <select className="select select-bordered select-sm w-full">
                        <option>Sample dropdown</option>
                        <option>Option 1</option>
                        <option>Option 2</option>
                      </select>
                    </div>

                    {/* Badges and Alerts */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="badge badge-primary">Primary</span>
                      <span className="badge badge-secondary">Secondary</span>
                      <span className="badge badge-accent">Accent</span>
                      <span className="badge badge-ghost">Ghost</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Control Panel */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    className={`btn btn-sm ${isAutoMode ? 'btn-error' : 'btn-success'}`}
                    onClick={() => setIsAutoMode(!isAutoMode)}
                  >
                    <Wand2 size={16} className="mr-2" />
                    {isAutoMode ? 'Stop Auto' : 'Auto Mode'}
                  </button>
                  
                  <button 
                    className="btn btn-sm btn-ghost"
                    onClick={() => setShowThemeGrid(!showThemeGrid)}
                  >
                    <Layers size={16} className="mr-2" />
                    {showThemeGrid ? 'Hide Grid' : 'Show All'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleThemeSelect((currentThemeIndex - 1 + themes.length) % themes.length)}
                    disabled={isAutoMode}
                  >
                    ←
                  </button>
                  <span className="text-sm px-3 py-1 bg-base-200 rounded">
                    {currentThemeIndex + 1} / {themes.length}
                  </span>
                  <button 
                    className="btn btn-sm btn-ghost"
                    onClick={() => handleThemeSelect((currentThemeIndex + 1) % themes.length)}
                    disabled={isAutoMode}
                  >
                    →
                  </button>
                </div>
              </div>

              {isAutoMode && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <div className="loading loading-dots loading-sm"></div>
                    <span>Auto-cycling through themes every 2 seconds...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Theme Grid */}
          {showThemeGrid && (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title justify-center mb-4">All Available Themes</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-60 overflow-y-auto">
                  {themes.map((theme, index) => (
                    <button
                      key={theme.name}
                      className={`btn btn-sm justify-start ${
                        index === currentThemeIndex 
                          ? 'btn-primary' 
                          : 'btn-ghost'
                      }`}
                      onClick={() => handleThemeSelect(index)}
                      disabled={isAutoMode}
                    >
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        theme.isDark ? 'bg-secondary' : 'bg-primary'
                      }`}></div>
                      <span className="text-xs truncate">{theme.displayName}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body text-center space-y-4">
              <Eye className="w-12 h-12 text-primary mx-auto" />
              <h3 className="card-title justify-center">Real-time Preview</h3>
              <p className="text-base-content/70">
                See theme changes instantly across all components without any delay or page refresh.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body text-center space-y-4">
              <Settings className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="card-title justify-center">Auto-Cycling Mode</h3>
              <p className="text-base-content/70">
                Let the system automatically cycle through themes to showcase the full range of possibilities.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body text-center space-y-4">
              <Sparkles className="w-12 h-12 text-accent mx-auto" />
              <h3 className="card-title justify-center">30+ Themes</h3>
              <p className="text-base-content/70">
                From professional corporate themes to vibrant creative palettes, find the perfect look for your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "JWT authentication, password hashing, rate limiting, and comprehensive security headers.",
      highlights: ["JWT Tokens", "bcrypt Hashing", "Rate Limiting", "CORS Protection"]
    },
    {
      icon: Users,
      title: "Dynamic RBAC System", 
      description: "Create roles and permissions on-demand without hardcoding. Full user lifecycle management.",
      highlights: ["Dynamic Roles", "Granular Permissions", "User Management", "Role Inheritance"]
    },
    {
      icon: Database,
      title: "Advanced Database",
      description: "PostgreSQL with SQLAlchemy ORM, migrations, connection pooling, and audit trails.",
      highlights: ["PostgreSQL", "Migrations", "Connection Pooling", "Audit Logs"]
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "Optimized Docker builds, caching, health checks, and production-ready configurations.",
      highlights: ["Docker Ready", "Health Checks", "Caching", "Monitoring"]
    }
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            🚀 Comprehensive Feature Set
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Everything you need for building modern, scalable, and secure web applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="card-body space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="card-title text-lg">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-base-content/70">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight, hIndex) => (
                    <span key={hIndex} className="badge badge-ghost text-xs">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Section  
const FooterSection = () => {
  return (
    <footer className="bg-base-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Infinity size={32} />
              <h3 className="text-xl font-bold">Infinity</h3>
            </div>
            <p className="text-sm text-base-content/70">
              Enterprise-grade dashboard with dynamic theming and advanced RBAC system.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-primary">Dynamic Themes</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">RBAC System</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">Typography Control</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">API Documentation</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/docs" className="text-base-content/70 hover:text-primary">API Docs</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">GitHub</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">Examples</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex space-x-3">
              <a href="#" className="text-base-content/70 hover:text-primary">
                <Github size={20} />
              </a>
              <a href="#" className="text-base-content/70 hover:text-primary">
                <Star size={20} />
              </a>
              <a href="#" className="text-base-content/70 hover:text-primary">
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="divider my-8"></div>

        <div className="text-center">
          <p className="text-sm text-base-content/60">
            © 2024 Infinity Dashboard. Built with ❤️ using React, FastAPI, and modern web technologies.
          </p>
        </div>
      </div>
    </footer>
  );
};